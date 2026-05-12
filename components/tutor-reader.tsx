"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { HelpCircle, Mic, Sparkles, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type AssessmentWord = {
  wordIndex: number;
  expectedWord: string;
  spokenWord: string | null;
  accuracyScore: number;
  status: "correct" | "close" | "missed";
};

type TutorReaderProps = {
  livingProfileId: string;
  storyId?: string | null;
  pageNumber?: number;
  targetText: string;
  companionReaction?: string;
  companionModeEnabled?: boolean;
};

type ReaderMode = "read-to-me" | "i-can-read";
type MicrophoneState = "not-requested" | "requesting" | "granted" | "denied" | "unavailable";

export function TutorReader({
  livingProfileId,
  storyId = null,
  pageNumber = 1,
  targetText,
  companionReaction = "",
  companionModeEnabled = true,
}: TutorReaderProps) {
  const [activeWord, setActiveWord] = useState(-1);
  const [assessmentWords, setAssessmentWords] = useState<AssessmentWord[]>([]);
  const [mode, setMode] = useState<ReaderMode>("i-can-read");
  const [microphoneState, setMicrophoneState] = useState<MicrophoneState>("not-requested");
  const [message, setMessage] = useState("Choose a reading mode to begin.");
  const [hint, setHint] = useState("");
  const [companionMessage, setCompanionMessage] = useState("");
  const [starDust, setStarDust] = useState(0);
  const [isPending, startTransition] = useTransition();
  const activeTimers = useRef<number[]>([]);
  const words = useMemo(() => targetText.split(/\s+/).filter(Boolean), [targetText]);

  useEffect(() => {
    return () => {
      activeTimers.current.forEach((timer) => window.clearTimeout(timer));
      activeTimers.current = [];
    };
  }, []);

  useEffect(() => {
    if (activeWord < 0 || assessmentWords.length > 0 || mode !== "i-can-read") return;

    const timer = window.setTimeout(() => {
      const word = words[activeWord];
      if (word) {
        setHint(`Try this word slowly: ${word}. You can do it.`);
        void fetch("/api/voice/narrate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: `Try this word slowly: ${word}`, purpose: "struggle_assist" }),
        });
      }
    }, 4000);

    return () => window.clearTimeout(timer);
  }, [activeWord, assessmentWords.length, mode, words]);

  function clearTimers() {
    activeTimers.current.forEach((timer) => window.clearTimeout(timer));
    activeTimers.current = [];
  }

  function queueTimer(callback: () => void, delay: number) {
    const timer = window.setTimeout(callback, delay);
    activeTimers.current.push(timer);
  }

  async function requestMicrophone() {
    if (!navigator.mediaDevices?.getUserMedia) {
      setMicrophoneState("unavailable");
      setMessage("Microphone is not available in this browser. Use Read To Me instead.");
      return false;
    }

    setMicrophoneState("requesting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      setMicrophoneState("granted");
      return true;
    } catch {
      setMicrophoneState("denied");
      setMessage("Microphone permission was denied. You can retry or use Read To Me.");
      return false;
    }
  }

  function runReadToMe() {
    setMode("read-to-me");
    clearTimers();
    setAssessmentWords([]);
    setStarDust(0);
    setHint("");
    setCompanionMessage("");
    setActiveWord(-1);
    setMessage("Preparing Read To Me narration...");

    startTransition(async () => {
      const response = await fetch("/api/voice/narrate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: targetText, purpose: "read_to_me" }),
      });
      const payload = await response.json();

      if (!response.ok) {
        setMessage(payload.error ?? "Narration could not start.");
        return;
      }

      setMessage(`${payload.provider} narration is highlighting each word.`);
      (payload.wordTimestamps as Array<{ startMs: number }>).forEach((timestamp, index) => {
        queueTimer(() => setActiveWord(index), timestamp.startMs);
      });

      queueTimer(() => {
        setActiveWord(words.length);
        setMessage("Read To Me finished. Switch to I Can Read! when your child is ready.");
      }, payload.durationMs + 150);
    });
  }

  async function runICanRead() {
    setMode("i-can-read");
    clearTimers();
    setAssessmentWords([]);
    setStarDust(0);
    setHint("");
    setCompanionMessage("");
    setActiveWord(-1);

    const microphoneReady = microphoneState === "granted" || await requestMicrophone();
    if (!microphoneReady) return;

    setMessage("I Can Read! mode: listening through mock Azure WebSocket stream...");

    words.forEach((_, index) => {
      queueTimer(() => setActiveWord(index), index * 360);
    });

    queueTimer(() => {
      startTransition(async () => {
        const response = await fetch("/api/tutor/assess", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            livingProfileId,
            storyId,
            pageNumber,
            targetText,
            transcript: targetText,
          }),
        });
        const payload = await response.json();

        if (!response.ok) {
          setMessage(payload.error ?? "Tutor assessment failed.");
          return;
        }

        setAssessmentWords(payload.words);
        setStarDust(payload.starDustAwarded);
        setActiveWord(words.length);
        setMessage(`Azure assessment ${payload.accuracyScore}% accuracy. ${payload.starDustAwarded} Star Dust earned.`);
        if (payload.status === "completed" && companionModeEnabled && companionReaction.trim()) {
          setCompanionMessage(companionReaction.trim());
          void fetch("/api/voice/narrate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: companionReaction.trim(), purpose: "companion_reaction" }),
          });
        }
      });
    }, words.length * 360 + 200);
  }

  function wordClass(index: number) {
    const assessed = assessmentWords.find((word) => word.wordIndex === index);
    if (assessed?.status === "correct") return "bg-[#58e6b5] text-[#041b15]";
    if (assessed?.status === "close") return "bg-[#ffd36b] text-[#161021]";
    if (assessed?.status === "missed") return "bg-[#ff6f61] text-white";
    if (index === activeWord) return "bg-indigo-500 text-white";
    if (index < activeWord) return "bg-[#58e6b5]/20 text-[#9debd1]";
    return "bg-white/8 text-slate-200";
  }

  return (
    <div className="rounded-lg border border-white/10 bg-[#111a35]/86 p-5 shadow-[0_24px_100px_rgba(2,6,23,.4)]">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#9debd1]">Stealth Tutor</p>
          <h2 className="mt-1 text-2xl font-black text-white">Read aloud with live word tracking</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            onClick={runReadToMe}
            disabled={isPending}
            variant={mode === "read-to-me" ? "secondary" : "ghost"}
            className="border border-white/10 bg-white/8 text-white hover:bg-white/12"
          >
            <Volume2 size={17} />
            Read To Me
          </Button>
          <Button type="button" onClick={runICanRead} disabled={isPending} className="bg-[#7c5cff] text-white hover:bg-[#8d75ff]">
            <Mic size={17} />
            I Can Read!
          </Button>
        </div>
      </div>

      <div className="mb-5 flex items-center gap-3 rounded-lg border border-white/10 bg-[#0b1226] px-4 py-3 text-sm font-black text-[#ffd36b]">
        <Volume2 size={18} />
        {mode === "read-to-me" ? "Mock ElevenLabs timestamp narration active" : `Microphone: ${microphoneState.replace("-", " ")}`}
      </div>

      <p className="flex flex-wrap gap-2 text-2xl font-black leading-[3rem]">
        {words.map((word, index) => (
          <span key={`${word}-${index}`} className={`rounded-md px-2 py-1 transition ${wordClass(index)}`}>
            {word}
          </span>
        ))}
      </p>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-white/10 bg-[#0b1226] px-4 py-3">
        <p className="text-sm font-bold text-slate-300">{message}</p>
        <p className="inline-flex items-center gap-2 text-sm font-black text-[#ffd36b]">
          <Sparkles size={17} /> +{starDust} Star Dust
        </p>
      </div>
      {hint ? (
        <div className="mt-3 flex items-center gap-3 rounded-lg border border-[#ffd36b]/30 bg-[#ffd36b]/10 px-4 py-3 text-sm font-black text-[#ffe6a1]">
          <HelpCircle size={17} />
          Struggle Assist: {hint}
        </div>
      ) : null}
      {companionMessage ? (
        <div className="mt-3 rounded-lg border border-[#9debd1]/30 bg-[#9debd1]/10 px-4 py-3">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#9debd1]">Story Companion</p>
          <p className="mt-1 text-base font-black text-[#d9fff2]">{companionMessage}</p>
        </div>
      ) : null}
    </div>
  );
}

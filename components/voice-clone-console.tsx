"use client";

import { useState, useTransition } from "react";
import { Mic2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BEDTIME_TRAINING_SCRIPT } from "@/lib/tutor/assessment";

export function VoiceCloneConsole() {
  const [message, setMessage] = useState("Read the bedtime training script, then confirm consent to create a narration voice.");
  const [isPending, startTransition] = useTransition();

  function cloneVoice() {
    startTransition(async () => {
      const response = await fetch("/api/voice/clone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          label: "Parent bedtime voice",
          consentConfirmed: true,
          trainingScript: BEDTIME_TRAINING_SCRIPT,
        }),
      });
      const payload = await response.json();
      setMessage(response.ok ? `Voice profile ready: ${payload.providerVoiceId}` : payload.error ?? "Voice clone failed.");
    });
  }

  return (
    <div>
      <div className="mt-5 rounded-lg border border-white/10 bg-[#0b1226] p-5">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-[#9debd1]">Bedtime Training Script</p>
        <p className="mt-3 text-sm leading-7 text-slate-300">“{BEDTIME_TRAINING_SCRIPT}”</p>
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        <Button type="button" className="bg-[#ff6f61] text-white hover:bg-[#ff8377]">
          <Mic2 size={17} /> Record sample
        </Button>
        <Button type="button" onClick={cloneVoice} disabled={isPending} variant="ghost" className="border border-white/10 bg-white/8 text-white hover:bg-white/12">
          <ShieldCheck size={17} /> Confirm consent & clone
        </Button>
      </div>
      <p className="mt-4 rounded-lg border border-white/10 bg-[#0b1226] px-4 py-3 text-sm font-bold text-slate-300">{message}</p>
    </div>
  );
}

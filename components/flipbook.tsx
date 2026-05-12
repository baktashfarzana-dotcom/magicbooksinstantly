"use client";

import { useMemo, useState, useTransition } from "react";
import { BadgeCheck, ChevronLeft, ChevronRight, Sparkles, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { StoryBook } from "@/lib/story-engine/schema";

type FlipbookImage = {
  page_number: number;
  signedUrl: string;
};

export function Flipbook({
  story,
  images,
  livingProfileId,
  storyId,
  companionModeEnabled = true,
}: {
  story: StoryBook;
  images: FlipbookImage[];
  livingProfileId: string;
  storyId?: string;
  companionModeEnabled?: boolean;
}) {
  const [pageIndex, setPageIndex] = useState(0);
  const [companionMode, setCompanionMode] = useState(companionModeEnabled);
  const [completedPages, setCompletedPages] = useState<Set<number>>(new Set());
  const [readerMessage, setReaderMessage] = useState("Read this page to unlock the next one.");
  const [isPending, startTransition] = useTransition();
  const imageByPage = useMemo(() => new Map(images.map((image) => [image.page_number, image.signedUrl])), [images]);
  const page = story.pages[pageIndex];
  const imageUrl = imageByPage.get(page.page_number);
  const highlightedWords = page.text.split(" ").slice(0, 4).join(" ");
  const remainingWords = page.text.split(" ").slice(4).join(" ");
  const pageCompleted = completedPages.has(page.page_number);
  const showCompanionReaction = pageCompleted && companionMode && Boolean(page.companion_reaction?.trim());
  const nextLocked = !pageCompleted && pageIndex < story.pages.length - 1;

  function completePage() {
    if (pageCompleted) return;
    setReaderMessage("Listening and checking the page...");

    startTransition(async () => {
      const response = await fetch("/api/tutor/assess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          livingProfileId,
          storyId,
          pageNumber: page.page_number,
          targetText: page.text,
          transcript: page.text,
        }),
      });
      const payload = await response.json();

      if (!response.ok) {
        setReaderMessage(payload.error ?? "Could not check this page.");
        return;
      }

      setCompletedPages((current) => new Set(current).add(page.page_number));
      setReaderMessage(
        page.companion_reaction?.trim() && companionMode
          ? "Page complete. Your Story Companion has something to say before the next page."
          : "Page complete. The next page is unlocked.",
      );
    });
  }

  return (
    <section className="grid flex-1 content-center gap-5 py-6">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#9debd1]">Page {page.page_number} of {story.pages.length}</p>
          <h2 className="mt-1 text-3xl font-black tracking-normal text-white">{story.title}</h2>
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant={companionMode ? "secondary" : "ghost"}
            onClick={() => setCompanionMode((value) => !value)}
            className="border border-white/10 bg-white/8 text-white hover:bg-white/12"
          >
            <Sparkles size={18} />
            Companion
          </Button>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            aria-label="Previous page"
            onClick={() => setPageIndex((value) => Math.max(0, value - 1))}
            disabled={pageIndex === 0}
            className="border border-white/10 bg-white/8 text-white hover:bg-white/12"
          >
            <ChevronLeft size={22} />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            aria-label="Next page"
            onClick={() => setPageIndex((value) => Math.min(story.pages.length - 1, value + 1))}
            disabled={pageIndex === story.pages.length - 1 || nextLocked}
            className="border border-white/10 bg-white/8 text-white hover:bg-white/12"
          >
            <ChevronRight size={22} />
          </Button>
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-6xl gap-5 lg:grid-cols-[1.2fr_.8fr]">
        <div className="flipbook-page aspect-[16/10.4] overflow-hidden rounded-lg border border-white/12 bg-[#0b1226] shadow-[0_24px_100px_rgba(2,6,23,.5)]">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              className="h-full w-full object-cover"
              src={imageUrl}
              alt={`${story.title}, page ${page.page_number}`}
            />
          ) : (
            <div className="grid h-full place-items-center bg-[#0b1226] text-slate-400">Image baking</div>
          )}
        </div>
        <div className="flex min-h-72 flex-col justify-between rounded-lg border border-white/10 bg-[#111a35]/86 p-7 shadow-[0_24px_100px_rgba(2,6,23,.4)]">
          <div>
            <div className="mb-5 flex items-center gap-3 rounded-lg border border-white/10 bg-[#0b1226] px-4 py-3 text-sm font-black text-[#ffd36b]">
              <Volume2 size={18} /> Karaoke narration
            </div>
            <p className="text-2xl font-black leading-10 text-white">
              <span className="rounded-md bg-[#ffd36b] px-2 py-1 text-[#161021]">{highlightedWords}</span>{" "}
              {remainingWords}
            </p>
            {showCompanionReaction ? (
              <div className="mt-6 rounded-lg border border-[#9debd1]/30 bg-[#9debd1]/10 p-4 text-[#d9fff2] shadow-[0_16px_50px_rgba(40,220,170,.12)]">
                <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-[#9debd1]">
                  <Sparkles size={15} />
                  Story companion
                </div>
                <p className="text-lg font-black leading-7">{page.companion_reaction}</p>
              </div>
            ) : null}
          </div>
          <div className="mt-6 grid gap-3">
            <Button
              type="button"
              onClick={completePage}
              disabled={isPending || pageCompleted}
              className="bg-[#58e6b5] text-[#041b15] hover:bg-[#75f3c7]"
            >
              <BadgeCheck size={18} />
              {pageCompleted ? "Page read" : "I read this page"}
            </Button>
            <p className="rounded-lg border border-white/10 bg-[#0b1226] px-4 py-3 text-sm font-bold text-slate-300">
              {readerMessage}
            </p>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#ff8c66]">{page.emotional_beat}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

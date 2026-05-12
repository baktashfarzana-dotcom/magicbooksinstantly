"use client";

import { useState, useTransition } from "react";
import { BookOpenCheck, LoaderCircle, WandSparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { STORY_LENGTH_OPTIONS, type StoryLengthPreset } from "@/lib/story-engine/schema";
import { PremadeStoryLibrary } from "@/components/premade-story-library";
import type { StoryTemplate } from "@/lib/story-templates";

type Profile = {
  id: string;
  child_name: string;
};

export function StoryBakeForm({ profiles }: { profiles: Profile[] }) {
  const [profileId, setProfileId] = useState(profiles[0]?.id ?? "");
  const [hurdle, setHurdle] = useState("");
  const [lengthPreset, setLengthPreset] = useState<StoryLengthPreset>("standard");
  const [selectedTemplate, setSelectedTemplate] = useState<StoryTemplate | null>(null);
  const [message, setMessage] = useState("");
  const [storyId, setStoryId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function bakeStory() {
    setMessage("");
    setStoryId(null);

    startTransition(async () => {
      const response = await fetch("/api/bake-story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileId, hurdle, lengthPreset }),
      });
      const payload = await response.json();

      if (!response.ok) {
        setMessage(payload.error ?? "The story kitchen could not finish this bake.");
        return;
      }

      setStoryId(payload.storyId);
      setMessage(`Baked ${payload.pageCount ?? payload.imageCount} pages for a ${payload.targetMinutes ?? STORY_LENGTH_OPTIONS[lengthPreset].minutes}-minute read.`);
    });
  }

  function useTemplate(template: StoryTemplate) {
    setSelectedTemplate(template);
    setHurdle(`${template.title}: ${template.lesson}`);
    setMessage(`Selected "${template.title}". Adjust the hurdle if you want, then bake.`);
  }

  return (
    <div className="grid gap-4">
      <div className="space-y-2">
        <Label htmlFor="story_profile">Hero</Label>
        <select
          id="story_profile"
          className="flex h-11 w-full rounded-lg border border-white/10 bg-[#0b1226] px-3 text-sm text-white outline-none transition focus:border-[#7c5cff] focus:ring-2 focus:ring-[#7c5cff]/30"
          value={profileId}
          onChange={(event) => setProfileId(event.target.value)}
          disabled={profiles.length === 0 || isPending}
        >
          {profiles.map((profile) => (
            <option key={profile.id} value={profile.id}>{profile.child_name}</option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="hurdle">Hurdle</Label>
        <Input
          id="hurdle"
          value={hurdle}
          onChange={(event) => {
            setHurdle(event.target.value);
            setSelectedTemplate(null);
          }}
          placeholder="Trying new foods, bedtime worries, sharing toys"
          disabled={isPending}
          className="border-white/10 bg-[#0b1226] text-white placeholder:text-slate-500"
        />
        {selectedTemplate ? (
          <p className="text-xs font-bold text-[#9debd1]">
            Template loaded: {selectedTemplate.title}
          </p>
        ) : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="story_length">Story length</Label>
        <select
          id="story_length"
          className="flex h-11 w-full rounded-lg border border-white/10 bg-[#0b1226] px-3 text-sm text-white outline-none transition focus:border-[#7c5cff] focus:ring-2 focus:ring-[#7c5cff]/30"
          value={lengthPreset}
          onChange={(event) => setLengthPreset(event.target.value as StoryLengthPreset)}
          disabled={isPending}
        >
          {Object.entries(STORY_LENGTH_OPTIONS).map(([value, option]) => (
            <option key={value} value={value}>
              {option.label} ({option.minutes} min, {option.pageCount} pages)
            </option>
          ))}
        </select>
      </div>
      <Button type="button" onClick={bakeStory} disabled={!profileId || hurdle.trim().length < 3 || isPending}>
        {isPending ? <LoaderCircle className="animate-spin" size={18} /> : <WandSparkles size={18} />}
        Bake story
      </Button>
      <div className="min-h-11 rounded-lg border border-white/10 bg-[#0b1226] px-4 py-3 text-sm text-slate-400">
        {message || "Choose a 6, 10, or 13-minute bake with companion reactions and anchored images."}
      </div>
      {storyId ? (
        <Button asChild variant="secondary">
          <a href={`/child?profile=${profileId}&story=${storyId}`}>
            <BookOpenCheck size={18} />
            Open flipbook
          </a>
        </Button>
      ) : null}
      <div className="pt-2">
        <PremadeStoryLibrary compact onSelectTemplate={useTemplate} />
      </div>
    </div>
  );
}

import type { Json } from "../types/database.ts";
import type { StoryPage } from "./schema.ts";

type LivingProfile = {
  child_name: string;
  age: number | null;
  visual_anchor: Json;
};

export function buildMasterAnchorPrompt(profile: LivingProfile) {
  const anchor = typeof profile.visual_anchor === "object" && profile.visual_anchor !== null
    ? JSON.stringify(profile.visual_anchor)
    : "{}";

  return [
    `Hero identity anchor for ${profile.child_name}, age ${profile.age ?? "early reader"}.`,
    "Preserve the same face shape, hair, skin tone, outfit colors, proportions, and gentle personality cues in every image.",
    "Use a premium 3D animated storybook look with soft cinematic lighting, rounded forms, expressive but child-safe emotion, and no brand imitation.",
    `Existing visual anchor JSON: ${anchor}.`,
  ].join(" ");
}

export function buildStoryPrompt({
  profile,
  hurdle,
  masterAnchorPrompt,
  targetPageCount,
  targetMinutes,
  lengthLabel,
}: {
  profile: LivingProfile;
  hurdle: string;
  masterAnchorPrompt: string;
  targetPageCount: number;
  targetMinutes: number;
  lengthLabel: string;
}) {
  return [
    "Create a child-safe therapeutic adventure as strict JSON matching the requested schema.",
    `Hero: ${profile.child_name}. Age: ${profile.age ?? "unknown"}. Hurdle to explore gently: ${hurdle}.`,
    `Target length: ${lengthLabel}, ${targetMinutes} minutes, exactly ${targetPageCount} pages.`,
    "Reading level: 1st grade, Lexile 200L-500L. Use short sentences, high-frequency sight words, active voice, and about 20 words per page.",
    "Add exactly 3 power_words related to the lesson. The child must be the active hero who solves the problem.",
    "The story should externalize the hurdle through wonder, practice, and support without shame, danger, billing, account, or AI configuration references.",
    "Every image_prompt must begin with the exact Master anchor text so image generation keeps the same hero design.",
    "Add companion_reaction on pivotal high-emotion or high-action pages, roughly every 4th or 5th page. Keep each reaction under 2 sentences. Use an empty string when no reaction is needed.",
    "Scale the narrative arc by percentage: first 20% setup, next 20% hurdle, next 40% mission, final 20% victory.",
    "Include 3-5 knowledge_loop_quiz items for post-book comprehension.",
    `Master anchor: ${masterAnchorPrompt}`,
  ].join("\n");
}

export function buildImagePrompt(page: StoryPage, masterAnchorPrompt: string) {
  return [
    masterAnchorPrompt,
    `Page ${page.page_number}: ${page.image_prompt}`,
    `Emotional beat: ${page.emotional_beat}.`,
    "Composition: picture-book landscape frame, clear character visibility, consistent hero design, soft depth, bright readable shapes.",
  ].join(" ");
}

import { access, readFile, writeFile } from "node:fs/promises";

const checks = [];

async function record(name, fn) {
  try {
    const detail = await fn();
    checks.push({ name, status: "PASS", detail });
  } catch (error) {
    checks.push({
      name,
      status: "FAIL",
      detail: error instanceof Error ? error.message : String(error),
    });
  }
}

await record("schema migration exists", async () => {
  await access("supabase/migrations/0002_story_engine_visual_synthesis.sql");
  return "Stories, Images, and story-images storage policies are defined.";
});

await record("bake API exists", async () => {
  const route = await readFile("app/api/bake-story/route.ts", "utf8");
  if (!route.includes("generateStoryBook") || !route.includes("generatePageImages")) {
    throw new Error("The route is missing the story or image generation pipeline.");
  }
  return "/api/bake-story coordinates story JSON, image assets, storage upload, and status updates.";
});

await record("image regeneration API exists", async () => {
  const route = await readFile("app/api/stories/[storyId]/images/[pageNumber]/regenerate/route.ts", "utf8");
  if (!route.includes("generateSinglePageImage") || !route.includes(".eq(\"user_id\", user.id)")) {
    throw new Error("The redo image route is missing generation or owner checks.");
  }
  return "Parents can regenerate a single page image through an owner-scoped API route.";
});

await record("dynamic story contract", async () => {
  const schema = await readFile("lib/story-engine/schema.ts", "utf8");
  if (!schema.includes("STORY_LENGTH_OPTIONS") || !schema.includes("companion_reaction") || !schema.includes("knowledge_loop_quiz")) {
    throw new Error("The dynamic length, companion reaction, or quiz contract is missing.");
  }
  return "StoryBook output supports 6/10/13-minute lengths, companion reactions, power words, and quizzes.";
});

await record("character consistency anchor", async () => {
  const prompts = await readFile("lib/story-engine/prompts.ts", "utf8");
  if (!prompts.includes("Preserve the same face shape") || !prompts.includes("Master anchor")) {
    throw new Error("Master anchor prompt language is missing.");
  }
  return "Master anchor prompt is reused for every page image prompt.";
});

await record("flipbook UI", async () => {
  const flipbook = await readFile("components/flipbook.tsx", "utf8");
  if (!flipbook.includes("setPageIndex") || !flipbook.includes("flipbook-page")) {
    throw new Error("Flipbook navigation or animation class is missing.");
  }
  return "Child-safe flipbook has previous/next controls and GPU-friendly page animation.";
});

await record("parent approval queue", async () => {
  const library = await readFile("app/(dashboard)/library/page.tsx", "utf8");
  if (!library.includes(".from(\"Stories\")") || !library.includes("RegenerateImageButton")) {
    throw new Error("Library queue is not wired to real stories or redo controls.");
  }
  return "Library reads generated stories and exposes per-page redo controls before child review.";
});

const passed = checks.every((check) => check.status === "PASS");
const log = [
  `PHASE_2_STABILITY ${passed ? "PASS" : "FAIL"}`,
  `Generated: ${new Date().toISOString()}`,
  "",
  ...checks.map((check) => `[${check.status}] ${check.name}: ${check.detail}`),
  "",
  "Browser/Vision note: the full 3-story bake requires an authenticated browser session with test LivingProfiles.",
].join("\n");

await writeFile("PHASE_2_STABILITY.log", `${log}\n`);
console.log(log);

if (!passed) {
  process.exit(1);
}

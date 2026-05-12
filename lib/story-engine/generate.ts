import { generateImage, generateText } from "ai";
import { buildImagePrompt, buildMasterAnchorPrompt, buildStoryPrompt } from "./prompts.ts";
import {
  createStoryBookOutput,
  getStoryLengthConfig,
  normalizeStoryBook,
  resolveStoryLengthPreset,
  type StoryBook,
  type StoryLengthPreset,
  type StoryPage,
} from "./schema.ts";
import { renderStoryboardSvg } from "./svg.ts";
import type { Json } from "../types/database.ts";

type LivingProfile = {
  child_name: string;
  age: number | null;
  visual_anchor: Json;
};

export type GeneratedImageAsset = {
  page: StoryPage;
  prompt: string;
  bytes: Uint8Array;
  contentType: string;
  extension: string;
  provider: string;
};

function gatewayAvailable() {
  return Boolean(process.env.VERCEL_OIDC_TOKEN || process.env.AI_GATEWAY_API_KEY || process.env.OPENAI_API_KEY);
}

function fallbackBeat(index: number, totalPages: number) {
  const progress = (index + 1) / totalPages;
  if (progress <= 0.2) return "noticing the feeling";
  if (progress <= 0.4) return "meeting the hurdle";
  if (progress <= 0.8) return "practicing a brave step";
  return "carrying the lesson home";
}

function fallbackStory({
  profile,
  hurdle,
  lengthPreset,
}: {
  profile: LivingProfile;
  hurdle: string;
  lengthPreset: StoryLengthPreset;
}): StoryBook {
  const length = getStoryLengthConfig(lengthPreset);
  const beats = [
    "noticing the feeling",
    "naming the worry",
    "meeting a helper",
    "trying one tiny step",
    "pausing for breath",
    "remembering a strength",
    "asking kindly",
    "making a plan",
    "practicing safely",
    "finding courage",
    "choosing patience",
    "sharing the feeling",
    "trying again",
    "celebrating effort",
    "helping someone else",
    "seeing progress",
    "resting proudly",
    "returning stronger",
    "turning the key",
    "carrying the lesson",
  ];

  return {
    title: `${profile.child_name} and the Brave Little Step`,
    age_band: profile.age ? `age ${profile.age}` : "early reader",
    hurdle,
    moral: "Big hurdles become friendlier when we take one kind, brave step at a time.",
    power_words: ["brave", "steady", "kind"],
    total_pages_generated: length.pageCount,
    target_minutes: length.minutes,
    length_preset: lengthPreset,
    pages: Array.from({ length: length.pageCount }, (_, index) => {
      const beat = beats[index] ?? fallbackBeat(index, length.pageCount);
      const hasCompanion = index > 0 && (index + 1) % 5 === 0;

      return {
        page_number: index + 1,
        emotional_beat: beat,
        text: `${profile.child_name} feels the ${hurdle.toLowerCase()} feeling and takes a gentle breath. One brave little step makes the path glow.`,
        image_prompt: `${profile.child_name} in a bright wonderland scene, ${beat}, warm family-film 3D storybook lighting, same outfit and face as the hero anchor`,
        companion_reaction: hasCompanion
          ? `Wow, ${profile.child_name}! That brave step made the whole adventure brighter.`
          : "",
      };
    }),
    knowledge_loop_quiz: [
      {
        question: `What did ${profile.child_name} do when the hurdle felt big?`,
        options: ["Took one brave step", "Gave up forever", "Hid the feeling"],
        correct_answer: "Took one brave step",
      },
      {
        question: "Which power word means not giving up right away?",
        options: ["Steady", "Cloudy", "Tiny"],
        correct_answer: "Steady",
      },
      {
        question: "What can help when a hard feeling shows up?",
        options: ["A gentle breath", "A scary noise", "A closed book"],
        correct_answer: "A gentle breath",
      },
    ],
  };
}

export async function generateStoryBook(
  profile: LivingProfile,
  hurdle: string,
  options: { lengthPreset?: string | null } = {},
) {
  const lengthPreset = resolveStoryLengthPreset(options.lengthPreset);
  const length = getStoryLengthConfig(lengthPreset);
  const masterAnchorPrompt = buildMasterAnchorPrompt(profile);

  if (!gatewayAvailable()) {
    return {
      story: fallbackStory({ profile, hurdle, lengthPreset }),
      masterAnchorPrompt,
      provider: "local-storyboard",
    };
  }

  try {
    const { output } = await generateText({
      model: process.env.STORY_TEXT_MODEL ?? "openai/gpt-5.4",
      output: createStoryBookOutput(length.pageCount),
      prompt: buildStoryPrompt({
        profile,
        hurdle,
        masterAnchorPrompt,
        targetPageCount: length.pageCount,
        targetMinutes: length.minutes,
        lengthLabel: length.label,
      }),
      temperature: 0.7,
    });

    return {
      story: normalizeStoryBook(output, hurdle, {
        targetPageCount: length.pageCount,
        targetMinutes: length.minutes,
        lengthPreset,
      }),
      masterAnchorPrompt,
      provider: process.env.STORY_TEXT_MODEL ?? "openai/gpt-5.4",
    };
  } catch (error) {
    console.warn("Story generation fell back to local storyboard", error);
    return {
      story: fallbackStory({ profile, hurdle, lengthPreset }),
      masterAnchorPrompt,
      provider: "local-storyboard",
    };
  }
}

export async function generatePageImages({
  profile,
  story,
  masterAnchorPrompt,
}: {
  profile: LivingProfile;
  story: StoryBook;
  masterAnchorPrompt: string;
}) {
  const anchorColor = "#1f6fff";

  return Promise.all(
    story.pages.map(async (page): Promise<GeneratedImageAsset> => {
      const prompt = buildImagePrompt(page, masterAnchorPrompt);

      if (gatewayAvailable() && process.env.STORY_IMAGE_MODEL) {
        try {
          const result = await generateImage({
            model: process.env.STORY_IMAGE_MODEL,
            prompt,
            size: "1280x832",
            maxRetries: 1,
          });
          const image = result.images[0];

          if (image?.uint8Array) {
            return {
              page,
              prompt,
              bytes: image.uint8Array,
              contentType: image.mediaType ?? "image/png",
              extension: image.mediaType?.includes("jpeg") ? "jpg" : "png",
              provider: process.env.STORY_IMAGE_MODEL,
            };
          }
        } catch (error) {
          console.warn(`Image generation fell back for page ${page.page_number}`, error);
        }
      }

      const svg = renderStoryboardSvg({
        childName: profile.child_name,
        title: story.title,
        page,
        anchorColor,
      });

      return {
        page,
        prompt,
        bytes: new TextEncoder().encode(svg),
        contentType: "image/svg+xml",
        extension: "svg",
        provider: "local-storyboard",
      };
    }),
  );
}

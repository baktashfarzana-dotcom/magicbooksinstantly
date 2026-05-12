import { Output, jsonSchema } from "ai";

export type StoryLengthPreset = "quick" | "standard" | "weekend";

export type StoryLengthConfig = {
  label: string;
  minutes: number;
  pageCount: number;
};

export const STORY_LENGTH_OPTIONS = {
  quick: {
    label: "Quick Bedtime",
    minutes: 6,
    pageCount: 15,
  },
  standard: {
    label: "Standard Read",
    minutes: 10,
    pageCount: 22,
  },
  weekend: {
    label: "Weekend Adventure",
    minutes: 13,
    pageCount: 30,
  },
} satisfies Record<StoryLengthPreset, StoryLengthConfig>;

export const DEFAULT_STORY_LENGTH_PRESET: StoryLengthPreset = "standard";
export const MIN_STORY_PAGE_COUNT = STORY_LENGTH_OPTIONS.quick.pageCount;
export const MAX_STORY_PAGE_COUNT = STORY_LENGTH_OPTIONS.weekend.pageCount;

export type StoryPage = {
  page_number: number;
  text: string;
  image_prompt: string;
  emotional_beat: string;
  companion_reaction: string;
};

export type KnowledgeLoopQuizItem = {
  question: string;
  options: string[];
  correct_answer: string;
};

export type StoryBook = {
  title: string;
  age_band: string;
  hurdle: string;
  moral: string;
  power_words: string[];
  total_pages_generated: number;
  target_minutes: number;
  length_preset: StoryLengthPreset;
  pages: StoryPage[];
  knowledge_loop_quiz: KnowledgeLoopQuizItem[];
};

type StoryBookInput = Partial<Omit<StoryBook, "pages">> & {
  story_title?: string;
  pages: Array<Partial<StoryPage> & {
    narrative_text?: string;
    visual_prompt?: string;
  }>;
};

export function resolveStoryLengthPreset(value?: string | null): StoryLengthPreset {
  if (value === "quick" || value === "standard" || value === "weekend") {
    return value;
  }

  return DEFAULT_STORY_LENGTH_PRESET;
}

export function getStoryLengthConfig(preset: StoryLengthPreset = DEFAULT_STORY_LENGTH_PRESET) {
  return STORY_LENGTH_OPTIONS[preset];
}

export function createStoryBookOutput(targetPageCount: number) {
  return Output.object<StoryBook>({
    name: "StoryBook",
    description: "A child-safe dynamic-length picture book with companion reactions and page-level illustration prompts.",
    schema: jsonSchema({
      type: "object",
      additionalProperties: false,
      required: [
        "title",
        "age_band",
        "hurdle",
        "moral",
        "power_words",
        "total_pages_generated",
        "target_minutes",
        "length_preset",
        "pages",
        "knowledge_loop_quiz",
      ],
      properties: {
        title: { type: "string" },
        age_band: { type: "string" },
        hurdle: { type: "string" },
        moral: { type: "string" },
        power_words: {
          type: "array",
          minItems: 3,
          maxItems: 3,
          items: { type: "string" },
        },
        total_pages_generated: { type: "integer", minimum: targetPageCount, maximum: targetPageCount },
        target_minutes: { type: "integer", minimum: 6, maximum: 13 },
        length_preset: { type: "string", enum: ["quick", "standard", "weekend"] },
        pages: {
          type: "array",
          minItems: targetPageCount,
          maxItems: targetPageCount,
          items: {
            type: "object",
            additionalProperties: false,
            required: ["page_number", "text", "image_prompt", "emotional_beat", "companion_reaction"],
            properties: {
              page_number: { type: "integer", minimum: 1, maximum: MAX_STORY_PAGE_COUNT },
              text: { type: "string" },
              image_prompt: { type: "string" },
              emotional_beat: { type: "string" },
              companion_reaction: { type: "string" },
            },
          },
        },
        knowledge_loop_quiz: {
          type: "array",
          minItems: 3,
          maxItems: 5,
          items: {
            type: "object",
            additionalProperties: false,
            required: ["question", "options", "correct_answer"],
            properties: {
              question: { type: "string" },
              options: {
                type: "array",
                minItems: 3,
                maxItems: 3,
                items: { type: "string" },
              },
              correct_answer: { type: "string" },
            },
          },
        },
      },
    }),
  });
}

export function normalizeStoryBook(
  story: StoryBookInput,
  hurdle: string,
  {
    targetPageCount,
    targetMinutes,
    lengthPreset,
  }: {
    targetPageCount: number;
    targetMinutes: number;
    lengthPreset: StoryLengthPreset;
  },
): StoryBook {
  const pages = Array.from({ length: targetPageCount }, (_, index) => {
    const existing = story.pages[index];
    const text = existing?.text ?? existing?.narrative_text;
    const imagePrompt = existing?.image_prompt ?? existing?.visual_prompt;

    return {
      page_number: index + 1,
      text: text?.trim() || `Page ${index + 1}: The hero takes one brave step.`,
      image_prompt: imagePrompt?.trim() || "Warm 3D animated storybook scene with the hero learning gently.",
      emotional_beat: existing?.emotional_beat?.trim() || "bravery",
      companion_reaction: existing?.companion_reaction?.trim() || "",
    };
  });

  return {
    title: (story.title ?? story.story_title)?.trim() || "The Brave Little Step",
    age_band: story.age_band?.trim() || "ages 4-8",
    hurdle: story.hurdle?.trim() || hurdle,
    moral: story.moral?.trim() || "Tiny brave steps can make big feelings easier.",
    power_words: (story.power_words ?? ["brave", "steady", "kind"])
      .map((word) => word.trim())
      .filter(Boolean)
      .slice(0, 3)
      .concat(["brave", "steady", "kind"])
      .slice(0, 3),
    total_pages_generated: targetPageCount,
    target_minutes: targetMinutes,
    length_preset: lengthPreset,
    pages,
    knowledge_loop_quiz: (story.knowledge_loop_quiz?.length ? story.knowledge_loop_quiz : [
      {
        question: "What helped the hero take the next brave step?",
        options: ["A calm breath", "A loud storm", "A hidden door"],
        correct_answer: "A calm breath",
      },
      {
        question: "How did the hero feel at the end?",
        options: ["Proud", "Invisible", "Sleepy"],
        correct_answer: "Proud",
      },
      {
        question: "What can you try when a hurdle feels big?",
        options: ["One kind step", "Run away fast", "Never ask for help"],
        correct_answer: "One kind step",
      },
    ]).slice(0, 5),
  };
}

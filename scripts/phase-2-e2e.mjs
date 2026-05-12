import { appendFile, readFile, writeFile } from "node:fs/promises";
import { createClient } from "@supabase/supabase-js";
import { generatePageImages, generateStoryBook } from "../lib/story-engine/generate.ts";
import { getStoryLengthConfig } from "../lib/story-engine/schema.ts";

const loadEnvFile = async (path) => {
  try {
    const text = await readFile(path, "utf8");
    for (const line of text.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
      const [key, ...valueParts] = trimmed.split("=");
      if (!process.env[key]) {
        process.env[key] = valueParts.join("=").replace(/^['"]|['"]$/g, "");
      }
    }
  } catch {
    // Environment files are optional in CI.
  }
};

await loadEnvFile(".env.local");

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const password = process.env.PHASE_2_TEST_PASSWORD ?? "MagicBooksPhase2!2026";

if (!url || !key) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.");
}

const testParents = [
  {
    label: "parent-one",
    email: process.env.PHASE_2_TEST_USER_ONE ?? "phase2.parent.one@magicbooksinstantly.test",
  },
  {
    label: "parent-two",
    email: process.env.PHASE_2_TEST_USER_TWO ?? "phase2.parent.two@magicbooksinstantly.test",
  },
];

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

function client(accessToken) {
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: accessToken
      ? {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      : undefined,
  });
}

const anonymous = client();
const sessions = [];

await record("anonymous reads are blocked", async () => {
  const [stories, images] = await Promise.all([
    anonymous.from("Stories").select("id"),
    anonymous.from("Images").select("id"),
  ]);

  if (!stories.error && (stories.data?.length ?? 0) > 0) {
    throw new Error("Anonymous client read Stories rows.");
  }
  if (!images.error && (images.data?.length ?? 0) > 0) {
    throw new Error("Anonymous client read Images rows.");
  }

  return "Anonymous client cannot read story or image rows.";
});

for (const parent of testParents) {
  await record(`${parent.label} can sign in`, async () => {
    const supabase = client();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: parent.email,
      password,
    });

    if (error || !data.session?.access_token || !data.user) {
      throw new Error(error?.message ?? "Missing session.");
    }

    sessions.push({
      ...parent,
      userId: data.user.id,
      accessToken: data.session.access_token,
      supabase: client(data.session.access_token),
    });

    return `Signed in as ${data.user.id}.`;
  });
}

const bakes = [];
const bakePlan = [
  { parentLabel: "parent-one", hurdle: "bedtime worries", lengthPreset: "quick" },
  { parentLabel: "parent-one", hurdle: "sharing toys", lengthPreset: "standard" },
  { parentLabel: "parent-two", hurdle: "trying new foods", lengthPreset: "weekend" },
];

for (const bake of bakePlan) {
  const session = sessions.find((candidate) => candidate.label === bake.parentLabel);

  await record(`${bake.parentLabel} can bake ${bake.hurdle}`, async () => {
    if (!session) {
      throw new Error(`Missing signed-in session for ${bake.parentLabel}.`);
    }

    const { data: profile, error: profileError } = await session.supabase
      .from("LivingProfiles")
      .select("id, child_name, age, visual_anchor")
      .eq("user_id", session.userId)
      .limit(1)
      .single();

    if (profileError || !profile) {
      throw new Error(profileError?.message ?? "Missing LivingProfile.");
    }

    const length = getStoryLengthConfig(bake.lengthPreset);
    const { story, masterAnchorPrompt, provider } = await generateStoryBook(profile, bake.hurdle, {
      lengthPreset: bake.lengthPreset,
    });
    if (story.pages.length !== length.pageCount) {
      throw new Error(`Expected ${length.pageCount} pages, got ${story.pages.length}.`);
    }
    if (story.power_words.length !== 3 || story.knowledge_loop_quiz.length < 3) {
      throw new Error("Story is missing power words or knowledge loop quiz items.");
    }
    if (!story.pages.some((page) => page.companion_reaction.trim().length > 0)) {
      throw new Error("Story is missing companion reactions.");
    }

    const { data: storyRow, error: storyError } = await session.supabase
      .from("Stories")
      .insert({
        user_id: session.userId,
        living_profile_id: profile.id,
        hurdle: bake.hurdle,
        title: story.title,
        status: "baking",
        master_anchor_prompt: masterAnchorPrompt,
        story_json: story,
      })
      .select("id")
      .single();

    if (storyError || !storyRow) {
      throw new Error(storyError?.message ?? "Missing story row.");
    }

    const imageAssets = await generatePageImages({ profile, story, masterAnchorPrompt });
    if (imageAssets.length !== length.pageCount) {
      throw new Error(`Expected ${length.pageCount} images, got ${imageAssets.length}.`);
    }

    const imageRows = await Promise.all(
      imageAssets.map(async (image) => {
        const page = String(image.page.page_number).padStart(2, "0");
        const storagePath = `${session.userId}/${storyRow.id}/phase2-e2e-page-${page}.${image.extension}`;
        const upload = await session.supabase.storage
          .from("story-images")
          .upload(storagePath, image.bytes, {
            contentType: image.contentType,
            upsert: true,
          });

        if (upload.error) {
          throw upload.error;
        }

        return {
          user_id: session.userId,
          story_id: storyRow.id,
          living_profile_id: profile.id,
          page_number: image.page.page_number,
          prompt: image.prompt,
          consistency_anchor: masterAnchorPrompt,
          storage_bucket: "story-images",
          storage_path: storagePath,
          generation_provider: image.provider,
        };
      }),
    );

    const { error: imagesError } = await session.supabase.from("Images").insert(imageRows);
    if (imagesError) {
      throw imagesError;
    }

    const { error: updateError } = await session.supabase
      .from("Stories")
      .update({ status: "ready" })
      .eq("id", storyRow.id)
      .eq("user_id", session.userId);

    if (updateError) {
      throw updateError;
    }

    const consistentPrompts = imageRows.every((row) => row.prompt.includes(masterAnchorPrompt));
    if (!consistentPrompts) {
      throw new Error("One or more image prompts did not include the master anchor.");
    }

    bakes.push({ ...session, storyId: storyRow.id, profileId: profile.id });
    return `Baked story ${storyRow.id} with ${imageRows.length} anchored images via ${provider}.`;
  });
}

await record("three-story bake contract", async () => {
  if (bakes.length !== 3) {
    throw new Error(`Expected 3 baked stories, got ${bakes.length}.`);
  }

  return "Automated parents baked quick, standard, and weekend stories.";
});

await record("parent RLS isolates story rows", async () => {
  const firstBake = bakes.find((bake) => bake.label === "parent-one");
  const secondBake = bakes.find((bake) => bake.label === "parent-two");
  if (!firstBake || !secondBake || firstBake.userId === secondBake.userId) {
    throw new Error("Missing cross-parent baked stories.");
  }

  const [ownRead, crossRead] = await Promise.all([
    firstBake.supabase.from("Stories").select("id").eq("id", firstBake.storyId).single(),
    firstBake.supabase.from("Stories").select("id").eq("id", secondBake.storyId),
  ]);

  if (ownRead.error || ownRead.data?.id !== firstBake.storyId) {
    throw new Error("Parent could not read their own story.");
  }
  if (crossRead.error || (crossRead.data?.length ?? 0) !== 0) {
    throw new Error("Parent could read another parent's story.");
  }

  return "Parent one can read own story and cannot read parent two story.";
});

await record("storage RLS isolates image objects", async () => {
  const firstBake = bakes.find((bake) => bake.label === "parent-one");
  const secondBake = bakes.find((bake) => bake.label === "parent-two");
  if (!firstBake || !secondBake || firstBake.userId === secondBake.userId) {
    throw new Error("Missing cross-parent baked stories.");
  }

  const { data: secondImage, error: imageError } = await secondBake.supabase
    .from("Images")
    .select("storage_path")
    .eq("story_id", secondBake.storyId)
    .eq("page_number", 1)
    .single();

  if (imageError || !secondImage) {
    throw new Error(imageError?.message ?? "Missing second parent image.");
  }

  const download = await firstBake.supabase.storage
    .from("story-images")
    .download(secondImage.storage_path);

  if (!download.error) {
    throw new Error("Parent one downloaded parent two storage object.");
  }

  return "Parent one cannot download parent two image object.";
});

const passed = checks.every((check) => check.status === "PASS");
const log = [
  `PHASE_2_E2E ${passed ? "PASS" : "FAIL"}`,
  `Generated: ${new Date().toISOString()}`,
  "",
  ...checks.map((check) => `[${check.status}] ${check.name}: ${check.detail}`),
  "",
].join("\n");

console.log(log);
await writeFile("PHASE_2_E2E.log", `${log}\n`);
await appendFile("PHASE_2_STABILITY.log", `\n${log}\n`);

if (!passed) {
  process.exit(1);
}

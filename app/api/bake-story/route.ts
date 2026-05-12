import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { generatePageImages, generateStoryBook } from "@/lib/story-engine/generate";
import { getStoryLengthConfig, resolveStoryLengthPreset } from "@/lib/story-engine/schema";

export const maxDuration = 300;

function badRequest(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return badRequest("Sign in before baking a story.", 401);
  }

  const body = await request.json().catch(() => null) as { profileId?: string; hurdle?: string; lengthPreset?: string } | null;
  const profileId = body?.profileId?.trim();
  const hurdle = body?.hurdle?.trim();
  const lengthPreset = resolveStoryLengthPreset(body?.lengthPreset);
  const length = getStoryLengthConfig(lengthPreset);

  if (!profileId || !hurdle || hurdle.length < 3) {
    return badRequest("Choose a child profile and enter a hurdle.");
  }

  const { data: profile, error: profileError } = await supabase
    .from("LivingProfiles")
    .select("id, child_name, age, visual_anchor")
    .eq("id", profileId)
    .eq("user_id", user.id)
    .single();

  if (profileError || !profile) {
    return badRequest("That LivingProfile was not found for this parent.", 404);
  }

  const { story, masterAnchorPrompt, provider } = await generateStoryBook(profile, hurdle, { lengthPreset });

  const { data: storyRow, error: storyError } = await supabase
    .from("Stories")
    .insert({
      user_id: user.id,
      living_profile_id: profile.id,
      hurdle,
      title: story.title,
      status: "baking",
      master_anchor_prompt: masterAnchorPrompt,
      story_json: story,
    })
    .select("id")
    .single();

  if (storyError || !storyRow) {
    return badRequest(storyError?.message ?? "Could not create the story row.", 500);
  }

  try {
    const images = await generatePageImages({ profile, story, masterAnchorPrompt });
    const uploadedImages = await Promise.all(
      images.map(async (image) => {
        const paddedPage = String(image.page.page_number).padStart(2, "0");
        const storagePath = `${user.id}/${storyRow.id}/page-${paddedPage}.${image.extension}`;
        const upload = await supabase.storage
          .from("story-images")
          .upload(storagePath, image.bytes, {
            contentType: image.contentType,
            upsert: true,
          });

        if (upload.error) {
          throw upload.error;
        }

        return {
          user_id: user.id,
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

    const { error: imageError } = await supabase.from("Images").insert(uploadedImages);
    if (imageError) {
      throw imageError;
    }

    await supabase.from("Stories").update({ status: "ready" }).eq("id", storyRow.id).eq("user_id", user.id);

    return NextResponse.json({
      storyId: storyRow.id,
      status: "ready",
      provider,
      pageCount: story.pages.length,
      targetMinutes: length.minutes,
      imageCount: uploadedImages.length,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Story bake failed.";
    await supabase
      .from("Stories")
      .update({ status: "failed", error_message: message })
      .eq("id", storyRow.id)
      .eq("user_id", user.id);

    return badRequest(message, 500);
  }
}

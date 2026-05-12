import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { generateSinglePageImage } from "@/lib/story-engine/generate";
import type { StoryBook } from "@/lib/story-engine/schema";

export const maxDuration = 120;

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(
  _request: Request,
  context: { params: Promise<unknown> },
) {
  const { storyId, pageNumber } = await context.params as { storyId?: string; pageNumber?: string };
  const page = Number.parseInt(pageNumber ?? "", 10);

  if (!storyId || !Number.isInteger(page) || page < 1 || page > 30) {
    return jsonError("Choose a valid story and page to regenerate.");
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return jsonError("Sign in before regenerating an image.", 401);
  }

  const { data: storyRow, error: storyError } = await supabase
    .from("Stories")
    .select("id, user_id, living_profile_id, title, master_anchor_prompt, story_json")
    .eq("id", storyId)
    .eq("user_id", user.id)
    .single();

  if (storyError || !storyRow) {
    return jsonError("That story was not found for this parent.", 404);
  }

  const story = storyRow.story_json as StoryBook;
  const storyPage = story.pages?.find((candidate) => candidate.page_number === page);

  if (!storyPage) {
    return jsonError("That page does not exist in this story.", 404);
  }

  const { data: profile, error: profileError } = await supabase
    .from("LivingProfiles")
    .select("id, child_name, age, visual_anchor")
    .eq("id", storyRow.living_profile_id)
    .eq("user_id", user.id)
    .single();

  if (profileError || !profile) {
    return jsonError("The story profile was not found for this parent.", 404);
  }

  const { data: existingImage } = await supabase
    .from("Images")
    .select("id, storage_bucket, storage_path")
    .eq("story_id", storyRow.id)
    .eq("user_id", user.id)
    .eq("page_number", page)
    .maybeSingle();

  try {
    const image = await generateSinglePageImage({
      profile,
      story,
      masterAnchorPrompt: storyRow.master_anchor_prompt,
      page: storyPage,
    });
    const paddedPage = String(page).padStart(2, "0");
    const stamp = Date.now();
    const storagePath = `${user.id}/${storyRow.id}/page-${paddedPage}-redo-${stamp}.${image.extension}`;
    const upload = await supabase.storage
      .from("story-images")
      .upload(storagePath, image.bytes, {
        contentType: image.contentType,
        upsert: false,
      });

    if (upload.error) {
      throw upload.error;
    }

    const imageBaseRow = {
      page_number: page,
      prompt: image.prompt,
      consistency_anchor: storyRow.master_anchor_prompt,
      storage_bucket: "story-images",
      storage_path: storagePath,
      generation_provider: image.provider,
    };

    if (existingImage?.id) {
      const { error: updateError } = await supabase
        .from("Images")
        .update(imageBaseRow)
        .eq("id", existingImage.id)
        .eq("user_id", user.id);

      if (updateError) {
        throw updateError;
      }

      if (existingImage.storage_bucket === "story-images") {
        await supabase.storage.from("story-images").remove([existingImage.storage_path]);
      }
    } else {
      const { error: insertError } = await supabase.from("Images").insert({
        ...imageBaseRow,
        user_id: user.id,
        story_id: storyRow.id,
        living_profile_id: profile.id,
      });

      if (insertError) {
        throw insertError;
      }
    }

    return NextResponse.json({
      storyId: storyRow.id,
      pageNumber: page,
      storagePath,
      provider: image.provider,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Image regeneration failed.";
    return jsonError(message, 500);
  }
}

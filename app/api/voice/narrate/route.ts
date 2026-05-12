import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type NarrateBody = {
  text?: string;
  purpose?: "read_to_me" | "struggle_assist" | "companion_reaction";
};

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return jsonError("Sign in before generating narration.", 401);
  }

  const body = await request.json().catch(() => null) as NarrateBody | null;
  const text = body?.text?.trim();

  if (!text) {
    return jsonError("Missing narration text.");
  }

  const words = text.split(/\s+/).filter(Boolean);
  const wordTimestamps = words.map((word, index) => ({
    word,
    startMs: index * 420,
    endMs: index * 420 + 360,
  }));

  return NextResponse.json({
    provider: process.env.ELEVENLABS_API_KEY ? "elevenlabs" : "mock-elevenlabs-tts",
    purpose: body?.purpose ?? "read_to_me",
    audioUrl: null,
    durationMs: wordTimestamps.at(-1)?.endMs ?? 0,
    wordTimestamps,
  });
}

import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { BEDTIME_TRAINING_SCRIPT } from "@/lib/tutor/assessment";

type VoiceBody = {
  label?: string;
  consentConfirmed?: boolean;
  trainingScript?: string;
};

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Sign in before cloning a voice." }, { status: 401 });
  }

  const body = await request.json().catch(() => null) as VoiceBody | null;
  const consentConfirmed = Boolean(body?.consentConfirmed);

  if (!consentConfirmed) {
    return NextResponse.json({ error: "Voice consent must be confirmed." }, { status: 400 });
  }

  const providerVoiceId = process.env.ELEVENLABS_API_KEY
    ? `elevenlabs-ready-${user.id.slice(0, 8)}`
    : `mock-elevenlabs-${user.id.slice(0, 8)}`;

  const { data, error } = await supabase
    .from("VoiceProfiles")
    .insert({
      user_id: user.id,
      label: body?.label?.trim() || "Parent bedtime voice",
      provider: "elevenlabs",
      provider_voice_id: providerVoiceId,
      status: "ready",
      training_script: body?.trainingScript?.trim() || BEDTIME_TRAINING_SCRIPT,
      consent_confirmed: true,
    })
    .select("id, provider_voice_id, status")
    .single();

  if (error || !data) {
    return NextResponse.json({ error: error?.message ?? "Could not save voice profile." }, { status: 500 });
  }

  return NextResponse.json({
    voiceProfileId: data.id,
    providerVoiceId: data.provider_voice_id,
    status: data.status,
  });
}

import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { assessTranscript } from "@/lib/tutor/assessment";

type AssessBody = {
  livingProfileId?: string;
  storyId?: string | null;
  pageNumber?: number;
  targetText?: string;
  transcript?: string;
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
    return jsonError("Sign in before starting tutor mode.", 401);
  }

  const body = await request.json().catch(() => null) as AssessBody | null;
  const livingProfileId = body?.livingProfileId;
  const targetText = body?.targetText?.trim();
  const transcript = body?.transcript?.trim();
  const pageNumber = body?.pageNumber ?? 1;

  if (!livingProfileId || !targetText || !transcript) {
    return jsonError("Missing livingProfileId, targetText, or transcript.");
  }

  const { data: profile, error: profileError } = await supabase
    .from("LivingProfiles")
    .select("id")
    .eq("id", livingProfileId)
    .eq("user_id", user.id)
    .single();

  if (profileError || !profile) {
    return jsonError("LivingProfile was not found for this parent.", 404);
  }

  const assessment = assessTranscript({ targetText, transcript });
  const { data: attempt, error: attemptError } = await supabase
    .from("ReadingAttempts")
    .insert({
      user_id: user.id,
      living_profile_id: livingProfileId,
      story_id: body?.storyId ?? null,
      page_number: pageNumber,
      target_text: targetText,
      transcript,
      accuracy_score: assessment.accuracyScore,
      completion_score: assessment.completionScore,
      status: assessment.status,
      star_dust_awarded: assessment.starDustAwarded,
      assessment_provider: assessment.provider,
    })
    .select("id")
    .single();

  if (attemptError || !attempt) {
    return jsonError(attemptError?.message ?? "Could not save reading attempt.", 500);
  }

  const { error: wordsError } = await supabase.from("WordAssessments").insert(
    assessment.words.map((word) => ({
      user_id: user.id,
      reading_attempt_id: attempt.id,
      word_index: word.wordIndex,
      expected_word: word.expectedWord,
      spoken_word: word.spokenWord,
      accuracy_score: word.accuracyScore,
      status: word.status,
    })),
  );

  if (wordsError) {
    return jsonError(wordsError.message, 500);
  }

  let balanceAfter = 0;
  if (assessment.starDustAwarded > 0) {
    const { data: currentBalance } = await supabase
      .from("TreasuryBalances")
      .select("star_dust_total, reading_streak")
      .eq("user_id", user.id)
      .eq("living_profile_id", livingProfileId)
      .maybeSingle();

    balanceAfter = (currentBalance?.star_dust_total ?? 0) + assessment.starDustAwarded;
    const readingStreak = (currentBalance?.reading_streak ?? 0) + 1;

    const { error: balanceError } = await supabase.from("TreasuryBalances").upsert({
      user_id: user.id,
      living_profile_id: livingProfileId,
      star_dust_total: balanceAfter,
      reading_streak: readingStreak,
      last_rewarded_at: new Date().toISOString(),
    }, { onConflict: "user_id,living_profile_id" });

    if (balanceError) {
      return jsonError(balanceError.message, 500);
    }

    const { error: ledgerError } = await supabase.from("StarDustLedger").insert({
      user_id: user.id,
      living_profile_id: livingProfileId,
      reading_attempt_id: attempt.id,
      delta: assessment.starDustAwarded,
      balance_after: balanceAfter,
      reason: "reading_completion",
    });

    if (ledgerError) {
      return jsonError(ledgerError.message, 500);
    }
  }

  return NextResponse.json({
    attemptId: attempt.id,
    ...assessment,
    balanceAfter,
  });
}

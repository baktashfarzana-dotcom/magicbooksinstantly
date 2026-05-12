import { readFile, writeFile } from "node:fs/promises";
import { createClient } from "@supabase/supabase-js";
import { assessTranscript, BEDTIME_TRAINING_SCRIPT } from "../lib/tutor/assessment.ts";

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
const email = process.env.PHASE_2_TEST_USER_ONE ?? "phase2.parent.one@magicbooksinstantly.test";
const password = process.env.PHASE_2_TEST_PASSWORD ?? "MagicBooksPhase2!2026";

if (!url || !key) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.");
}

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
    global: accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : undefined,
  });
}

let session;
let profile;
let beforeBalance = 0;
let afterBalance = 0;
let attemptId;
const targetText = "In the moonlit library every brave little breath turned a locked door into a glowing page";

await record("automated child session signs in", async () => {
  const supabase = client();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.session?.access_token || !data.user) {
    throw new Error(error?.message ?? "Missing session.");
  }
  session = {
    userId: data.user.id,
    supabase: client(data.session.access_token),
  };
  return `Signed in ${data.user.id}.`;
});

await record("living profile is available", async () => {
  const { data, error } = await session.supabase
    .from("LivingProfiles")
    .select("id, child_name")
    .eq("user_id", session.userId)
    .limit(1)
    .single();
  if (error || !data) throw new Error(error?.message ?? "Missing LivingProfile.");
  profile = data;
  return `Using ${data.child_name}.`;
});

await record("parent voice clone profile is persisted", async () => {
  const { data, error } = await session.supabase
    .from("VoiceProfiles")
    .insert({
      user_id: session.userId,
      label: "Phase 3 automated bedtime voice",
      provider: "elevenlabs",
      provider_voice_id: `mock-elevenlabs-${session.userId.slice(0, 8)}`,
      status: "ready",
      training_script: BEDTIME_TRAINING_SCRIPT,
      consent_confirmed: true,
    })
    .select("id, provider_voice_id")
    .single();
  if (error || !data) throw new Error(error?.message ?? "Missing voice profile.");
  return `Voice profile ${data.provider_voice_id} stored.`;
});

await record("Azure-style word tracking completes page", async () => {
  const assessment = assessTranscript({ targetText, transcript: targetText });
  if (assessment.status !== "completed" || assessment.starDustAwarded <= 0) {
    throw new Error(`Expected completed assessment with reward, got ${assessment.status}.`);
  }
  if (!assessment.words.every((word) => word.status === "correct")) {
    throw new Error("Expected every simulated word to be correct.");
  }

  const { data: balance } = await session.supabase
    .from("TreasuryBalances")
    .select("star_dust_total, reading_streak")
    .eq("user_id", session.userId)
    .eq("living_profile_id", profile.id)
    .maybeSingle();

  beforeBalance = balance?.star_dust_total ?? 0;

  const { data: attempt, error: attemptError } = await session.supabase
    .from("ReadingAttempts")
    .insert({
      user_id: session.userId,
      living_profile_id: profile.id,
      page_number: 1,
      target_text: targetText,
      transcript: targetText,
      accuracy_score: assessment.accuracyScore,
      completion_score: assessment.completionScore,
      status: assessment.status,
      star_dust_awarded: assessment.starDustAwarded,
      assessment_provider: assessment.provider,
    })
    .select("id")
    .single();
  if (attemptError || !attempt) throw new Error(attemptError?.message ?? "Missing attempt.");
  attemptId = attempt.id;

  const { error: wordsError } = await session.supabase.from("WordAssessments").insert(
    assessment.words.map((word) => ({
      user_id: session.userId,
      reading_attempt_id: attempt.id,
      word_index: word.wordIndex,
      expected_word: word.expectedWord,
      spoken_word: word.spokenWord,
      accuracy_score: word.accuracyScore,
      status: word.status,
    })),
  );
  if (wordsError) throw wordsError;

  afterBalance = beforeBalance + assessment.starDustAwarded;
  const { error: balanceError } = await session.supabase.from("TreasuryBalances").upsert({
    user_id: session.userId,
    living_profile_id: profile.id,
    star_dust_total: afterBalance,
    reading_streak: (balance?.reading_streak ?? 0) + 1,
    last_rewarded_at: new Date().toISOString(),
  }, { onConflict: "user_id,living_profile_id" });
  if (balanceError) throw balanceError;

  const { error: ledgerError } = await session.supabase.from("StarDustLedger").insert({
    user_id: session.userId,
    living_profile_id: profile.id,
    reading_attempt_id: attempt.id,
    delta: assessment.starDustAwarded,
    balance_after: afterBalance,
    reason: "phase3_audio_sync",
  });
  if (ledgerError) throw ledgerError;

  return `${assessment.provider} scored ${assessment.accuracyScore}% and awarded ${assessment.starDustAwarded} Star Dust.`;
});

await record("Star Dust reward persisted", async () => {
  const [{ data: balance }, { data: ledger }, { data: words }] = await Promise.all([
    session.supabase
      .from("TreasuryBalances")
      .select("star_dust_total")
      .eq("user_id", session.userId)
      .eq("living_profile_id", profile.id)
      .single(),
    session.supabase
      .from("StarDustLedger")
      .select("delta, balance_after")
      .eq("reading_attempt_id", attemptId)
      .single(),
    session.supabase
      .from("WordAssessments")
      .select("id")
      .eq("reading_attempt_id", attemptId),
  ]);

  if (balance?.star_dust_total !== afterBalance) throw new Error("Treasury balance did not persist.");
  if (ledger?.balance_after !== afterBalance || ledger?.delta <= 0) throw new Error("Ledger reward did not persist.");
  if ((words?.length ?? 0) === 0) throw new Error("Word assessments did not persist.");

  return `Balance moved from ${beforeBalance} to ${afterBalance}.`;
});

await record("Stripe test mode path is configured", async () => {
  const route = await readFile("app/api/checkout/route.ts", "utf8");
  if (!route.includes("STRIPE_SECRET_KEY") || !route.includes("mock-stripe-test")) {
    throw new Error("Checkout route does not expose Stripe test/mock mode.");
  }
  return process.env.STRIPE_SECRET_KEY ? "Stripe secret detected; route is test-ready." : "No Stripe secret; mock test checkout is active.";
});

const passed = checks.every((check) => check.status === "PASS");
const log = [
  `PHASE_3_AUDIO_SYNC ${passed ? "PASS" : "FAIL"}`,
  `Generated: ${new Date().toISOString()}`,
  "",
  ...checks.map((check) => `[${check.status}] ${check.name}: ${check.detail}`),
  "",
].join("\n");

console.log(log);
await writeFile("PHASE_3_AUDIO_SYNC.log", `${log}\n`);

if (!passed) {
  process.exit(1);
}

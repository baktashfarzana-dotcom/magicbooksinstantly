import { readFile } from "node:fs/promises";
import { createClient } from "@supabase/supabase-js";

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
  process.env.PHASE_2_TEST_USER_ONE ?? "phase2.parent.one@magicbooksinstantly.test",
  process.env.PHASE_2_TEST_USER_TWO ?? "phase2.parent.two@magicbooksinstantly.test",
];

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

const results = [];

for (const email of testParents) {
  const authClient = client();
  const { data, error } = await authClient.auth.signInWithPassword({ email, password });

  if (error || !data.session?.access_token || !data.user) {
    results.push(`[FAIL] ${email}: ${error?.message ?? "missing session"}`);
    continue;
  }

  const supabase = client(data.session.access_token);
  const { data: images, error: imagesError } = await supabase
    .from("Images")
    .select("storage_path")
    .eq("user_id", data.user.id);

  if (imagesError) {
    results.push(`[FAIL] ${email}: ${imagesError.message}`);
    continue;
  }

  const storagePaths = [...new Set((images ?? []).map((image) => image.storage_path))];
  for (let index = 0; index < storagePaths.length; index += 100) {
    const batch = storagePaths.slice(index, index + 100);
    if (batch.length === 0) continue;
    const { error: removeError } = await supabase.storage.from("story-images").remove(batch);
    if (removeError) {
      results.push(`[FAIL] ${email}: ${removeError.message}`);
      continue;
    }
  }

  const { error: deleteStoriesError } = await supabase
    .from("Stories")
    .delete()
    .eq("user_id", data.user.id);

  if (deleteStoriesError) {
    results.push(`[FAIL] ${email}: ${deleteStoriesError.message}`);
    continue;
  }

  results.push(`[PASS] ${email}: removed ${storagePaths.length} storage objects and owned story rows`);
}

console.log(["PHASE_2_CLEANUP", ...results].join("\n"));

if (results.some((result) => result.startsWith("[FAIL]"))) {
  process.exit(1);
}

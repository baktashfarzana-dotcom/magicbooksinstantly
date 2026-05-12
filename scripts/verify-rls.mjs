const loadEnvFile = async (path) => {
  try {
    const text = await import("node:fs/promises").then((fs) => fs.readFile(path, "utf8"));
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
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!url || !publishableKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.");
  process.exit(1);
}

const headers = {
  apikey: publishableKey,
  Authorization: `Bearer ${publishableKey}`,
};

const probes = await Promise.all(
  ["Users", "LivingProfiles", "Stories", "Images", "VoiceProfiles", "TreasuryBalances", "ReadingAttempts", "WordAssessments", "StarDustLedger"].map(async (table) => {
    const response = await fetch(`${url}/rest/v1/${table}?select=*`, { headers });
    const body = await response.text();
    const blocked = response.status === 401 || response.status === 403 || body === "[]";

    return { table, status: response.status, blocked };
  }),
);

const failures = probes.filter((probe) => !probe.blocked);
if (failures.length > 0) {
  console.error("RLS anonymous probe failed.");
  console.error(failures);
  process.exit(1);
}

console.log("RLS anonymous probe passed: public tenant tables are not readable with an anonymous token.");

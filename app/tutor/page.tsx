import Link from "next/link";
import { redirect } from "next/navigation";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FlowNav, GlassPanel, MagicLogo, ProgressRows } from "@/components/magic-flow";
import { TutorReader } from "@/components/tutor-reader";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { StoryBook } from "@/lib/story-engine/schema";

const fallbackText = "In the moonlit library every brave little breath turned a locked door into a glowing page.";

export default async function TutorPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("LivingProfiles")
    .select("id, child_name, companion_mode_enabled")
    .eq("user_id", user.id)
    .order("created_at")
    .limit(1)
    .single();

  if (!profile) {
    redirect("/living-profile");
  }

  const { data: story } = await supabase
    .from("Stories")
    .select("id, story_json")
    .eq("user_id", user.id)
    .eq("living_profile_id", profile.id)
    .eq("status", "ready")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const storyJson = story?.story_json as StoryBook | undefined;
  const firstPage = storyJson?.pages?.[0];
  const targetText = firstPage?.text ?? fallbackText;

  return (
    <main className="app-cosmos min-h-screen px-4 py-5 text-white sm:px-6">
      <div className="mx-auto w-full max-w-7xl">
        <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <MagicLogo />
          <FlowNav />
          <Button asChild variant="ghost" className="border border-white/10 bg-white/8 text-white hover:bg-white/12">
            <Link href="/dashboard"><Home size={17} /> Parent</Link>
          </Button>
        </header>
        <section className="mb-5">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#9debd1]">Interactive Tutor</p>
          <h1 className="mt-2 text-4xl font-black tracking-normal">Read aloud, earn Star Dust</h1>
        </section>
        <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
          <TutorReader
            livingProfileId={profile.id}
            storyId={story?.id ?? null}
            pageNumber={1}
            targetText={targetText}
            companionReaction={firstPage?.companion_reaction ?? "Wow, you read that page with such brave focus!"}
            companionModeEnabled={profile.companion_mode_enabled}
          />
          <GlassPanel title="Growth economy" subtitle="Realtime-ready reward sync.">
            <ProgressRows />
            <p className="mt-5 rounded-lg border border-white/10 bg-[#0b1226] p-4 text-sm leading-6 text-slate-300">
              Successful completion writes a ReadingAttempt, WordAssessments, StarDustLedger row, and TreasuryBalance update.
            </p>
          </GlassPanel>
        </div>
      </div>
    </main>
  );
}

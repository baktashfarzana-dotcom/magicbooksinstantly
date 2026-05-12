import Link from "next/link";
import { redirect } from "next/navigation";
import { Home, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FlowNav, GlassPanel, MagicLogo, ProgressRows, TreasuryMap } from "@/components/magic-flow";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function TreasuryPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("LivingProfiles")
    .select("id, child_name")
    .eq("user_id", user.id)
    .order("created_at")
    .limit(1)
    .maybeSingle();

  const { data: balance } = profile
    ? await supabase
        .from("TreasuryBalances")
        .select("star_dust_total, reading_streak")
        .eq("user_id", user.id)
        .eq("living_profile_id", profile.id)
        .maybeSingle()
    : { data: null };

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
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#9debd1]">Hero&apos;s Treasury</p>
          <h1 className="mt-2 text-4xl font-black tracking-normal">Full map and badges</h1>
        </section>
        <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
          <GlassPanel title="Star Dust adventure map" subtitle="Gamified child view with rewards and book worlds.">
            <TreasuryMap />
          </GlassPanel>
          <div className="grid gap-5">
            <GlassPanel title="Star Dust" subtitle="Earned after stories and quizzes.">
              <p className="text-6xl font-black text-[#ffd36b]">{balance?.star_dust_total ?? 0}</p>
              <div className="mt-5 flex gap-2">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} className="fill-[#ffd36b] text-[#ffd36b]" size={26} />
                ))}
              </div>
            </GlassPanel>
            <GlassPanel title="Level progress" subtitle={`${profile?.child_name ?? "Hero"} reading streak: ${balance?.reading_streak ?? 0}`}>
              <ProgressRows />
            </GlassPanel>
          </div>
        </div>
      </div>
    </main>
  );
}

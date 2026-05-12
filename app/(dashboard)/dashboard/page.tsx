import { redirect } from "next/navigation";
import { signOut } from "@/lib/auth/actions";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { CompanionModeToggle } from "@/components/companion-mode-toggle";
import { BarChart, DonutScore, FlowShell, GlassPanel, ProgressRows, SidebarRail, TreasuryMap, Waveform } from "@/components/magic-flow";

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [{ data: account }, { count: profileCount }, { count: storyCount }, { data: firstProfile }] = await Promise.all([
    supabase.from("Users").select("*").eq("user_id", user.id).single(),
    supabase.from("LivingProfiles").select("id", { count: "exact", head: true }).eq("user_id", user.id),
    supabase.from("Stories").select("id", { count: "exact", head: true }).eq("user_id", user.id),
    supabase
      .from("LivingProfiles")
      .select("id, companion_mode_enabled")
      .eq("user_id", user.id)
      .order("created_at")
      .limit(1)
      .maybeSingle(),
  ]);

  return (
    <FlowShell
      eyebrow="Parent Command Center"
      title="Full Dashboard"
      subtitle="A dense operating console for reading streaks, story readiness, curriculum confidence, and parent approvals."
    >
      <div className="grid gap-5 lg:grid-cols-[220px_1fr]">
        <SidebarRail />
        <div className="grid gap-5">
          <section className="grid gap-5 md:grid-cols-4">
            {[
              ["Stories baked", storyCount ?? 0],
              ["Living profiles", profileCount ?? 0],
              ["Reading streak", 12],
              ["Approval queue", 4],
            ].map(([label, value]) => (
              <GlassPanel key={label as string}>
                <p className="text-xs font-black uppercase tracking-wider text-slate-400">{label}</p>
                <p className="mt-2 text-4xl font-black text-white">{value}</p>
              </GlassPanel>
            ))}
          </section>

          <section className="grid gap-5 lg:grid-cols-[1.25fr_.75fr]">
            <GlassPanel title="Reading analytics" subtitle="Weekly streaks, minutes, and completion confidence.">
              <BarChart />
            </GlassPanel>
            <GlassPanel title="Curriculum signal" subtitle="Comprehension and phonics health.">
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
                <DonutScore value={83} />
                <ProgressRows />
              </div>
            </GlassPanel>
          </section>

          <section className="grid gap-5 lg:grid-cols-3">
            <GlassPanel title="Hero treasury preview" subtitle="Child rewards without account controls.">
              <TreasuryMap />
            </GlassPanel>
            <GlassPanel title="Voice readiness" subtitle="Parent narration capture state.">
              <Waveform />
            </GlassPanel>
            <GlassPanel title="Active Encouragement" subtitle="Story Companion praise controls.">
              {firstProfile ? (
                <CompanionModeToggle
                  livingProfileId={firstProfile.id}
                  initialEnabled={firstProfile.companion_mode_enabled}
                />
              ) : (
                <p className="rounded-lg border border-white/10 bg-[#0b1226] p-4 text-sm font-bold text-slate-300">
                  Create a Living Profile to enable Companion Mode.
                </p>
              )}
            </GlassPanel>
          </section>

          <section className="grid gap-5 lg:grid-cols-3">
            <GlassPanel title="Account" subtitle={user?.email ?? "Signed in parent"}>
              <p className="text-sm font-bold text-slate-300">Subscription status</p>
              <p className="mt-2 text-2xl font-black text-[#ffd36b]">{account?.subscription_status ?? "trial"}</p>
              <form action={signOut} className="mt-5">
                <Button type="submit" variant="ghost" className="border border-white/10 bg-white/8 text-white hover:bg-white/12">
                  Sign out
                </Button>
              </form>
            </GlassPanel>
          </section>
        </div>
      </div>
    </FlowShell>
  );
}

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { StoryBakeForm } from "@/components/story-bake-form";
import { BarChart, FlowShell, GlassPanel, ProgressRows, SidebarRail, Waveform } from "@/components/magic-flow";

export default async function StoryKitchenPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profiles } = await supabase
    .from("LivingProfiles")
    .select("id, child_name")
    .eq("user_id", user.id)
    .order("created_at");

  return (
    <FlowShell
      eyebrow="Story Kitchen"
      title="Full Creation Console"
      subtitle="Parents pick the hurdle, curriculum lane, emotional tone, and bake state before a story enters the approval queue."
    >
      <div className="grid gap-5 lg:grid-cols-[220px_1fr]">
        <SidebarRail />
        <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
          <GlassPanel title="Bake controls" subtitle="Generate a 6, 10, or 13-minute story with anchored visuals.">
            <StoryBakeForm profiles={(profiles ?? []).map(({ id, child_name }) => ({ id, child_name }))} />
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {["Hurdle", "Curriculum", "Tone"].map((label) => (
                <div key={label} className="rounded-lg border border-white/10 bg-[#0b1226] p-4">
                  <p className="text-xs font-black uppercase tracking-wider text-slate-500">{label}</p>
                  <p className="mt-2 text-sm font-bold text-white">{label === "Hurdle" ? "Confidence" : label === "Curriculum" ? "Inference" : "Wonder"}</p>
                </div>
              ))}
            </div>
          </GlassPanel>
          <div className="grid gap-5">
            <GlassPanel title="Business progress" subtitle="Generation pipeline status.">
              <ProgressRows />
            </GlassPanel>
            <GlassPanel title="Narration wave" subtitle="Voice layer readiness.">
              <Waveform />
            </GlassPanel>
          </div>
          <GlassPanel title="Generation timeline" subtitle="Parallel pages, image prompts, and approval steps." className="lg:col-span-2">
            <BarChart />
          </GlassPanel>
        </div>
      </div>
    </FlowShell>
  );
}

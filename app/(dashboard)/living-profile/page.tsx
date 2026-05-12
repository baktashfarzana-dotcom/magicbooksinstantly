import { Camera, Gem, UsersRound } from "lucide-react";
import { createLivingProfile } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FlowShell, GlassPanel, HeroPortrait, SidebarRail } from "@/components/magic-flow";

export default function LivingProfilePage() {
  return (
    <FlowShell
      eyebrow="Living Profile Setup"
      title="Hero identity wizard"
      subtitle="Collect the child’s safe visual anchor, sidekick, favorite colors, and story boundaries before baking."
    >
      <div className="grid gap-5 lg:grid-cols-[220px_1fr]">
        <SidebarRail />
        <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
          <GlassPanel title="Physical appearance" subtitle="A parent-owned anchor, never a public profile.">
            <form action={createLivingProfile} className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="child_name" className="text-slate-200">Child name</Label>
                  <Input id="child_name" name="child_name" placeholder="Avery" required className="border-white/10 bg-[#0b1226] text-white" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age" className="text-slate-200">Age</Label>
                  <Input id="age" min="1" max="14" name="age" placeholder="7" type="number" className="border-white/10 bg-[#0b1226] text-white" />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {["Hair", "Outfit", "Sidekick"].map((label) => (
                  <div key={label} className="rounded-lg border border-white/10 bg-[#0b1226] p-4">
                    <p className="text-xs font-black uppercase tracking-wider text-slate-500">{label}</p>
                    <p className="mt-3 text-sm font-bold text-slate-200">{label === "Sidekick" ? "Moon fox" : "Parent described"}</p>
                  </div>
                ))}
              </div>
              <Button type="submit" className="bg-[#7c5cff] text-white hover:bg-[#8d75ff]">Save LivingProfile</Button>
            </form>
          </GlassPanel>
          <div className="grid gap-5">
            <GlassPanel title="Preview anchor" subtitle="Same hero across every page.">
              <HeroPortrait name="Avery" />
            </GlassPanel>
            <div className="grid grid-cols-3 gap-3">
              {[Camera, Gem, UsersRound].map((Icon, index) => (
                <div key={index} className="grid aspect-square place-items-center rounded-lg border border-white/10 bg-[#111a35] text-[#ffd36b]">
                  <Icon size={26} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </FlowShell>
  );
}

import { Radio } from "lucide-react";
import { FlowShell, GlassPanel, SidebarRail, Waveform } from "@/components/magic-flow";
import { VoiceCloneConsole } from "@/components/voice-clone-console";

export default function VoiceCloningPage() {
  return (
    <FlowShell
      eyebrow="Voice Cloning Center"
      title="Parent narration studio"
      subtitle="A focused 60-second voice capture flow with waveform confidence, consent status, and story narration readiness."
    >
      <div className="grid gap-5 lg:grid-cols-[220px_1fr]">
        <SidebarRail />
        <div className="grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
          <GlassPanel title="Parent voice capture" subtitle="Read the script and watch the waveform quality.">
            <Waveform />
            <VoiceCloneConsole />
          </GlassPanel>
          <div className="grid gap-5">
            <GlassPanel title="Consent shield" subtitle="Parent controlled.">
              <Radio className="mb-5 text-[#58e6b5]" size={34} />
              <p className="text-3xl font-black text-white">92%</p>
              <p className="mt-2 text-sm text-slate-400">Signal clarity for bedtime narration.</p>
            </GlassPanel>
            <GlassPanel title="Voice packs" subtitle="Approved stories only.">
              <div className="grid gap-3">
                {["Bedtime calm", "Adventure bright", "Grandparent gift"].map((pack) => (
                  <div key={pack} className="rounded-lg border border-white/10 bg-[#0b1226] px-4 py-3 text-sm font-bold text-slate-200">{pack}</div>
                ))}
              </div>
            </GlassPanel>
          </div>
        </div>
      </div>
    </FlowShell>
  );
}

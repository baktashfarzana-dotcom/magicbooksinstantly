import { CheckCircle2, Clock3, Eye, XCircle } from "lucide-react";
import { FlowShell, GlassPanel, SidebarRail, BookStrip } from "@/components/magic-flow";

export default function LibraryQueuePage() {
  const queue = [
    ["Avery and the Brave Little Step", "Ready for approval", CheckCircle2, "#58e6b5"],
    ["The Sharing Star", "Needs parent review", Clock3, "#ffd36b"],
    ["Moon Fox and the New Food", "Image QA pending", Eye, "#7c5cff"],
    ["The Too-Scary Cave", "Blocked by safety", XCircle, "#ff6f61"],
  ] as const;

  return (
    <FlowShell
      eyebrow="Library & Approval Queue"
      title="Parent approval console"
      subtitle="Generated books wait here until a parent approves the story, images, voice layer, and child visibility."
    >
      <div className="grid gap-5 lg:grid-cols-[220px_1fr]">
        <SidebarRail />
        <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
          <GlassPanel title="Approval queue" subtitle="Nothing reaches the child until approved.">
            <div className="grid gap-3">
              {queue.map(([title, status, Icon, color]) => (
                <div key={title} className="flex items-center justify-between gap-4 rounded-lg border border-white/10 bg-[#0b1226] p-4">
                  <div>
                    <p className="font-black text-white">{title}</p>
                    <p className="mt-1 text-xs font-bold text-slate-400">{status}</p>
                  </div>
                  <Icon style={{ color }} size={24} />
                </div>
              ))}
            </div>
          </GlassPanel>
          <GlassPanel title="Child shelf preview" subtitle="Approved titles only.">
            <BookStrip />
          </GlassPanel>
        </div>
      </div>
    </FlowShell>
  );
}

"use client";

import { useState, useTransition } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CompanionModeToggle({
  livingProfileId,
  initialEnabled,
}: {
  livingProfileId: string;
  initialEnabled: boolean;
}) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [message, setMessage] = useState("Active encouragement is available in the reader.");
  const [isPending, startTransition] = useTransition();

  function updateCompanionMode(nextEnabled: boolean) {
    setEnabled(nextEnabled);
    setMessage("Saving Companion Mode...");

    startTransition(async () => {
      const response = await fetch("/api/profiles/companion-mode", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ livingProfileId, enabled: nextEnabled }),
      });
      const payload = await response.json();

      if (!response.ok) {
        setEnabled(!nextEnabled);
        setMessage(payload.error ?? "Could not save Companion Mode.");
        return;
      }

      setMessage(payload.enabled ? "Active encouragement is on." : "Active encouragement is off.");
    });
  }

  return (
    <div className="rounded-lg border border-white/10 bg-[#0b1226] p-4">
      <div className="mb-4 flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-lg bg-[#7c5cff]/20 text-[#9debd1]">
          <Sparkles size={18} />
        </span>
        <div>
          <p className="text-sm font-black text-white">Companion Mode</p>
          <p className="text-xs leading-5 text-slate-400">Controls active praise after a page is read.</p>
        </div>
      </div>
      <Button
        type="button"
        disabled={isPending}
        variant={enabled ? "secondary" : "ghost"}
        onClick={() => updateCompanionMode(!enabled)}
        className="w-full border border-white/10 bg-white/8 text-white hover:bg-white/12"
      >
        {enabled ? "Active Encouragement On" : "Active Encouragement Off"}
      </Button>
      <p className="mt-3 text-xs font-bold text-slate-400">{message}</p>
    </div>
  );
}

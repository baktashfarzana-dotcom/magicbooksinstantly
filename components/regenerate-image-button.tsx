"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function RegenerateImageButton({
  storyId,
  pageNumber,
}: {
  storyId: string;
  pageNumber: number;
}) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function regenerate() {
    setMessage("");

    startTransition(async () => {
      const response = await fetch(`/api/stories/${storyId}/images/${pageNumber}/regenerate`, {
        method: "POST",
      });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        setMessage(payload.error ?? "Redo failed.");
        return;
      }

      setMessage("Image refreshed.");
      router.refresh();
    });
  }

  return (
    <div className="grid gap-1">
      <Button
        type="button"
        variant="secondary"
        onClick={regenerate}
        disabled={isPending}
        className="h-9 border border-white/10 bg-white/10 text-white hover:bg-white/15"
      >
        <RefreshCw size={15} className={isPending ? "animate-spin" : ""} />
        Redo image
      </Button>
      {message ? <p className="text-xs font-bold text-slate-400">{message}</p> : null}
    </div>
  );
}

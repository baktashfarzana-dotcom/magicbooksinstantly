"use client";

import { useTransition } from "react";
import { Gift, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CheckoutButton({ plan, gift = false }: { plan: string; gift?: boolean }) {
  const [isPending, startTransition] = useTransition();

  function checkout() {
    startTransition(async () => {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const payload = await response.json();
      if (response.ok && payload.checkoutUrl) {
        window.location.href = payload.checkoutUrl;
      }
    });
  }

  return (
    <Button type="button" onClick={checkout} disabled={isPending} className="w-full bg-[#ffd36b] text-[#161021] hover:bg-[#ffe29a]">
      {gift ? <Gift size={17} /> : <Sparkles size={17} />}
      {isPending ? "Opening..." : "Choose"}
    </Button>
  );
}

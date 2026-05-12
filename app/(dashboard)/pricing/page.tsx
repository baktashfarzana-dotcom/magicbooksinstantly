import { HeartHandshake } from "lucide-react";
import { FlowShell, GlassPanel, SidebarRail, BookStrip } from "@/components/magic-flow";
import { CheckoutButton } from "@/components/checkout-button";

export default function PricingPage() {
  return (
    <FlowShell
      eyebrow="Pricing & Gifting Checkout"
      title="Family sharing and gifting"
      subtitle="A Stripe-ready checkout surface for grandparents, subscribers, and story bundles."
    >
      <div className="grid gap-5 lg:grid-cols-[220px_1fr]">
        <SidebarRail />
        <div className="grid gap-5 lg:grid-cols-3">
          {[
            ["Starter", "$9", "3 story bakes"],
            ["Family", "$19", "Unlimited child profiles"],
            ["Grandparent Gift", "$49", "Giftable story bundle"],
          ].map(([plan, price, copy], index) => (
            <GlassPanel key={plan} title={plan} subtitle={copy}>
              <div className="mb-6 flex items-end gap-2">
                <p className="text-5xl font-black text-white">{price}</p>
                <p className="pb-2 text-sm font-bold text-slate-400">{index === 2 ? "one-time" : "/mo"}</p>
              </div>
              <CheckoutButton plan={String(plan).toLowerCase().replaceAll(" ", "-")} gift={index === 2} />
            </GlassPanel>
          ))}
          <GlassPanel title="Gift preview" subtitle="Books ready for family sharing." className="lg:col-span-2">
            <BookStrip />
          </GlassPanel>
          <GlassPanel title="Subscriber perks" subtitle="More approvals, voices, and badges.">
            <HeartHandshake className="mb-5 text-[#58e6b5]" size={34} />
            <p className="text-sm leading-6 text-slate-300">Stripe integration placeholder with a checkout-ready layout and gifting copy.</p>
          </GlassPanel>
        </div>
      </div>
    </FlowShell>
  );
}

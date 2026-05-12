import Link from "next/link";
import { Brain, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FlowNav, GlassPanel, MagicLogo, ProgressRows, QuizChoices } from "@/components/magic-flow";

export default function QuizPage() {
  return (
    <main className="app-cosmos min-h-screen px-4 py-5 text-white sm:px-6">
      <div className="mx-auto w-full max-w-6xl">
        <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <MagicLogo />
          <FlowNav />
          <Button asChild variant="ghost" className="border border-white/10 bg-white/8 text-white hover:bg-white/12">
            <Link href="/dashboard"><Home size={17} /> Parent</Link>
          </Button>
        </header>
        <section className="grid gap-5 lg:grid-cols-[1fr_320px]">
          <GlassPanel title="Adaptive Quiz Screen" subtitle="Post-book reading comprehension test.">
            <div className="mb-6 flex items-center gap-4 rounded-lg border border-white/10 bg-[#0b1226] p-5">
              <span className="grid size-14 place-items-center rounded-lg bg-[#7c5cff] text-white">
                <Brain size={30} />
              </span>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#9debd1]">Question 3 of 5</p>
                <h1 className="mt-1 text-3xl font-black tracking-normal text-white">What helped the hero open the glowing door?</h1>
              </div>
            </div>
            <QuizChoices />
          </GlassPanel>
          <GlassPanel title="Adaptive signal" subtitle="Difficulty changes after each answer.">
            <ProgressRows />
            <p className="mt-5 rounded-lg border border-white/10 bg-[#0b1226] p-4 text-sm leading-6 text-slate-300">
              The next question gets gentler when confidence drops and richer when comprehension is strong.
            </p>
          </GlassPanel>
        </section>
      </div>
    </main>
  );
}

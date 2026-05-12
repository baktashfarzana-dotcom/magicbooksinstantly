import Link from "next/link";
import {
  BadgeCheck,
  BookOpen,
  Brain,
  ChevronRight,
  Gift,
  Library,
  Mic2,
  Moon,
  ShieldCheck,
  Sparkles,
  Star,
  WandSparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const flowLinks = [
  { href: "/dashboard", label: "Command" },
  { href: "/story-kitchen", label: "Kitchen" },
  { href: "/living-profile", label: "Profile" },
  { href: "/voice-cloning", label: "Voice" },
  { href: "/library", label: "Library" },
  { href: "/treasury", label: "Treasury" },
  { href: "/tutor", label: "Tutor" },
  { href: "/quiz", label: "Quiz" },
  { href: "/pricing", label: "Gifting" },
];

const bookCovers = [
  ["#75d6ff", "#f6b35d"],
  ["#ff8a6b", "#ffe478"],
  ["#7ef0b2", "#6977ff"],
  ["#cfa2ff", "#ffba6d"],
];

export function MagicLogo() {
  return (
    <Link href="/" className="flex items-center gap-2 text-sm font-black text-white">
      <span className="grid size-8 place-items-center rounded-lg bg-[#7c5cff] text-white shadow-[0_0_24px_rgba(124,92,255,.55)]">
        <Sparkles size={17} />
      </span>
      MagicBooksInstantly
    </Link>
  );
}

export function FlowNav() {
  return (
    <nav className="rounded-lg border border-white/10 bg-[#0f1730]/74 px-3 py-2 shadow-[0_18px_70px_rgba(2,6,23,.35)] backdrop-blur-xl">
      <div className="flex flex-wrap items-center gap-1">
        {flowLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-md px-3 py-2 text-xs font-bold text-slate-300 transition hover:bg-white/8 hover:text-white"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

export function FlowShell({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <main className="app-cosmos min-h-screen px-4 py-5 text-white sm:px-6">
      <div className="mx-auto w-full max-w-7xl">
        <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <MagicLogo />
          <FlowNav />
        </header>
        <section className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#9debd1]">{eyebrow}</p>
            <h1 className="mt-2 text-3xl font-black tracking-normal text-white sm:text-4xl">{title}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">{subtitle}</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/8 px-4 py-3 text-right shadow-[0_0_40px_rgba(124,92,255,.14)]">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Bake state</p>
            <p className="mt-1 text-lg font-black text-[#ffd36b]">Ready</p>
          </div>
        </section>
        {children}
      </div>
    </main>
  );
}

export function GlassPanel({
  title,
  subtitle,
  children,
  className = "",
}: {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-lg border border-white/10 bg-[#111a35]/82 p-4 shadow-[0_22px_90px_rgba(2,6,23,.35)] backdrop-blur-xl ${className}`}>
      {title ? (
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-black text-white">{title}</h2>
            {subtitle ? <p className="mt-1 text-xs leading-5 text-slate-400">{subtitle}</p> : null}
          </div>
          <span className="rounded-md border border-white/10 bg-white/8 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-[#ffd36b]">
            Live
          </span>
        </div>
      ) : null}
      {children}
    </section>
  );
}

export function SidebarRail() {
  const items = [
    ["Overview", Sparkles],
    ["Profiles", BadgeCheck],
    ["Kitchen", WandSparkles],
    ["Library", Library],
    ["Voice", Mic2],
  ] as const;

  return (
    <aside className="rounded-lg border border-white/10 bg-[#0c1328]/90 p-3">
      <MagicLogo />
      <div className="mt-5 grid gap-1">
        {items.map(([label, Icon], index) => (
          <div
            key={label}
            className={`flex items-center gap-3 rounded-md px-3 py-2 text-xs font-bold ${index === 0 ? "bg-[#7c5cff] text-white" : "text-slate-400"}`}
          >
            <Icon size={15} />
            {label}
          </div>
        ))}
      </div>
    </aside>
  );
}

export function BarChart() {
  const bars = [42, 64, 58, 76, 52, 88, 72, 96, 68, 82, 91, 73];
  return (
    <div className="flex h-44 items-end gap-3 rounded-lg border border-white/8 bg-[#0b1226] p-4">
      {bars.map((height, index) => (
        <div key={index} className="flex flex-1 flex-col items-center gap-2">
          <div
            className="w-full rounded-t-md bg-[linear-gradient(180deg,#ffd36b,#ff8c66_55%,#58e6b5)]"
            style={{ height: `${height}%` }}
          />
          <span className="text-[10px] font-bold text-slate-500">{index + 1}</span>
        </div>
      ))}
    </div>
  );
}

export function DonutScore({ value = 78 }: { value?: number }) {
  return (
    <div className="grid place-items-center">
      <div
        className="grid size-28 place-items-center rounded-full"
        style={{ background: `conic-gradient(#58e6b5 ${value * 3.6}deg, rgba(255,255,255,.08) 0deg)` }}
      >
        <div className="grid size-20 place-items-center rounded-full bg-[#111a35] text-center">
          <span className="text-2xl font-black text-white">{value}</span>
          <span className="-mt-3 text-[10px] font-bold uppercase text-slate-400">sync</span>
        </div>
      </div>
    </div>
  );
}

export function ProgressRows() {
  const rows = [
    ["Phonics", 82, "#58e6b5"],
    ["Inference", 68, "#ffd36b"],
    ["Confidence", 91, "#7c5cff"],
    ["Recall", 54, "#ff8c66"],
  ];
  return (
    <div className="grid gap-3">
      {rows.map(([label, value, color]) => (
        <div key={label as string}>
          <div className="mb-1 flex justify-between text-xs font-bold text-slate-300">
            <span>{label}</span>
            <span>{value}%</span>
          </div>
          <div className="h-2 rounded-full bg-white/8">
            <div className="h-full rounded-full" style={{ width: `${value}%`, backgroundColor: color as string }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function HeroPortrait({ name = "Avery" }: { name?: string }) {
  return (
    <div className="relative mx-auto aspect-[4/5] w-full max-w-64 overflow-hidden rounded-lg border border-white/12 bg-[linear-gradient(160deg,#273b74,#17213f_55%,#422a4e)] shadow-[0_28px_70px_rgba(0,0,0,.38)]">
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(180deg,transparent,#58e6b5)] opacity-25" />
      <div className="absolute left-1/2 top-16 size-28 -translate-x-1/2 rounded-full bg-[#9a5f42] shadow-[0_0_0_14px_#2b1b18]" />
      <div className="absolute left-1/2 top-44 h-40 w-36 -translate-x-1/2 rounded-t-[4rem] bg-[#446cff]" />
      <div className="absolute bottom-4 left-4 right-4 rounded-md bg-[#0b1226]/76 px-3 py-2 backdrop-blur">
        <p className="text-xs font-black uppercase tracking-wider text-[#ffd36b]">Living Profile</p>
        <p className="text-lg font-black text-white">{name}</p>
      </div>
    </div>
  );
}

export function BookStrip() {
  return (
    <div className="flex gap-3 overflow-hidden">
      {bookCovers.map(([a, b], index) => (
        <div
          key={index}
          className="relative h-44 min-w-28 overflow-hidden rounded-lg border border-white/10 shadow-[10px_14px_30px_rgba(0,0,0,.3)]"
          style={{ background: `linear-gradient(145deg, ${a}, ${b})` }}
        >
          <div className="absolute left-5 top-8 size-14 rounded-full bg-[#9a5f42] shadow-[0_0_0_8px_#2b1b18]" />
          <div className="absolute bottom-4 left-3 right-3 text-xs font-black leading-4 text-white">Magic Book {index + 1}</div>
        </div>
      ))}
    </div>
  );
}

export function TreasuryMap() {
  const cells = Array.from({ length: 20 }, (_, index) => index);
  return (
    <div className="grid grid-cols-5 gap-2 rounded-lg border border-white/8 bg-[#0b1226] p-3">
      {cells.map((cell) => (
        <div
          key={cell}
          className={`grid aspect-square place-items-center rounded-md text-xs font-black ${cell % 4 === 0 ? "bg-[#ffd36b] text-[#1b1430]" : cell % 3 === 0 ? "bg-[#58e6b5] text-[#08251e]" : "bg-[#1f2b52] text-slate-300"}`}
        >
          {cell % 5 === 0 ? <Star className="fill-current" size={15} /> : cell + 1}
        </div>
      ))}
    </div>
  );
}

export function Waveform() {
  return (
    <div className="flex h-32 items-center gap-1 rounded-lg border border-white/8 bg-[#0b1226] p-4">
      {Array.from({ length: 46 }, (_, index) => {
        const height = 22 + Math.abs(Math.sin(index * 0.55)) * 76;
        return (
          <div
            key={index}
            className={`w-full rounded-full ${index < 24 ? "bg-[#58e6b5]" : "bg-slate-600"}`}
            style={{ height }}
          />
        );
      })}
    </div>
  );
}

export function QuizChoices() {
  return (
    <div className="grid gap-3">
      {["A brave breath", "A secret shortcut", "Ignoring the feeling", "Running away"].map((choice, index) => (
        <div
          key={choice}
          className={`flex items-center justify-between rounded-lg border px-4 py-3 text-sm font-bold ${index === 0 ? "border-[#58e6b5]/60 bg-[#58e6b5]/15 text-white" : "border-white/10 bg-white/5 text-slate-300"}`}
        >
          {choice}
          {index === 0 ? <BadgeCheck className="text-[#58e6b5]" size={18} /> : null}
        </div>
      ))}
    </div>
  );
}

export function LandingShowcase() {
  const pages = [
    ["Parent Command Center", "/dashboard"],
    ["Story Kitchen", "/story-kitchen"],
    ["Living Profile Setup", "/living-profile"],
    ["Voice Cloning Studio", "/voice-cloning"],
    ["Hero's Treasury", "/treasury"],
    ["Adaptive Quiz", "/quiz"],
    ["Pricing & Gifting", "/pricing"],
    ["Library Queue", "/library"],
  ];

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {pages.map(([label, href], index) => (
        <Link key={href} href={href} className="group rounded-lg border border-white/10 bg-[#111a35]/82 p-3 shadow-[0_18px_60px_rgba(0,0,0,.25)]">
          <div className="mb-3 aspect-[1.45/1] overflow-hidden rounded-md border border-white/10 bg-[#0b1226] p-3">
            {index % 3 === 0 ? <BarChart /> : index % 3 === 1 ? <BookStrip /> : <TreasuryMap />}
          </div>
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-black text-white">{label}</p>
            <ChevronRight className="text-slate-500 transition group-hover:text-[#ffd36b]" size={17} />
          </div>
        </Link>
      ))}
    </div>
  );
}

export const icons = {
  BookOpen,
  Brain,
  Gift,
  Library,
  Mic2,
  Moon,
  ShieldCheck,
  Sparkles,
  WandSparkles,
};

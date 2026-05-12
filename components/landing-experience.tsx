"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  ChevronRight,
  Mic,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  User,
  Wand2,
  X,
} from "lucide-react";
import { PremadeStoryLibrary } from "@/components/premade-story-library";

export function LandingExperience() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-950 font-sans text-slate-50 selection:bg-indigo-500/30">
      <style jsx global>{`
        @keyframes magic-drift {
          0% { transform: translate3d(0, 0, 0) scale(1); }
          33% { transform: translate3d(24px, -34px, 0) scale(1.06); }
          66% { transform: translate3d(-18px, 18px, 0) scale(0.96); }
          100% { transform: translate3d(0, 0, 0) scale(1); }
        }
        .magic-drift {
          animation: magic-drift 8s ease-in-out infinite;
        }
        .magic-delay-2 {
          animation-delay: 2s;
        }
        .magic-delay-4 {
          animation-delay: 4s;
        }
        .text-gradient {
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        @keyframes sparkle-float {
          0%, 100% { opacity: .35; transform: translate3d(0, 0, 0) scale(1); }
          50% { opacity: 1; transform: translate3d(8px, -10px, 0) scale(1.15); }
        }
        .sparkle-float {
          animation: sparkle-float 4.8s ease-in-out infinite;
        }
      `}</style>

      <nav
        className={`fixed top-0 z-50 w-full transition-all duration-500 ${
          isScrolled
            ? "border-b border-white/10 bg-slate-950/60 py-4 shadow-2xl backdrop-blur-xl"
            : "bg-transparent py-6"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="size-6 text-indigo-400" />
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 text-gradient text-xl font-bold tracking-tight">
              MagicBooksInstantly
            </span>
          </Link>
          <div className="hidden items-center gap-8 text-sm font-medium md:flex">
            <a href="#features" className="text-slate-400 transition-colors hover:text-white">Features</a>
            <a href="#templates" className="text-slate-400 transition-colors hover:text-white">Templates</a>
            <a href="#library" className="text-slate-400 transition-colors hover:text-white">Voice Library</a>
            <a href="#pricing" className="text-slate-400 transition-colors hover:text-white">Pricing</a>
            <Link href="/login" className="text-slate-300 transition-colors hover:text-white">Log In</Link>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="rounded-full border border-white/10 bg-white/5 px-5 py-2.5 transition-all duration-300 hover:scale-105 hover:bg-white/10"
            >
              Start Baking
            </button>
          </div>
        </div>
      </nav>

      <section className="relative min-h-screen overflow-hidden bg-[#f5ecdf] pt-24 text-[#081936]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,255,255,.95),transparent_22rem),radial-gradient(circle_at_82%_12%,rgba(191,217,178,.44),transparent_20rem),linear-gradient(180deg,#fff8ee_0%,#e8d8c5_100%)]" />
        <div className="absolute left-0 top-0 h-full w-28 bg-[linear-gradient(90deg,rgba(211,180,143,.32),transparent)] blur-sm" />
        <div className="absolute right-0 top-0 h-full w-36 bg-[radial-gradient(circle_at_80%_18%,rgba(67,102,56,.35),transparent_9rem)]" />
        <div className="sparkle-float absolute left-[7%] top-[32%] size-2 rounded-full bg-white shadow-[0_0_18px_6px_rgba(255,221,139,.55)]" />
        <div className="sparkle-float absolute right-[22%] top-[15%] size-1.5 rounded-full bg-white shadow-[0_0_16px_5px_rgba(255,221,139,.5)] [animation-delay:1.2s]" />
        <div className="sparkle-float absolute bottom-[21%] right-[10%] size-2 rounded-full bg-white shadow-[0_0_18px_6px_rgba(255,221,139,.55)] [animation-delay:2.1s]" />

        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-6rem)] max-w-7xl items-center px-4 py-10 sm:px-6">
          <div className="relative mx-auto w-full max-w-6xl">
            <div className="relative rounded-[2rem] border border-black/15 bg-[#202225] p-3 shadow-[0_34px_90px_rgba(29,24,18,.38)]">
              <div className="relative min-h-[35rem] overflow-hidden rounded-[1.35rem] bg-white">
                <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 text-xs font-semibold text-slate-500 sm:px-9">
                  <div className="text-base font-black text-[#081936]">MagicBooksInstantly</div>
                  <div className="hidden items-center gap-7 md:flex">
                    {["Home", "Reviews", "Resources", "Favorites", "Log In"].map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                    <span className="rounded-lg bg-[#5d86df] px-4 py-2 font-black text-white">Sign Up</span>
                  </div>
                </div>

                <div className="grid gap-8 px-7 py-10 lg:grid-cols-[.9fr_1.1fr] lg:px-12 lg:py-14">
                  <div className="relative z-10 flex flex-col justify-center">
                    <h1 className="max-w-md text-4xl font-black leading-[1.08] tracking-normal text-[#071832] sm:text-5xl">
                      Magically Turn your Child into The Main Character.
                    </h1>
                    <p className="mt-5 max-w-sm text-base font-semibold leading-7 text-slate-500">
                      Make a high-quality Pixar-style version with the same curls, smile, outfit, and bright little details.
                    </p>
                    <div className="mt-8 w-60 overflow-hidden rounded-2xl border border-white bg-white p-1 shadow-[0_24px_55px_rgba(15,23,42,.22)] sm:w-64">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/hero-child-photo.svg"
                        alt="Smiling child reference photo"
                        className="aspect-[.82/1] w-full rounded-[1rem] object-cover"
                      />
                    </div>
                  </div>

                  <div className="relative flex min-h-[29rem] items-center justify-center">
                    <div className="absolute bottom-0 right-3 h-28 w-[78%] rounded-full bg-[#f5c45d]/40 blur-3xl" />
                    <div className="relative w-[19rem] rotate-[3deg] drop-shadow-[24px_30px_28px_rgba(28,37,29,.32)] sm:w-[23rem]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/broccoli-dinosaur-cover.svg"
                        alt="The Broccoli Dinosaur storybook cover with a boy, broccoli, and dinosaur"
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="mx-auto h-4 w-[92%] rounded-b-[2rem] bg-[#c8c5c1] shadow-[0_18px_35px_rgba(29,24,18,.24)]" />
            </div>

            <div className="relative mx-auto h-24 max-w-5xl rounded-b-[3rem] bg-[linear-gradient(180deg,#bcb8b3,#8c8885)] shadow-[0_28px_60px_rgba(29,24,18,.28)]">
              <div className="absolute left-1/2 top-3 h-2 w-28 -translate-x-1/2 rounded-full bg-[#6f6d6b]/70" />
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="relative z-10 border-t border-white/5 bg-slate-950/50 py-32 backdrop-blur-3xl">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-20 text-center">
            <h2 className="mb-6 text-4xl font-bold md:text-5xl">More Than Just a Story.</h2>
            <p className="mx-auto max-w-2xl text-xl text-slate-400">A complete curriculum disguised as a breathtaking adventure.</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <FeatureCard
              icon={Mic}
              tone="indigo"
              title="The Stealth Tutor"
              copy="The reading layer follows along, highlights progress, and gently supports hard syllables without breaking the magic."
            />
            <FeatureCard
              icon={PlayCircle}
              tone="purple"
              title="Parental Voice Cloning"
              copy="Parents can prepare a voice narration track so bedtime stories still feel close, familiar, and comforting."
            />
            <FeatureCard
              icon={BookOpen}
              tone="amber"
              title="Cinematic Consistency"
              copy="Master Anchor prompts keep the hero visually consistent from page one through the final reward."
            />
          </div>
        </div>
      </section>

      <section id="templates" className="relative z-10 border-t border-white/5 bg-slate-950 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <PremadeStoryLibrary />
        </div>
      </section>

      <section id="library" className="border-t border-white/5 bg-slate-950 py-24">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.22em] text-indigo-300">Voice Library</p>
            <h2 className="text-4xl font-black tracking-tight md:text-5xl">Pick the narrator before the story opens.</h2>
            <p className="mt-5 text-lg leading-8 text-slate-400">
              Parent voice, gentle teacher, and cinematic storyteller modes live behind parent approval.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {["Parent Voice", "Gentle Teacher", "Epic Storyteller"].map((voice) => (
              <div key={voice} className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                <Mic className="mb-8 text-indigo-300" />
                <h3 className="text-xl font-bold">{voice}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">Approved narration profile</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="border-t border-white/5 bg-slate-950 py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-4xl font-black tracking-tight md:text-5xl">Start with a profile. Bake when ready.</h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-400">
            The checkout flow is ready for subscriptions and family gifting, while the story engine stays parent-approved.
          </p>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="mt-9 rounded-full bg-white px-7 py-4 font-bold text-slate-950 transition hover:bg-indigo-100"
          >
            Start Baking
          </button>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-slate-950 py-12 text-center text-sm text-slate-500">
        <p>© 2026 MagicBooksInstantly. Built with Next.js & Supabase.</p>
      </footer>

      {isModalOpen ? <ProfileWizard onClose={() => setIsModalOpen(false)} /> : null}
    </div>
  );
}

type FeatureCardProps = {
  icon: React.ComponentType<{ className?: string }>;
  tone: "indigo" | "purple" | "amber";
  title: string;
  copy: string;
};

function FeatureCard({ icon: Icon, tone, title, copy }: FeatureCardProps) {
  const toneClasses = {
    indigo: "bg-indigo-500/20 text-indigo-400 hover:border-indigo-500/30 hover:shadow-[0_20px_40px_-15px_rgba(99,102,241,0.15)]",
    purple: "bg-purple-500/20 text-purple-400 hover:border-purple-500/30 hover:shadow-[0_20px_40px_-15px_rgba(168,85,247,0.15)]",
    amber: "bg-amber-500/20 text-amber-400 hover:border-amber-500/30 hover:shadow-[0_20px_40px_-15px_rgba(245,158,11,0.15)]",
  };

  return (
    <div className={`group cursor-default rounded-3xl border border-white/5 bg-white/[0.02] p-8 transition-all duration-500 hover:-translate-y-2 hover:bg-white/[0.04] ${toneClasses[tone]}`}>
      <div className={`mb-6 flex size-14 items-center justify-center rounded-2xl transition-transform duration-500 group-hover:scale-110 ${toneClasses[tone].split(" hover:")[0]}`}>
        <Icon className="size-7" />
      </div>
      <h3 className="mb-4 text-2xl font-bold text-slate-100">{title}</h3>
      <p className="leading-relaxed text-slate-400">{copy}</p>
    </div>
  );
}

function ProfileWizard({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [childName, setChildName] = useState("");
  const [saved, setSaved] = useState(false);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close profile wizard"
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative flex w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/5 bg-slate-900/50 px-6 py-4">
          <div className="flex gap-2">
            {[1, 2, 3].map((item) => (
              <div key={item} className={`h-1.5 w-8 rounded-full transition-colors ${item <= step ? "bg-indigo-500" : "bg-slate-800"}`} />
            ))}
          </div>
          <button type="button" onClick={onClose} className="rounded-full p-2 text-slate-400 transition-colors hover:bg-white/5 hover:text-white">
            <X className="size-5" />
          </button>
        </div>

        <div className="p-8">
          {saved ? (
            <div className="space-y-5">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-300">
                <ShieldCheck className="size-6" />
              </div>
              <h2 className="text-3xl font-bold text-white">Profile saved locally.</h2>
              <p className="text-slate-400">Sign in to persist this LivingProfile to Supabase and start baking stories.</p>
              <Link href="/login" className="inline-flex rounded-full bg-indigo-600 px-6 py-3 font-bold text-white transition hover:bg-indigo-500">
                Continue to login
              </Link>
            </div>
          ) : null}

          {!saved && step === 1 ? (
            <div className="space-y-6">
              <div className="mb-2 flex size-12 items-center justify-center rounded-2xl bg-indigo-500/20 text-indigo-400">
                <User className="size-6" />
              </div>
              <h2 className="text-3xl font-bold text-white">Who is the Hero?</h2>
              <p className="text-slate-400">Let&apos;s start building your child&apos;s Living Profile.</p>
              <div className="space-y-4 pt-4">
                <Field label="Child's First Name">
                  <input
                    type="text"
                    value={childName}
                    onChange={(event) => setChildName(event.target.value)}
                    placeholder="e.g. Idris"
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition-all placeholder:text-slate-600 focus:ring-2 focus:ring-indigo-500"
                  />
                </Field>
                <Field label="Age">
                  <select className="w-full appearance-none rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition-all focus:ring-2 focus:ring-indigo-500">
                    <option>4 years old</option>
                    <option>5 years old</option>
                    <option>6 years old</option>
                    <option>7 years old</option>
                    <option>8+ years old</option>
                  </select>
                </Field>
              </div>
            </div>
          ) : null}

          {!saved && step === 2 ? (
            <div className="space-y-6">
              <div className="mb-2 flex size-12 items-center justify-center rounded-2xl bg-purple-500/20 text-purple-400">
                <Sparkles className="size-6" />
              </div>
              <h2 className="text-3xl font-bold text-white">Visual Identity</h2>
              <p className="text-slate-400">How should {childName || "the hero"} look in the story?</p>
              <div className="space-y-4 pt-4">
                <Field label="Hair Style & Color">
                  <input
                    type="text"
                    placeholder="e.g. short curly brown hair"
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition-all placeholder:text-slate-600 focus:ring-2 focus:ring-purple-500"
                  />
                </Field>
                <Field label="Favorite Outfit">
                  <input
                    type="text"
                    placeholder="e.g. red cape and blue jeans"
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition-all placeholder:text-slate-600 focus:ring-2 focus:ring-purple-500"
                  />
                </Field>
              </div>
            </div>
          ) : null}

          {!saved && step === 3 ? (
            <div className="space-y-6">
              <div className="mb-2 flex size-12 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400">
                <Mic className="size-6" />
              </div>
              <h2 className="text-3xl font-bold text-white">The Narrator</h2>
              <p className="text-slate-400">Who should read the story to {childName || "them"}?</p>
              <div className="grid gap-3 pt-4">
                {["Clone My Voice", "The Gentle Teacher", "The Epic Storyteller"].map((voice, index) => (
                  <button
                    key={voice}
                    type="button"
                    className={`flex items-center rounded-xl border p-4 text-left transition-colors ${
                      index === 0 ? "border-indigo-500/50 bg-indigo-500/10 hover:bg-indigo-500/20" : "border-white/10 bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    <span className="mr-4 flex size-10 items-center justify-center rounded-full bg-slate-800 text-indigo-300">
                      {index === 0 ? <Mic className="size-5" /> : <PlayCircle className="size-5" />}
                    </span>
                    <span>
                      <span className="block font-bold text-white">{voice}</span>
                      <span className="text-xs text-slate-400">{index === 0 ? "Read a 60-second script" : "Approved narration profile"}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        {!saved ? (
          <div className="mt-auto flex items-center justify-between border-t border-white/5 bg-slate-900/50 p-6">
            {step > 1 ? (
              <button type="button" onClick={() => setStep(step - 1)} className="rounded-full px-6 py-2.5 text-slate-400 transition-colors hover:text-white">
                Back
              </button>
            ) : <div />}

            {step < 3 ? (
              <button type="button" onClick={() => setStep(step + 1)} className="ml-auto rounded-full bg-indigo-600 px-6 py-2.5 font-medium text-white transition-colors hover:bg-indigo-500">
                Continue
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setSaved(true)}
                className="ml-auto rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-2.5 font-bold text-white shadow-[0_0_20px_-5px_rgba(168,85,247,0.5)] transition-all hover:from-indigo-400 hover:to-purple-400"
              >
                Save Profile
              </button>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-400">{label}</span>
      {children}
    </label>
  );
}

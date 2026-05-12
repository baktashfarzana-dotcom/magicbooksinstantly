"use client";

import { useMemo, useState } from "react";
import {
  Baby,
  Backpack,
  Brain,
  HeartHandshake,
  Home,
  LibraryBig,
  ShieldCheck,
  Sparkles,
  Sprout,
  Sun,
  WandSparkles,
} from "lucide-react";
import { storyTemplateCategories, storyTemplateCount, type StoryTemplate } from "@/lib/story-templates";

const categoryIcons = {
  sunrise: Sun,
  volcano: Brain,
  friends: HeartHandshake,
  backpack: Backpack,
  lion: Sparkles,
  family: Baby,
  sprout: Sprout,
  shield: ShieldCheck,
  butterfly: Home,
  tools: WandSparkles,
};

export function PremadeStoryLibrary({
  onSelectTemplate,
  compact = false,
}: {
  onSelectTemplate?: (template: StoryTemplate) => void;
  compact?: boolean;
}) {
  const [activeCategoryId, setActiveCategoryId] = useState(storyTemplateCategories[0]?.id ?? "");
  const [query, setQuery] = useState("");

  const activeCategory = storyTemplateCategories.find((category) => category.id === activeCategoryId) ?? storyTemplateCategories[0];
  const filteredTemplates = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const templates = activeCategory?.templates ?? [];

    if (!normalizedQuery) {
      return templates;
    }

    return templates.filter((template) => {
      return `${template.title} ${template.lesson}`.toLowerCase().includes(normalizedQuery);
    });
  }, [activeCategory, query]);
  const normalizedQuery = query.trim().toLowerCase();
  const displayCategories = compact
    ? [{ ...activeCategory, templates: filteredTemplates }]
    : storyTemplateCategories
        .map((category) => ({
          ...category,
          templates: normalizedQuery
            ? category.templates.filter((template) => `${template.title} ${template.lesson}`.toLowerCase().includes(normalizedQuery))
            : category.templates,
        }))
        .filter((category) => category.templates.length > 0);

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/8 px-3 py-1.5 text-xs font-black uppercase tracking-[0.18em] text-[#ffd36b]">
            <LibraryBig size={15} />
            {storyTemplateCount} templates
          </div>
          <h3 className={`${compact ? "text-lg" : "text-2xl"} font-black tracking-normal text-white`}>
            Pre-made story templates
          </h3>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-400">
            Pick a parent-tested starting point, then bake it into a personalized story with the child as the consistent hero.
          </p>
        </div>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={compact ? "Search this category" : "Search all templates"}
          className="h-10 w-full rounded-lg border border-white/10 bg-[#0b1226] px-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-[#7c5cff] focus:ring-2 focus:ring-[#7c5cff]/30 sm:w-64"
        />
      </div>

      {compact ? (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {storyTemplateCategories.map((category) => {
            const Icon = categoryIcons[category.icon as keyof typeof categoryIcons] ?? Sparkles;
            const active = category.id === activeCategory.id;

            return (
              <button
                key={category.id}
                type="button"
                onClick={() => {
                  setActiveCategoryId(category.id);
                  setQuery("");
                }}
                className={`flex min-w-48 items-center gap-3 rounded-lg border px-3 py-3 text-left transition ${
                  active
                    ? "border-[#7c5cff]/70 bg-[#7c5cff]/18 text-white shadow-[0_0_35px_rgba(124,92,255,.18)]"
                    : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/8"
                }`}
              >
                <span className={`grid size-9 place-items-center rounded-md ${active ? "bg-[#7c5cff] text-white" : "bg-[#0b1226] text-[#9debd1]"}`}>
                  <Icon size={18} />
                </span>
                <span>
                  <span className="block text-xs font-black leading-4">{category.title}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{category.templates.length} stories</span>
                </span>
              </button>
            );
          })}
        </div>
      ) : null}

      <div className={`grid gap-4 ${compact ? "" : "lg:grid-cols-2"}`}>
        {displayCategories.map((category) => {
          const Icon = categoryIcons[category.icon as keyof typeof categoryIcons] ?? Sparkles;

          return (
            <div key={category.id} className="rounded-lg border border-white/10 bg-[#0b1226]/72 p-3">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2 px-1">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-md bg-[#7c5cff]/20 text-[#9debd1]">
                    <Icon size={18} />
                  </span>
                  <div>
                    <p className="text-sm font-black text-white">{category.title}</p>
                    <p className="text-xs leading-5 text-slate-400">{category.tagline}</p>
                  </div>
                </div>
                <span className="rounded-md bg-white/8 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-[#9debd1]">
                  {category.templates.length} shown
                </span>
              </div>

              <div className={`grid gap-2 ${compact ? "max-h-80 overflow-y-auto pr-1" : "sm:grid-cols-2"}`}>
                {category.templates.map((templateItem) => (
                  <button
                    key={templateItem.id}
                    type="button"
                    onClick={() => onSelectTemplate?.(templateItem)}
                    className="group rounded-lg border border-white/10 bg-white/[0.035] p-3 text-left transition hover:border-[#ffd36b]/50 hover:bg-[#ffd36b]/10"
                  >
                    <span className="block text-sm font-black leading-5 text-white group-hover:text-[#fff0b8]">
                      {templateItem.title}
                    </span>
                    <span className="mt-1 block text-xs leading-5 text-slate-400">{templateItem.lesson}</span>
                    {onSelectTemplate ? (
                      <span className="mt-3 inline-flex h-8 items-center rounded-md bg-white px-3 text-xs font-black text-[#161021]">
                        Use template
                      </span>
                    ) : null}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

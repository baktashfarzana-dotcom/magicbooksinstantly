import { CheckCircle2, Clock3, Eye, ImageIcon, XCircle } from "lucide-react";
import { FlowShell, GlassPanel, SidebarRail, BookStrip } from "@/components/magic-flow";
import { RegenerateImageButton } from "@/components/regenerate-image-button";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { StoryBook } from "@/lib/story-engine/schema";

function statusMeta(status: string) {
  if (status === "ready") return { label: "Ready for parent approval", Icon: CheckCircle2, color: "#58e6b5" };
  if (status === "failed") return { label: "Bake failed", Icon: XCircle, color: "#ff6f61" };
  return { label: "Images still baking", Icon: Clock3, color: "#ffd36b" };
}

export default async function LibraryQueuePage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: stories } = user
    ? await supabase
        .from("Stories")
        .select(`
          id,
          title,
          status,
          hurdle,
          living_profile_id,
          story_json,
          created_at,
          Images (
            id,
            page_number,
            storage_bucket,
            storage_path,
            generation_provider
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(12)
    : { data: [] };

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
              {(stories ?? []).length === 0 ? (
                <div className="rounded-lg border border-white/10 bg-[#0b1226] p-5 text-sm font-bold text-slate-400">
                  No generated stories yet. Bake one from the Story Kitchen and it will appear here for review.
                </div>
              ) : null}
              {(stories ?? []).map((story) => {
                const { label, Icon, color } = statusMeta(story.status);
                const storyJson = story.story_json as StoryBook;
                const images = [...(story.Images ?? [])].sort((a, b) => a.page_number - b.page_number);
                const imageCount = images.length;
                const pageCount = storyJson.total_pages_generated ?? storyJson.pages?.length ?? 0;

                return (
                  <div key={story.id} className="grid gap-4 rounded-lg border border-white/10 bg-[#0b1226] p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-black text-white">{story.title}</p>
                        <p className="mt-1 text-xs font-bold text-slate-400">{label}</p>
                        <p className="mt-2 text-xs leading-5 text-slate-500">
                          {story.hurdle} · {imageCount}/{pageCount} images · {storyJson.target_minutes ?? "?"} min
                        </p>
                      </div>
                      <Icon style={{ color }} size={24} />
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                      {images.slice(0, 6).map((image) => (
                        <div key={image.id} className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.035] p-3">
                          <div className="flex min-w-0 items-center gap-2">
                            <ImageIcon size={16} className="shrink-0 text-[#9debd1]" />
                            <div className="min-w-0">
                              <p className="text-sm font-black text-white">Page {image.page_number}</p>
                              <p className="truncate text-[11px] font-bold text-slate-500">{image.generation_provider}</p>
                            </div>
                          </div>
                          <RegenerateImageButton storyId={story.id} pageNumber={image.page_number} />
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <a
                        href={`/child?profile=${story.living_profile_id}&story=${story.id}`}
                        className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-sm font-black text-white transition hover:bg-white/15"
                      >
                        <Eye size={16} />
                        Review flipbook
                      </a>
                    </div>
                  </div>
                );
              })}
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

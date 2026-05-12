import Link from "next/link";
import { redirect } from "next/navigation";
import { BookOpen, Home, Sparkles } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Flipbook } from "@/components/flipbook";
import { FlowNav, MagicLogo } from "@/components/magic-flow";
import type { StoryBook } from "@/lib/story-engine/schema";

type ChildPageProps = {
  searchParams: Promise<{ profile?: string; story?: string }>;
};

export default async function ChildPage({ searchParams }: ChildPageProps) {
  const { profile, story } = await searchParams;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: childProfile } = profile
    ? await supabase
        .from("LivingProfiles")
        .select("id, child_name, age, companion_mode_enabled")
        .eq("id", profile)
        .eq("user_id", user.id)
        .single()
    : await supabase
        .from("LivingProfiles")
        .select("id, child_name, age, companion_mode_enabled")
        .eq("user_id", user.id)
        .order("created_at")
        .limit(1)
        .maybeSingle();

  if (!childProfile) {
    redirect("/dashboard");
  }

  const { data: selectedStory } = story
    ? await supabase
        .from("Stories")
        .select("id, title, story_json, status")
        .eq("id", story)
        .eq("living_profile_id", childProfile.id)
        .eq("user_id", user.id)
        .single()
    : await supabase
        .from("Stories")
        .select("id, title, story_json, status")
        .eq("living_profile_id", childProfile.id)
        .eq("user_id", user.id)
        .eq("status", "ready")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

  const { data: images } = selectedStory
    ? await supabase
        .from("Images")
        .select("page_number, storage_bucket, storage_path")
        .eq("story_id", selectedStory.id)
        .eq("user_id", user.id)
        .order("page_number")
    : { data: [] };

  const signedImages = await Promise.all(
    (images ?? []).map(async (image) => {
      const { data } = await supabase.storage
        .from(image.storage_bucket)
        .createSignedUrl(image.storage_path, 60 * 30);

      return {
        page_number: image.page_number,
        signedUrl: data?.signedUrl ?? "",
      };
    }),
  );

  return (
    <main className="app-cosmos min-h-screen px-4 py-5 text-white sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-2.5rem)] w-full max-w-7xl flex-col">
        <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <MagicLogo />
            <div className="hidden h-8 w-px bg-white/10 sm:block" />
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#9debd1]">Interactive Flipbook Reader</p>
              <h1 className="text-2xl font-black tracking-normal text-white">{childProfile.child_name}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FlowNav />
            <Button asChild variant="ghost" size="icon" aria-label="Return to parent dashboard" className="border border-white/10 bg-white/8 text-white hover:bg-white/12">
              <Link href="/dashboard"><Home size={22} /></Link>
            </Button>
          </div>
        </header>

        {selectedStory?.status === "ready" ? (
          <Flipbook
            story={selectedStory.story_json as StoryBook}
            images={signedImages.filter((image) => image.signedUrl)}
            livingProfileId={childProfile.id}
            storyId={selectedStory.id}
            companionModeEnabled={childProfile.companion_mode_enabled}
          />
        ) : (
          <section className="grid flex-1 place-items-center py-10">
            <div className="w-full max-w-2xl rounded-lg border border-white/10 bg-[#111a35]/82 p-8 text-center shadow-[0_24px_120px_rgba(2,6,23,.45)]">
              <div className="mx-auto grid size-28 place-items-center rounded-lg bg-[#ffd36b] text-[#161021]">
                <BookOpen size={52} />
              </div>
              <h2 className="mt-6 text-4xl font-black tracking-normal text-white">Waiting for your first story.</h2>
              <p className="mx-auto mt-4 max-w-lg text-lg leading-8 text-slate-300">
                Your bookshelf is ready. A grown-up can bake the first adventure from the Command Center.
              </p>
              <div className="mt-8">
                <Button asChild size="lg" className="bg-[#7c5cff] text-white hover:bg-[#8d75ff]">
                  <Link href="/dashboard"><Sparkles size={18} /> Back to grown-up view</Link>
                </Button>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

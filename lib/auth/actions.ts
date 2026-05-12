"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function getBaseUrl() {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

function hasSupabaseEnv() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) && Boolean(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
}

export async function loginWithGoogle() {
  if (!hasSupabaseEnv()) {
    redirect("/login?error=missing_supabase_env");
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${getBaseUrl()}/callback`,
    },
  });

  if (error || !data.url) {
    redirect("/login?error=oauth");
  }

  redirect(data.url);
}

export async function loginWithEmail(formData: FormData) {
  if (!hasSupabaseEnv()) {
    redirect("/login?error=missing_supabase_env");
  }

  const email = String(formData.get("email") ?? "");
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${getBaseUrl()}/callback`,
    },
  });

  if (error) {
    redirect("/login?error=otp");
  }

  redirect("/login?sent=1");
}

export async function createLivingProfile(formData: FormData) {
  if (!hasSupabaseEnv()) {
    redirect("/dashboard?setup=missing_supabase_env");
  }

  const childName = String(formData.get("child_name") ?? "").trim();
  const ageValue = String(formData.get("age") ?? "").trim();
  const age = ageValue ? Number(ageValue) : null;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !childName) {
    redirect("/dashboard?setup=failed");
  }

  await supabase.from("LivingProfiles").insert({
    user_id: user.id,
    child_name: childName,
    age,
    visual_anchor: { palette: "hero-primary", source: "phase-1-setup" },
  });

  revalidatePath("/dashboard");
  redirect("/dashboard?setup=complete");
}

export async function signOut() {
  if (!hasSupabaseEnv()) {
    redirect("/login");
  }

  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/login");
}

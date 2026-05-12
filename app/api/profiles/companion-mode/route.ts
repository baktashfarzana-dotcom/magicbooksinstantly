import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type CompanionModeBody = {
  livingProfileId?: string;
  enabled?: boolean;
};

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function PATCH(request: Request) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return jsonError("Sign in before changing Companion Mode.", 401);
  }

  const body = await request.json().catch(() => null) as CompanionModeBody | null;
  const livingProfileId = body?.livingProfileId;

  if (!livingProfileId || typeof body?.enabled !== "boolean") {
    return jsonError("Missing livingProfileId or enabled.");
  }

  const { data, error } = await supabase
    .from("LivingProfiles")
    .update({ companion_mode_enabled: body.enabled })
    .eq("id", livingProfileId)
    .eq("user_id", user.id)
    .select("id, companion_mode_enabled")
    .single();

  if (error || !data) {
    return jsonError(error?.message ?? "Could not update Companion Mode.", 500);
  }

  return NextResponse.json({
    livingProfileId: data.id,
    enabled: data.companion_mode_enabled,
  });
}

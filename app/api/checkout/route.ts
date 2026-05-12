import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Sign in before checkout." }, { status: 401 });
  }

  const { plan = "family" } = await request.json().catch(() => ({ plan: "family" })) as { plan?: string };

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({
      mode: "mock-stripe-test",
      checkoutUrl: `/pricing?checkout=mock-${encodeURIComponent(plan)}`,
    });
  }

  return NextResponse.json({
    mode: "stripe-test-ready",
    checkoutUrl: `/pricing?checkout=stripe-test-${encodeURIComponent(plan)}`,
  });
}

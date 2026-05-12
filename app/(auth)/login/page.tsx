import Link from "next/link";
import { loginWithEmail, loginWithGoogle } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type LoginPageProps = {
  searchParams: Promise<{ error?: string; sent?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Parent Command Center</CardTitle>
        <p className="text-sm text-muted-foreground">Sign in to manage your family library.</p>
      </CardHeader>
      <CardContent>
        {params.error === "missing_supabase_env" ? (
          <div className="mb-4 rounded-lg border border-secondary bg-secondary/25 px-4 py-3 text-sm font-semibold text-secondary-foreground">
            Supabase credentials are not configured yet. Local UI preview is available; authentication unlocks after cloud setup.
          </div>
        ) : null}
        {params.sent ? (
          <div className="mb-4 rounded-lg border border-story-mint bg-story-mint/20 px-4 py-3 text-sm font-semibold text-command-ink">
            Check your email for the magic link.
          </div>
        ) : null}
        <form action={loginWithGoogle}>
          <Button className="w-full" variant="secondary" type="submit">
            Continue with Google
          </Button>
        </form>
        <div className="my-6 h-px bg-border" />
        <form action={loginWithEmail} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" autoComplete="email" required />
          </div>
          <Button className="w-full" type="submit">
            Send magic link
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          New here? <Link className="font-semibold text-primary" href="/signup">Create an account</Link>
        </p>
      </CardContent>
    </Card>
  );
}

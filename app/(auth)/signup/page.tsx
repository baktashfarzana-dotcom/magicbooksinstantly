import Link from "next/link";
import { loginWithEmail, loginWithGoogle } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignupPage() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Create your parent account</CardTitle>
        <p className="text-sm text-muted-foreground">Start with secure identity, then add the first child profile.</p>
      </CardHeader>
      <CardContent>
        <form action={loginWithGoogle}>
          <Button className="w-full" variant="secondary" type="submit">
            Sign up with Google
          </Button>
        </form>
        <div className="my-6 h-px bg-border" />
        <form action={loginWithEmail} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" autoComplete="email" required />
          </div>
          <Button className="w-full" type="submit">
            Send signup link
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account? <Link className="font-semibold text-primary" href="/login">Sign in</Link>
        </p>
      </CardContent>
    </Card>
  );
}

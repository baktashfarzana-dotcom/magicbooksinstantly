import Link from "next/link";
import { UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";

type Profile = {
  id: string;
  child_name: string;
  age: number | null;
};

export function ProfileSwitcher({ profiles }: { profiles: Profile[] }) {
  if (profiles.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-muted p-5">
        <p className="font-semibold">Quick Setup</p>
        <p className="mt-1 text-sm text-muted-foreground">Create the first LivingProfile to unlock the child gateway.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {profiles.map((profile) => (
        <Link
          className="rounded-lg border border-border bg-card p-4 transition hover:border-primary"
          href={`/child?profile=${profile.id}`}
          key={profile.id}
        >
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-lg bg-secondary text-secondary-foreground">
              <UserRound size={20} />
            </span>
            <div>
              <p className="font-semibold">{profile.child_name}</p>
              <p className="text-sm text-muted-foreground">{profile.age ? `${profile.age} years old` : "Age not set"}</p>
            </div>
          </div>
        </Link>
      ))}
      <Button variant="ghost" className="justify-start border border-dashed border-border">
        Add profile
      </Button>
    </div>
  );
}

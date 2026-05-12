create table if not exists public."VoiceProfiles" (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  label text not null default 'Parent voice',
  provider text not null default 'elevenlabs',
  provider_voice_id text not null,
  status text not null default 'ready'
    check (status in ('training', 'ready', 'failed')),
  training_script text not null,
  consent_confirmed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public."TreasuryBalances" (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  living_profile_id uuid not null references public."LivingProfiles"(id) on delete cascade,
  star_dust_total integer not null default 0 check (star_dust_total >= 0),
  reading_streak integer not null default 0 check (reading_streak >= 0),
  last_rewarded_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, living_profile_id)
);

create table if not exists public."ReadingAttempts" (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  living_profile_id uuid not null references public."LivingProfiles"(id) on delete cascade,
  story_id uuid references public."Stories"(id) on delete set null,
  page_number integer not null default 1 check (page_number between 1 and 20),
  target_text text not null,
  transcript text not null,
  accuracy_score integer not null default 0 check (accuracy_score between 0 and 100),
  completion_score integer not null default 0 check (completion_score between 0 and 100),
  status text not null default 'needs_practice'
    check (status in ('needs_practice', 'completed')),
  star_dust_awarded integer not null default 0 check (star_dust_awarded >= 0),
  assessment_provider text not null default 'mock-azure',
  created_at timestamptz not null default now()
);

create table if not exists public."WordAssessments" (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  reading_attempt_id uuid not null references public."ReadingAttempts"(id) on delete cascade,
  word_index integer not null check (word_index >= 0),
  expected_word text not null,
  spoken_word text,
  accuracy_score integer not null default 0 check (accuracy_score between 0 and 100),
  status text not null default 'missed'
    check (status in ('correct', 'close', 'missed')),
  created_at timestamptz not null default now(),
  unique (reading_attempt_id, word_index)
);

create table if not exists public."StarDustLedger" (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  living_profile_id uuid not null references public."LivingProfiles"(id) on delete cascade,
  reading_attempt_id uuid references public."ReadingAttempts"(id) on delete set null,
  delta integer not null,
  balance_after integer not null check (balance_after >= 0),
  reason text not null,
  created_at timestamptz not null default now()
);

create index if not exists voice_profiles_user_idx on public."VoiceProfiles" (user_id, created_at desc);
create index if not exists treasury_balances_user_idx on public."TreasuryBalances" (user_id, living_profile_id);
create index if not exists reading_attempts_user_profile_idx on public."ReadingAttempts" (user_id, living_profile_id, created_at desc);
create index if not exists word_assessments_attempt_idx on public."WordAssessments" (reading_attempt_id, word_index);
create index if not exists star_dust_ledger_user_profile_idx on public."StarDustLedger" (user_id, living_profile_id, created_at desc);

drop trigger if exists set_voice_profiles_updated_at on public."VoiceProfiles";
create trigger set_voice_profiles_updated_at
before update on public."VoiceProfiles"
for each row execute function private.set_updated_at();

drop trigger if exists set_treasury_balances_updated_at on public."TreasuryBalances";
create trigger set_treasury_balances_updated_at
before update on public."TreasuryBalances"
for each row execute function private.set_updated_at();

alter table public."VoiceProfiles" enable row level security;
alter table public."VoiceProfiles" force row level security;
alter table public."TreasuryBalances" enable row level security;
alter table public."TreasuryBalances" force row level security;
alter table public."ReadingAttempts" enable row level security;
alter table public."ReadingAttempts" force row level security;
alter table public."WordAssessments" enable row level security;
alter table public."WordAssessments" force row level security;
alter table public."StarDustLedger" enable row level security;
alter table public."StarDustLedger" force row level security;

revoke all on public."VoiceProfiles" from anon, authenticated;
revoke all on public."TreasuryBalances" from anon, authenticated;
revoke all on public."ReadingAttempts" from anon, authenticated;
revoke all on public."WordAssessments" from anon, authenticated;
revoke all on public."StarDustLedger" from anon, authenticated;

grant select, insert, update, delete on public."VoiceProfiles" to authenticated;
grant select, insert, update, delete on public."TreasuryBalances" to authenticated;
grant select, insert, update, delete on public."ReadingAttempts" to authenticated;
grant select, insert, update, delete on public."WordAssessments" to authenticated;
grant select, insert, update, delete on public."StarDustLedger" to authenticated;

drop policy if exists "VoiceProfiles own rows" on public."VoiceProfiles";
create policy "VoiceProfiles own rows"
on public."VoiceProfiles"
for all
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "TreasuryBalances own rows" on public."TreasuryBalances";
create policy "TreasuryBalances own rows"
on public."TreasuryBalances"
for all
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "ReadingAttempts own rows" on public."ReadingAttempts";
create policy "ReadingAttempts own rows"
on public."ReadingAttempts"
for all
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "WordAssessments own rows" on public."WordAssessments";
create policy "WordAssessments own rows"
on public."WordAssessments"
for all
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "StarDustLedger own rows" on public."StarDustLedger";
create policy "StarDustLedger own rows"
on public."StarDustLedger"
for all
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

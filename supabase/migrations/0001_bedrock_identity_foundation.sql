create schema if not exists private;

create extension if not exists pgcrypto;

create table if not exists public."Users" (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  email text,
  elevenlabs_voice_id text,
  subscription_status text not null default 'trial'
    check (subscription_status in ('trial', 'active', 'past_due', 'canceled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public."LivingProfiles" (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  child_name text not null check (char_length(child_name) between 1 and 80),
  age integer check (age is null or age between 1 and 14),
  visual_anchor jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists users_user_id_idx on public."Users" (user_id);
create index if not exists living_profiles_user_id_idx on public."LivingProfiles" (user_id);

create or replace function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_users_updated_at on public."Users";
create trigger set_users_updated_at
before update on public."Users"
for each row execute function private.set_updated_at();

drop trigger if exists set_living_profiles_updated_at on public."LivingProfiles";
create trigger set_living_profiles_updated_at
before update on public."LivingProfiles"
for each row execute function private.set_updated_at();

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public."Users" (user_id, email)
  values (new.id, new.email)
  on conflict (user_id) do update set email = excluded.email;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function private.handle_new_user();

alter table public."Users" enable row level security;
alter table public."Users" force row level security;
alter table public."LivingProfiles" enable row level security;
alter table public."LivingProfiles" force row level security;

revoke all on public."Users" from anon, authenticated;
revoke all on public."LivingProfiles" from anon, authenticated;
grant select, insert, update on public."Users" to authenticated;
grant select, insert, update, delete on public."LivingProfiles" to authenticated;

drop policy if exists "Users select own row" on public."Users";
create policy "Users select own row"
on public."Users"
for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Users insert own row" on public."Users";
create policy "Users insert own row"
on public."Users"
for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "Users update own row" on public."Users";
create policy "Users update own row"
on public."Users"
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "LivingProfiles select own rows" on public."LivingProfiles";
create policy "LivingProfiles select own rows"
on public."LivingProfiles"
for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "LivingProfiles insert own rows" on public."LivingProfiles";
create policy "LivingProfiles insert own rows"
on public."LivingProfiles"
for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "LivingProfiles update own rows" on public."LivingProfiles";
create policy "LivingProfiles update own rows"
on public."LivingProfiles"
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "LivingProfiles delete own rows" on public."LivingProfiles";
create policy "LivingProfiles delete own rows"
on public."LivingProfiles"
for delete
to authenticated
using ((select auth.uid()) = user_id);

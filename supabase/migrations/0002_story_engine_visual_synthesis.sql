create table if not exists public."Stories" (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  living_profile_id uuid not null references public."LivingProfiles"(id) on delete cascade,
  hurdle text not null check (char_length(hurdle) between 3 and 280),
  title text not null default 'Untitled Adventure',
  status text not null default 'baking'
    check (status in ('baking', 'ready', 'failed')),
  master_anchor_prompt text not null,
  story_json jsonb not null default '{}'::jsonb,
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public."Images" (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  story_id uuid not null references public."Stories"(id) on delete cascade,
  living_profile_id uuid not null references public."LivingProfiles"(id) on delete cascade,
  page_number integer not null check (page_number between 1 and 20),
  prompt text not null,
  consistency_anchor text not null,
  storage_bucket text not null default 'story-images',
  storage_path text not null,
  generation_provider text not null default 'local-storyboard',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (story_id, page_number)
);

create index if not exists stories_user_profile_idx
  on public."Stories" (user_id, living_profile_id, created_at desc);

create index if not exists images_story_page_idx
  on public."Images" (story_id, page_number);

drop trigger if exists set_stories_updated_at on public."Stories";
create trigger set_stories_updated_at
before update on public."Stories"
for each row execute function private.set_updated_at();

drop trigger if exists set_images_updated_at on public."Images";
create trigger set_images_updated_at
before update on public."Images"
for each row execute function private.set_updated_at();

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('story-images', 'story-images', false, 5242880, array['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'])
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

alter table public."Stories" enable row level security;
alter table public."Stories" force row level security;
alter table public."Images" enable row level security;
alter table public."Images" force row level security;

revoke all on public."Stories" from anon, authenticated;
revoke all on public."Images" from anon, authenticated;
grant select, insert, update, delete on public."Stories" to authenticated;
grant select, insert, update, delete on public."Images" to authenticated;

drop policy if exists "Stories select own rows" on public."Stories";
create policy "Stories select own rows"
on public."Stories"
for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Stories insert own rows" on public."Stories";
create policy "Stories insert own rows"
on public."Stories"
for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "Stories update own rows" on public."Stories";
create policy "Stories update own rows"
on public."Stories"
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "Stories delete own rows" on public."Stories";
create policy "Stories delete own rows"
on public."Stories"
for delete
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Images select own rows" on public."Images";
create policy "Images select own rows"
on public."Images"
for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Images insert own rows" on public."Images";
create policy "Images insert own rows"
on public."Images"
for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "Images update own rows" on public."Images";
create policy "Images update own rows"
on public."Images"
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "Images delete own rows" on public."Images";
create policy "Images delete own rows"
on public."Images"
for delete
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Story image objects select own folder" on storage.objects;
create policy "Story image objects select own folder"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'story-images'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

drop policy if exists "Story image objects insert own folder" on storage.objects;
create policy "Story image objects insert own folder"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'story-images'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

drop policy if exists "Story image objects update own folder" on storage.objects;
create policy "Story image objects update own folder"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'story-images'
  and (storage.foldername(name))[1] = (select auth.uid())::text
)
with check (
  bucket_id = 'story-images'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

drop policy if exists "Story image objects delete own folder" on storage.objects;
create policy "Story image objects delete own folder"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'story-images'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

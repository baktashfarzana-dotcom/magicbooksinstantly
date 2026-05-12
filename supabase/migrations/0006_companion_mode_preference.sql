alter table public."LivingProfiles"
  add column if not exists companion_mode_enabled boolean not null default true;

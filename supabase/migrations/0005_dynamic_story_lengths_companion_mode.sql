do $$
declare
  constraint_name text;
begin
  select conname
  into constraint_name
  from pg_constraint
  where conrelid = 'public."Images"'::regclass
    and contype = 'c'
    and pg_get_constraintdef(oid) ilike '%page_number%'
  limit 1;

  if constraint_name is not null then
    execute format('alter table public."Images" drop constraint %I', constraint_name);
  end if;
end $$;

alter table public."Images"
  add constraint images_page_number_range check (page_number between 1 and 30);

do $$
declare
  constraint_name text;
begin
  select conname
  into constraint_name
  from pg_constraint
  where conrelid = 'public."ReadingAttempts"'::regclass
    and contype = 'c'
    and pg_get_constraintdef(oid) ilike '%page_number%'
  limit 1;

  if constraint_name is not null then
    execute format('alter table public."ReadingAttempts" drop constraint %I', constraint_name);
  end if;
end $$;

alter table public."ReadingAttempts"
  add constraint reading_attempts_page_number_range check (page_number between 1 and 30);

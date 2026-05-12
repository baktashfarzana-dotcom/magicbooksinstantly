create extension if not exists pgcrypto;

do $$
declare
  parent_one_id uuid := '11111111-1111-4111-8111-111111111111';
  parent_two_id uuid := '22222222-2222-4222-8222-222222222222';
  parent_one_email text := 'phase2.parent.one@magicbooksinstantly.test';
  parent_two_email text := 'phase2.parent.two@magicbooksinstantly.test';
  test_password text := 'MagicBooksPhase2!2026';
begin
  insert into auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    confirmation_token,
    recovery_token,
    email_change_token_new,
    email_change,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    is_sso_user,
    is_anonymous
  )
  values
    (
      '00000000-0000-0000-0000-000000000000',
      parent_one_id,
      'authenticated',
      'authenticated',
      parent_one_email,
      crypt(test_password, gen_salt('bf', 10)),
      now(),
      '',
      '',
      '',
      '',
      '{"provider":"email","providers":["email"],"test_account":true}'::jsonb,
      jsonb_build_object('sub', parent_one_id::text, 'email', parent_one_email, 'email_verified', true, 'phone_verified', false, 'name', 'Phase 2 Parent One'),
      now(),
      now(),
      false,
      false
    ),
    (
      '00000000-0000-0000-0000-000000000000',
      parent_two_id,
      'authenticated',
      'authenticated',
      parent_two_email,
      crypt(test_password, gen_salt('bf', 10)),
      now(),
      '',
      '',
      '',
      '',
      '{"provider":"email","providers":["email"],"test_account":true}'::jsonb,
      jsonb_build_object('sub', parent_two_id::text, 'email', parent_two_email, 'email_verified', true, 'phone_verified', false, 'name', 'Phase 2 Parent Two'),
      now(),
      now(),
      false,
      false
    )
  on conflict (id) do update
  set encrypted_password = excluded.encrypted_password,
      email_confirmed_at = excluded.email_confirmed_at,
      confirmation_token = excluded.confirmation_token,
      recovery_token = excluded.recovery_token,
      email_change_token_new = excluded.email_change_token_new,
      email_change = excluded.email_change,
      raw_app_meta_data = excluded.raw_app_meta_data,
      raw_user_meta_data = excluded.raw_user_meta_data,
      updated_at = now();

  insert into auth.identities (
    provider_id,
    user_id,
    identity_data,
    provider,
    last_sign_in_at,
    created_at,
    updated_at
  )
  values
    (
      parent_one_id::text,
      parent_one_id,
      jsonb_build_object('sub', parent_one_id::text, 'email', parent_one_email, 'email_verified', true),
      'email',
      now(),
      now(),
      now()
    ),
    (
      parent_two_id::text,
      parent_two_id,
      jsonb_build_object('sub', parent_two_id::text, 'email', parent_two_email, 'email_verified', true),
      'email',
      now(),
      now(),
      now()
    )
  on conflict (provider, provider_id) do update
  set identity_data = excluded.identity_data,
      updated_at = now();
end $$;

insert into public."LivingProfiles" (user_id, child_name, age, visual_anchor)
values
  (
    '11111111-1111-4111-8111-111111111111',
    'Avery Phase',
    7,
    '{"hair":"curly dark brown bob","outfit":"blue hoodie with yellow star patch","palette":"hero-primary","test_profile":true}'::jsonb
  ),
  (
    '22222222-2222-4222-8222-222222222222',
    'Riley Phase',
    6,
    '{"hair":"short black curls","outfit":"mint jacket with coral buttons","palette":"story-mint","test_profile":true}'::jsonb
  )
on conflict do nothing;

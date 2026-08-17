-- Production additions for the NGO CMS.
-- Run after schema.sql.

alter table public.site_settings
  add column if not exists meta_description text,
  add column if not exists facebook_url text,
  add column if not exists instagram_url text,
  add column if not exists youtube_url text,
  add column if not exists linkedin_url text,
  add column if not exists contact_email text,
  add column if not exists contact_phone text,
  add column if not exists address text,
  add column if not exists map_url text;

create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  subject text,
  message text not null,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

alter table public.contacts enable row level security;

drop policy if exists "Anyone can submit contact forms" on public.contacts;
create policy "Anyone can submit contact forms"
on public.contacts for insert to anon, authenticated
with check (length(name) between 1 and 150 and length(email) between 3 and 320 and length(message) between 1 and 5000);

drop policy if exists "Admins can view contact forms" on public.contacts;
create policy "Admins can view contact forms"
on public.contacts for select to authenticated
using (exists (
  select 1 from public.profiles
  where id = auth.uid() and role in ('super_admin','admin','editor')
));

drop policy if exists "Admins can update contact forms" on public.contacts;
create policy "Admins can update contact forms"
on public.contacts for update to authenticated
using (exists (
  select 1 from public.profiles
  where id = auth.uid() and role in ('super_admin','admin','editor')
))
with check (exists (
  select 1 from public.profiles
  where id = auth.uid() and role in ('super_admin','admin','editor')
));

-- Prevent public users from reading volunteer/donation records.
-- Existing policies should be reviewed if your schema differs.

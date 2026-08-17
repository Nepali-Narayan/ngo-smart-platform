-- NGO Smart Platform database
-- Run this in Supabase SQL Editor.

create extension if not exists pgcrypto;

create type public.user_role as enum ('super_admin', 'admin', 'editor');

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role public.user_role not null default 'editor',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.pages (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text,
  featured_image text,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  seo_title text,
  seo_description text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.programs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  summary text,
  description text,
  image_url text,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  category text,
  summary text,
  description text,
  location text,
  start_date date,
  end_date date,
  budget numeric(14,2),
  featured_image text,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  impact_summary text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text,
  featured_image text,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  published_at timestamptz,
  author_id uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.media (
  id uuid primary key default gen_random_uuid(),
  file_name text not null,
  file_url text not null,
  mime_type text,
  alt_text text,
  uploaded_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);


create table if not exists public.volunteers (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text,
  interests text,
  message text,
  status text not null default 'new' check (status in ('new','contacted','approved','rejected')),
  created_at timestamptz not null default now()
);
create table if not exists public.publications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  type text not null,
  description text,
  cover_image text,
  file_url text,
  published_date date,
  status text not null default 'draft'
    check (status in ('draft', 'published', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.donations (
  id uuid primary key default gen_random_uuid(),
  donor_name text,
  donor_email text,
  amount numeric(14,2) not null,
  currency text not null default 'NPR',
  payment_method text,
  transaction_reference text,
  campaign text,
  status text not null default 'pending' check (status in ('pending','paid','failed','refunded')),
  created_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id boolean primary key default true,
  site_name text not null default 'NGO Smart Platform',
  tagline text,
  logo_url text,
  primary_color text not null default '#155EEF',
  secondary_color text not null default '#0B4DBB',
  accent_color text not null default '#F59E0B',
  default_language text not null default 'en',
  updated_at timestamptz not null default now()
);

insert into public.site_settings (id) values (true)
on conflict (id) do nothing;

-- Helper functions
create or replace function public.current_user_role()
returns public.user_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid()
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('super_admin','admin')
  )
$$;

-- Automatically create a profile for new Auth users.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- RLS
alter table public.profiles enable row level security;
alter table public.pages enable row level security;
alter table public.programs enable row level security;
alter table public.projects enable row level security;
alter table public.posts enable row level security;
alter table public.media enable row level security;
alter table public.volunteers enable row level security;
alter table public.donations enable row level security;
alter table public.site_settings enable row level security;

-- Public read access only for published content.
drop policy if exists "published pages are public" on public.pages;
create policy "published pages are public" on public.pages for select
using (status = 'published' or auth.uid() = created_by or public.is_admin());

drop policy if exists "published programs are public" on public.programs;
create policy "published programs are public" on public.programs for select
using (status = 'published' or public.is_admin());

drop policy if exists "published projects are public" on public.projects;
create policy "published projects are public" on public.projects for select
using (status = 'published' or public.is_admin());

drop policy if exists "published posts are public" on public.posts;
create policy "published posts are public" on public.posts for select
using (status = 'published' or public.is_admin());

drop policy if exists "public media read" on public.media;
create policy "public media read" on public.media for select
using (true);

-- Admin/editor management policies.
drop policy if exists "admin manage pages" on public.pages;
create policy "admin manage pages" on public.pages for all
using (public.current_user_role() in ('super_admin','admin','editor'))
with check (public.current_user_role() in ('super_admin','admin','editor'));

drop policy if exists "admin manage programs" on public.programs;
create policy "admin manage programs" on public.programs for all
using (public.current_user_role() in ('super_admin','admin','editor'))
with check (public.current_user_role() in ('super_admin','admin','editor'));

drop policy if exists "admin manage projects" on public.projects;
create policy "admin manage projects" on public.projects for all
using (public.current_user_role() in ('super_admin','admin','editor'))
with check (public.current_user_role() in ('super_admin','admin','editor'));

drop policy if exists "admin manage posts" on public.posts;
create policy "admin manage posts" on public.posts for all
using (public.current_user_role() in ('super_admin','admin','editor'))
with check (public.current_user_role() in ('super_admin','admin','editor'));

drop policy if exists "admin manage media" on public.media;
create policy "admin manage media" on public.media for all
using (public.current_user_role() in ('super_admin','admin','editor'))
with check (public.current_user_role() in ('super_admin','admin','editor'));

drop policy if exists "admin manage volunteers" on public.volunteers;
create policy "admin manage volunteers" on public.volunteers for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "admin manage donations" on public.donations;
create policy "admin manage donations" on public.donations for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "admin manage settings" on public.site_settings;
create policy "admin manage settings" on public.site_settings for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "users read own profile" on public.profiles;
create policy "users read own profile" on public.profiles for select
using (auth.uid() = id or public.is_admin());

drop policy if exists "super admins update roles" on public.profiles;
create policy "super admins update roles" on public.profiles for update
using (public.current_user_role() = 'super_admin')
with check (public.current_user_role() = 'super_admin');

-- Volunteer public submission.
drop policy if exists "public volunteer submission" on public.volunteers;
create policy "public volunteer submission" on public.volunteers for insert
with check (true);

-- Keep updated_at current.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare
  t text;
begin
  foreach t in array array['profiles','pages','programs','projects','posts','site_settings']
  loop
    execute format('drop trigger if exists set_updated_at on public.%I', t);
    execute format('create trigger set_updated_at before update on public.%I for each row execute procedure public.set_updated_at()', t);
  end loop;
end $$;

-- IMPORTANT: after creating the first Auth user, promote that user's profile:
-- update public.profiles set role = 'super_admin' where id = 'YOUR-AUTH-USER-UUID';

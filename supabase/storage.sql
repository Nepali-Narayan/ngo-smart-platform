-- NGO media storage bucket
-- Run after schema.sql in Supabase SQL Editor.

insert into storage.buckets (id, name, public)
values ('ngo-media', 'ngo-media', true)
on conflict (id) do update set public = true;

drop policy if exists "Public can view NGO media" on storage.objects;
create policy "Public can view NGO media"
on storage.objects for select
using (bucket_id = 'ngo-media');

drop policy if exists "Authenticated editors can upload NGO media" on storage.objects;
create policy "Authenticated editors can upload NGO media"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'ngo-media'
  and exists (
    select 1 from public.profiles
    where id = auth.uid()
      and role in ('super_admin','admin','editor')
  )
);

drop policy if exists "Authenticated editors can update NGO media" on storage.objects;
create policy "Authenticated editors can update NGO media"
on storage.objects for update to authenticated
using (
  bucket_id = 'ngo-media'
  and exists (
    select 1 from public.profiles
    where id = auth.uid()
      and role in ('super_admin','admin','editor')
  )
)
with check (
  bucket_id = 'ngo-media'
  and exists (
    select 1 from public.profiles
    where id = auth.uid()
      and role in ('super_admin','admin','editor')
  )
);

drop policy if exists "Authenticated editors can delete NGO media" on storage.objects;
create policy "Authenticated editors can delete NGO media"
on storage.objects for delete to authenticated
using (
  bucket_id = 'ngo-media'
  and exists (
    select 1 from public.profiles
    where id = auth.uid()
      and role in ('super_admin','admin','editor')
  )
);

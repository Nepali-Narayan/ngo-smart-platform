# Admin + Supabase setup

## 1. Create a Supabase project

Create a project in Supabase, then copy its Project URL and publishable/anon key.

## 2. Configure environment

Copy `.env.example` to `.env.local` and fill in:

- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

If your Supabase project exposes the older anon key, it can be used as `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

## 3. Create database

Open Supabase SQL Editor and run:

`supabase/schema.sql`

This creates:
- profiles
- pages
- programs
- projects
- posts
- media
- volunteers
- donations
- site_settings
- Row Level Security policies
- new-user profile trigger

## 4. Create first administrator

In Supabase Authentication, create a user with email/password.

Then copy that user's UUID and run:

```sql
update public.profiles
set role = 'super_admin'
where id = 'YOUR-AUTH-USER-UUID';
```

## 5. Run the app

```bash
npm install
npm run dev
```

Go to:

`http://localhost:3000/admin/login`

## Security notes

- Never expose a Supabase service-role key in browser code or `.env` variables prefixed with `NEXT_PUBLIC_`.
- The current admin route is protected by Supabase Auth and middleware.
- Database access is additionally protected by Row Level Security.
- Public users can submit volunteer records, but only admins can read/manage them.
- Donations are admin-managed; connect a payment provider through server-side routes/webhooks in the payment phase.

## Current phase

The dashboard and database are wired together. Section pages show live record counts and are ready for CRUD forms.

## Next phase

Add:
1. CRUD editors
2. Supabase Storage media uploads
3. Rich text editor
4. Nepali/English content fields
5. Role-aware navigation
6. Volunteer form
7. Donation gateway/webhooks
8. AI assistant and AI content tools

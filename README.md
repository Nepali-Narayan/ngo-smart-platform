# NGO Smart Platform

A reusable Next.js starter for an AI-ready NGO website.

## Included

- Responsive public homepage
- Mobile navigation
- Reusable theme variables
- Centralized site configuration
- Programs, projects, impact, stories and donation CTA sections
- SEO metadata
- Accessible navigation labels
- Ready for CMS, Supabase, AI, donation and admin modules

## Requirements

- Node.js 20+
- npm

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Customize branding

Edit:

`config/site.ts`

Change:

- `name`
- `shortName`
- `logoText`
- `tagline`
- navigation
- contact details
- social links
- theme colors

The CSS variables in `app/globals.css` are mapped to the theme values.

## Change homepage content

Edit:

`app/page.tsx`

The architecture is intentionally separated into components so future CMS data can replace the sample arrays.

## Next development phases

1. Supabase/PostgreSQL schema
2. Authentication and roles
3. Admin dashboard
4. CMS content management
5. Media library
6. Projects/programs CRUD
7. Blog/news
8. Volunteer management
9. Donation integrations
10. English/Nepali content model
11. AI chatbot and AI content tools
12. Analytics and reporting
13. Production deployment

## Admin + Supabase

The project now includes:
- Supabase browser/server clients
- Auth session middleware
- `/admin/login`
- Protected `/admin` dashboard
- Admin sidebar
- Database-backed record counts
- PostgreSQL schema with RLS
- Profiles and roles: `super_admin`, `admin`, `editor`
- Volunteer and donation tables
- Site settings table

See `docs/ADMIN-SETUP.md` for setup instructions.


## CRUD management

The admin dashboard now supports live create/read/update/delete flows for:
- Pages
- Programs
- Projects
- News & Blog
- Gallery media metadata
- Volunteers
- Donations
- Website settings

Forms use server actions and Supabase RLS. Image uploads are still intentionally separated into the next Storage module.


## Media Library Integration

Content editors can now select uploaded images from the Media Library when editing:
- Pages
- Programs
- Projects
- News & Blog

The public homepage reads published programs, projects, posts and site settings directly from Supabase, so published admin content can appear automatically.

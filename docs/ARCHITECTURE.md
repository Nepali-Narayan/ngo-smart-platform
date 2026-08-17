# Architecture

## Current
Next.js App Router -> reusable React components -> centralized configuration/theme.

## Planned
Next.js -> Supabase Auth -> PostgreSQL -> Storage
                  |
                  +-> Admin CMS
                  +-> Donations
                  +-> Volunteers
                  +-> Projects
                  +-> Reports
                  +-> AI services

The current homepage uses local sample data. The next phase can move these arrays into Supabase or a headless CMS without redesigning the public UI.

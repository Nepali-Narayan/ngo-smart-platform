# Production Deployment

## 1. Supabase
Run, in order:
1. `supabase/schema.sql`
2. `supabase/storage.sql`
3. `supabase/production.sql`

Check Row Level Security policies before going live.

## 2. Environment
Copy `.env.production.example` to the hosting provider's environment settings.

Required:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL`

Never expose service-role keys or payment secrets in browser code.

## 3. Deploy
Recommended flow:
- Push the project to GitHub.
- Import the repository into Vercel or another Next.js host.
- Add environment variables.
- Deploy.
- Set the production domain in `NEXT_PUBLIC_SITE_URL`.

## 4. DNS
Point your domain's DNS records to your hosting provider and enable HTTPS.

## 5. Email
The contact form currently stores messages in Supabase. For email notifications, connect a server-side provider such as Resend and send notifications from a protected server action/API route.

## 6. Payments
The donation page currently records a donation pledge. Do not treat it as a completed payment.
Before accepting money, implement and test the official eSewa/Khalti merchant callback/webhook flow and verify payment status server-side.

## 7. Analytics
Add a privacy-conscious analytics provider or Google Analytics through environment-controlled configuration. Do not put secrets in client-side code.

## 8. Security checklist
- Enable RLS on every user-data table.
- Use least-privilege admin roles.
- Keep payment/email secrets server-side.
- Validate uploaded files and size limits.
- Back up Supabase data.
- Configure custom domain + HTTPS.
- Test login, password reset, uploads, contact forms and admin permissions before launch.

# ChesState — Early-Access Landing Page

Waitlist site for investors plus a project-submission portal for entrepreneurs.
Next.js 14 (App Router) · TypeScript · Tailwind · Framer Motion · Supabase.

```bash
npm install
cp .env.example .env.local   # then fill in your Supabase keys
npm run dev                  # http://localhost:3000
npm run build
```

Keep the project in a path with no `!` in it. Webpack reserves that character for
loader syntax and refuses to build from such a directory.

## Supabase setup

1. Create a project at [supabase.com](https://supabase.com).
2. Copy `.env.example` to `.env.local` and fill in the three keys from
   **Project Settings → API**, plus `NEXT_PUBLIC_SITE_URL`.
3. Run `supabase/schema.sql` in the Supabase **SQL Editor**.
4. Under **Authentication → URL Configuration**, add `<site-url>/auth/callback`
   as a redirect URL so the entrepreneur confirmation email works.

Until the keys are present the site still runs: the investor form accepts
signups and logs that nothing was stored, and entrepreneur signup returns a
clear "not connected yet" message.

### Investors and entrepreneurs are kept apart

Two tables with no foreign key between them, so an address in one says nothing
about the other:

| | `investor_waitlist` | `entrepreneur_applications` |
|---|---|---|
| Account | none | real `auth.users` account |
| Holds | email, locale | email, locale, questionnaire answers |
| Written by | `/api/waitlist` (service role) | `/api/entrepreneurs` (service role) |
| Read access | service role only — RLS on, no policies | each user's own row only |

## Languages

English (default), Arabic, Spanish and French, all fully translated including
the FAQ. The choice is stored in the `chesstate_locale` cookie; the root layout
reads it server-side, picks one dictionary and sets `<html lang>` and `dir`, so
Arabic renders right-to-left with no flash on switch and the browser only ever
downloads the active language.

Copy lives in `lib/i18n/dictionaries/`. `en.ts` is the source of truth — add a
key there and TypeScript will flag the other three until they match.

> The Arabic, Spanish and French copy was written for this build and has not
> been reviewed by a native speaker or by counsel. The FAQ is regulatory
> disclosure text, so have it checked before launch.

## Structure

```
app/
  layout.tsx                      locale + fonts + per-language metadata
  page.tsx                        investor landing page
  entrepreneurs/page.tsx          questionnaire + account creation
  entrepreneurs/login/page.tsx
  entrepreneurs/dashboard/page.tsx
  auth/callback/route.ts          email-confirmation handler
  api/waitlist/route.ts           investors  → investor_waitlist
  api/entrepreneurs/route.ts      entrepreneurs → auth.users + applications
components/
  Navbar / Hero / TrustBar / HowItWorks / FaqAccordion / Footer
  LanguageSwitcher.tsx
  JoinListModal.tsx + WaitlistProvider.tsx
  entrepreneurs/                  EntrepreneurForm, FundingField, LoginForm, …
  ui/                             Button, Badge, Card, ProgressBar, Reveal, Logo
lib/
  i18n/                           config, dictionaries, server + client helpers
  supabase/                       browser, server and service-role clients
  uae-locations.ts                cities and districts for the location picker
middleware.ts                     refreshes the Supabase session cookie
supabase/schema.sql
```

## The entrepreneurs page

Runs the palette inverted — navy surface, cream ink — and collects:

- **Property type** — ten options, from residential apartment to land.
- **Funding required** — a number field and a draggable slider bound to one
  value, so typing moves the slider and dragging updates the number.
- **City and neighbourhood** — all seven emirates; the neighbourhood list
  follows the chosen city and stays disabled until one is picked.

Every questionnaire field is optional and labelled as such. Only the email and
password at the bottom are required, since they create the account. Passwords
are handled entirely by Supabase Auth — the app never stores or hashes one
itself.

## The platform

Where entrepreneurs land after signing in (`/platform`). It runs on the same
inverted navy palette as the signup page.

- **Overview** — status, the key figures, and a readiness checklist that links
  straight to whatever is still missing.
- **Project** — the full record investors would eventually see: name,
  description, property type, funding, asset value, timeline and location.
- **Milestones** — the escrow plan. Each milestone releases a percentage of the
  raise, and the editor blocks a total above 100%, since that would promise more
  than the raise contains.
- **Settings** — account email, language, password reset, sign out.

**Preview mode.** Without Supabase keys the platform renders sample content
behind an amber banner and disables saving, so the design can be reviewed before
any backend exists. Once the keys are in place it switches to real data and
redirects signed-out visitors to the login page.

`/entrepreneurs/dashboard` now redirects to `/platform`.

## Known gaps

- **Colors.** Only `navy` (`#0B1D33`) is confirmed. `cream`, `mint`, `muted` and
  `border` are estimates in `tailwind.config.ts`. `mint-ink` (`#1F6E5A`) is a
  darkened variant for places the accent is used as text on cream, where raw
  `mint` fails WCAG AA.
- **Fonts.** Fraunces + Inter are best-guess matches. Noto Sans/Naskh Arabic sit
  behind them and only render Arabic glyphs.
- **Logo.** `components/ui/Logo.tsx` is a monogram placeholder.
- **No submit-for-review step.** Status is stored but only ever `draft`; nothing
  moves a project to `in_review`, and there is no admin side to review it.
- **No document uploads.** Milestones describe what proves completion, but there
  is nowhere to attach the proof yet.
- **No investor-facing project pages.** The platform is entrepreneur-only.
- **Mobile nav** collapses to the language switcher plus the primary CTA; the
  three nav links remain reachable in the footer.

# Just Audit — Next.js + Payload CMS

Stack: Next.js 15 (App Router) · Payload CMS 3 (embedded) · PostgreSQL · next-intl (`/ru`, `/kz`) · Tailwind + shadcn/ui · Docker (Hoster.kz VPS) · Cloudflare (DNS/CDN)

## Project layout

```
src/
├── app/
│   ├── (frontend)/
│   │   └── [locale]/
│   │       ├── layout.tsx          ← wraps pages, renders <Navbar />
│   │       ├── page.tsx            ← homepage (sections w/ ids: #about, #services, etc.)
│   │       └── team/
│   │           └── page.tsx
│   ├── (payload)/                  ← don't touch, Payload-generated
│   └── data/                       ← whatever this currently is (Payload seed data?) — leaving alone
├── components/
│   ├── layout/
│   │   └── navbar.tsx              ← move from root components/layout/
│   └── ui/                         ← from shadcn init
├── data/
│   └── navigation.ts                ← new, kept separate from app/data to avoid clashing
├── i18n/
│   ├── request.ts                   ← next-intl server config
│   └── navigation.ts                 ← exports Link, usePathname, etc. (used by navbar.tsx)
├── lib/
│   └── utils.ts                     ← from shadcn init
├── messages/
│   ├── ru.json                       ← move from root messages/
│   └── kz.json
├── middleware.ts                     ← already exists, needs updating (see below)
├── collections/
├── globals/
└── payload.config.ts
```

Two route groups, two root layouts: `(frontend)` renders the public, localized
site; `(payload)` renders the CMS admin panel and API at `/admin` and `/api/*`
with no locale prefix. The middleware matcher explicitly skips `admin` and
`api` so Payload isn't pulled into locale routing.

## Local development

```bash
pnpm install
pnpm approve-builds   # for sharp / esbuild native binaries, same as the old Nuxt setup
cp .env.example .env  # fill in PAYLOAD_SECRET and DATABASE_URI

# start Postgres only, run Next.js locally for fast iteration
docker compose up -d postgres
pnpm dev
```

First run: visit `http://localhost:3000/admin` to create the first admin user.
Then add Services / TeamMembers / Certificates content — the homepage at
`/ru` and `/kz` reads them live via Payload's local API (no extra HTTP hop,
since Payload runs inside the same Next.js process).

After changing any collection/global field shape:

```bash
pnpm generate:types       # updates src/payload-types.ts
pnpm generate:importmap   # regenerates admin import map after adding custom admin components
```

## Production deploy (Hoster.kz VPS)

```bash
cp .env.example .env   # set real PAYLOAD_SECRET, POSTGRES_PASSWORD, NEXT_PUBLIC_SERVER_URL
docker compose up -d --build
```

This brings up three containers: `postgres`, `app` (Next.js + Payload,
standalone build), and `caddy` (automatic HTTPS + reverse proxy on 80/443).

**Cloudflare note:** if you turn on Cloudflare's orange-cloud proxy, set the
SSL/TLS mode to "Full (strict)" and either let Caddy issue its own
Let's Encrypt cert (default in the Caddyfile) or switch to Cloudflare's
Origin CA certificate on the VPS — don't run two automatic-HTTPS systems
fighting for port 443.

**Uploads:** `media`/`certificates`/`team-members` files currently land on
the `uploads` Docker volume (the VPS disk). To move to S3-compatible storage
later, add `@payloadcms/storage-s3` to `payload.config.ts` and drop the
`staticDir` line in `src/collections/Media.ts` — no schema changes needed,
existing file references stay valid as long as you migrate the actual files.

## Translations

`messages/ru.json` and `messages/kz.json` hold UI chrome strings (nav, CTAs,
footer). Content fields (service descriptions, team bios, hero text) are
localized directly in Payload via the `localized: true` field flag — editors
fill in both `ru` and `kz` versions per record in the admin panel, no
redeploy needed.

## What's stubbed vs. what's real

- Postgres, Payload config, all five collections + the SiteSettings global,
  the admin panel wiring, and the REST/GraphQL routes are fully wired.
- The homepage (`(frontend)/[locale]/page.tsx`) is a minimal placeholder
  that proves the data flow (Payload → Next.js → rendered page) — swap in
  the real Hero/About/Team/Approach/WhyUs/Contact sections from the Figma
  design next.
- shadcn/ui isn't pre-installed with components yet — run
  `npx shadcn@latest add button card` etc. as you build sections;
  `components.json` is already configured to drop them into `src/components/ui`.

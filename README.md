# Artrosefysio

Next.js (App Router) site for Artrosefysio, deployed on Netlify. Besides the
information pages it sells access to training videos: pay once with Stripe, get a
personal link that works for 6 months. No accounts, no passwords.

```bash
npm install
cp .env.example .env.local   # fill in values, see below
npm run dev                  # http://localhost:3000
npm test                     # unit tests (Node's built-in runner)
npm run typecheck && npm run lint
```

## Admin dashboard (`/admin`)

Log in with `ADMIN_PASSWORD`. From there you can:

- **Products:** see every video product with price, visibility, Cloudflare status and sales.
- **New product:** title, description, price in kr, and upload the video file. The file
  goes straight from the browser to Cloudflare Stream (resumable tus upload, no size
  limit from Netlify), and is created with *Require signed URLs* switched on.
- **Edit:** change title/description/price, hide/show in the shop, preview the video.
  Unsold products can be deleted (also deletes the Cloudflare video); sold products can
  only be hidden, so existing customers keep access.
- **Sales:** search by e-mail, copy a customer's link to resend it, extend access by
  another 6 months, jump to the payment in Stripe.

Admin sessions are an HMAC-signed, HttpOnly cookie valid for 12 hours. Changing
`ADMIN_PASSWORD` logs everyone out. Every admin page, Server Action and the upload
endpoint checks the session.

Full refunds made in Stripe revoke access automatically (`charge.refunded` webhook).

## Paid videos — how it works

```
Customer → /videoer → [Kjøp] → POST /api/checkout → Stripe Checkout
   → Stripe webhook POST /api/stripe/webhook  (verifies signature, payment_status = paid)
       → inserts purchase, generates random viewing token, expires_at = paid_at + 6 months
   → customer lands on /success?session_id=…  (verified against Stripe's API, then shows link)
   → /watch/<token>  (hash → lookup → paid? → not expired? → mint short-lived Cloudflare token → player)
```

Two different tokens are involved:

| | Customer viewing token | Cloudflare Stream token |
|---|---|---|
| Where | in the `/watch/…` URL | inside the player iframe URL |
| Made by | webhook, `crypto.randomBytes(32)` | `/watch` page, RS256 JWT signed server-side |
| Lifetime | 6 months, reusable | 2 hours (`STREAM_TOKEN_TTL_SECONDS`) |
| Stored | SHA-256 hash + AES-GCM encrypted copy | never |

Key files:

| File | Purpose |
|---|---|
| `lib/env.ts` | zod-validated server env vars |
| `lib/db.ts` | postgres.js client (parameterised queries only) |
| `lib/viewing-token.ts` | token generation / hashing / encryption |
| `lib/cloudflare-stream.ts` | signed playback tokens |
| `lib/access.ts` | pure paid/expired decision |
| `lib/videos.ts`, `lib/purchases.ts` | data access |
| `app/api/checkout/route.ts` | creates the Stripe Checkout Session |
| `app/api/stripe/webhook/route.ts` | records payments (authoritative) |
| `app/videoer/page.tsx`, `app/success/page.tsx`, `app/watch/[token]/page.tsx` | customer pages |
| `db/schema.sql`, `db/seed.example.sql` | database |
| `scripts/cloudflare-stream.mjs` | one-off Cloudflare setup helper |

## Configuration

### 1. Database (Supabase or any Postgres)

1. Create a project. In Supabase, open **SQL Editor**, paste `db/schema.sql`, run it.
2. Copy the connection string: **Project → Connect → Transaction pooler** (port 6543).
   Netlify functions are short-lived, so the pooler is the right choice; `lib/db.ts`
   already sets `prepare: false` for it.
3. Set `DATABASE_URL` to that string (with your password filled in).

The schema enables row-level security with no policies, so Supabase's auto REST
API cannot read the tables. The app connects directly with the Postgres role from
`DATABASE_URL`, which bypasses RLS.

**Free-plan pausing:** Supabase pauses free projects after 7 days without database
activity. `netlify/functions/keep-db-awake.mts` is a Netlify Scheduled Function that
runs a tiny read once a day to prevent that. Delete it if you upgrade to Supabase Pro.

### 2. Stripe

1. Stripe Dashboard → **Developers → API keys** → copy the **Secret key**
   (`sk_test_…` locally, `sk_live_…` on Netlify) → `STRIPE_SECRET_KEY`.
2. Prices are **not** configured in Stripe; they come from the `videos` table and are
   sent as `price_data` when the Checkout Session is created.
3. Set `SITE_URL` to the public URL of the site (e.g. `https://artrosefysio.no`). It is
   used for the Checkout success/cancel URLs and to build viewing links.

### 3. Stripe webhook

Production:

1. **Developers → Webhooks → Add endpoint**.
2. URL: `https://<your-site>/api/stripe/webhook`
3. Events: `checkout.session.completed`, `checkout.session.async_payment_succeeded`
   and `charge.refunded`.
4. Copy the **Signing secret** (`whsec_…`) → `STRIPE_WEBHOOK_SECRET`.

Local development:

```bash
stripe login
stripe listen --forward-to localhost:3000/api/stripe/webhook
# copy the printed whsec_… into .env.local as STRIPE_WEBHOOK_SECRET
stripe trigger checkout.session.completed   # or pay with card 4242 4242 4242 4242
```

The webhook is the only thing that creates purchases. The `/success` page merely
asks Stripe whether the session is paid and then waits (auto-refreshing) until the
webhook has stored the purchase, so a forged redirect URL cannot unlock anything.

### 4. Cloudflare Stream

1. Cloudflare Dashboard → **Stream** → upload your video. Copy its **UID**.
2. Create an **API token** with permission *Stream: Edit*
   (My Profile → API Tokens). Put it and your Account ID in `.env.local` as
   `CLOUDFLARE_API_TOKEN` / `CLOUDFLARE_ACCOUNT_ID`. These are used **only** by the
   setup script below; the website never needs them.
3. Create a signing key (prints the two values to set in Netlify):

   ```bash
   node scripts/cloudflare-stream.mjs create-key
   # → CLOUDFLARE_STREAM_SIGNING_KEY_ID=…
   # → CLOUDFLARE_STREAM_SIGNING_KEY_PEM=…   (base64 PEM, shown once — store it safely)
   ```

4. Require signed URLs for every video you sell (otherwise the raw UID is public):

   ```bash
   node scripts/cloudflare-stream.mjs require-signed <video-uid>
   node scripts/cloudflare-stream.mjs list     # check the "signed=yes" column
   ```

   You can also toggle **Require signed URLs** in the dashboard under the video's settings.

5. Find your customer code: Stream → any video → **Embed**; the URL contains
   `customer-<CODE>.cloudflarestream.com`. Set `CLOUDFLARE_STREAM_CUSTOMER_CODE=<CODE>`.

### 5. Netlify environment variables

Site configuration → **Environment variables** → add:

| Variable | Value |
|---|---|
| `SITE_URL` | `https://<your-domain>` (no trailing slash) |
| `DATABASE_URL` | Supabase transaction-pooler URI |
| `STRIPE_SECRET_KEY` | `sk_live_…` |
| `STRIPE_WEBHOOK_SECRET` | `whsec_…` from the production endpoint |
| `CLOUDFLARE_STREAM_CUSTOMER_CODE` | from the embed URL |
| `CLOUDFLARE_STREAM_SIGNING_KEY_ID` | from `create-key` |
| `CLOUDFLARE_STREAM_SIGNING_KEY_PEM` | from `create-key` (the long base64 string) |
| `VIEWING_TOKEN_ENCRYPTION_KEY` | `openssl rand -base64 32` |

| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account ID (admin uploads) |
| `CLOUDFLARE_API_TOKEN` | API token with *Stream: Edit* (admin uploads) |
| `ADMIN_PASSWORD` | long random passphrase for `/admin` |

`netlify.toml` is already set up for the Next.js runtime; route handlers become
serverless functions automatically. Do not change `VIEWING_TOKEN_ENCRYPTION_KEY`
after going live — existing links would still work (lookup is by hash) but the
`/success` page could no longer re-display them.

### 6. Adding a video / product

Use the admin dashboard: `/admin` → **Nytt produkt**. The manual way still works:

1. Upload to Cloudflare Stream, note the UID, run `require-signed <uid>`.
2. Insert a row (Supabase SQL editor), see `db/seed.example.sql`:

   ```sql
   insert into videos (title, description, cloudflare_video_uid, price, currency)
   values ('Hofteartrose — treningsprogram', 'Beskrivelse …', '<uid>', 29900, 'nok');
   ```

   `price` is in øre (29900 = 299 kr). It appears on `/videoer` immediately.
3. To stop selling a video without breaking existing purchases:
   `update videos set active = false where id = '…';`

## Test checklist

Automated (`npm test`): token entropy/format/hash/encryption, Cloudflare token
signing + expiry, paid/expired/invalid access decision, Stripe signature
verification (valid, wrong secret, tampered body, missing header, stale timestamp).

Manual, with Stripe test mode and `stripe listen` running:

| # | Scenario | Steps | Expected |
|---|---|---|---|
| 1 | Successful payment | `/videoer` → Kjøp → card `4242 4242 4242 4242` | `/success` shows link + "gyldig til" date 6 months out; one row in `purchases` |
| 2 | Failed payment | card `4000 0000 0000 0002` | Stays on Stripe with a decline; no `purchases` row; `/videoer` reachable via "back" |
| 3 | Webhook signature | `curl -X POST /api/stripe/webhook -d '{}'` | `400`, nothing written |
| 4 | Duplicate webhook | Stripe Dashboard → the event → **Resend** (or `stripe events resend <id>`) | `200`, still exactly one row, same token |
| 5 | Valid token | open the link from `/success` | video plays |
| 6 | Revisit | close browser, open the same link again later | video plays again |
| 7 | Invalid token | change one character in the link | "Videolenken er ikke gyldig." (no stack trace) |
| 8 | Expired token | `update purchases set expires_at = now() - interval '1 day' where …` | "Tilgangen til videoen har utløpt." |
| 9 | After 6 months | set `expires_at` to 6 months after `paid_at` and check with a clock just before/after | ok before, expired after |
| 10 | Cloudflare token | DevTools → iframe src | path contains a JWT (3 dot-separated parts), not the 32-hex UID; opening the raw UID at `customer-….cloudflarestream.com/<uid>/iframe` is refused |
| 11 | Unpaid session on success page | open `/success?session_id=<id of an abandoned session>` | "Betalingen er ikke fullført." |

## Security review notes

- Secrets live only in `lib/*` server modules marked `import "server-only"`; nothing
  secret is `NEXT_PUBLIC_`. The two client components (`CopyLinkButton`,
  `RefreshPoller`) receive only the finished link / nothing.
- Video access is via signed Cloudflare tokens only; the UID never reaches the browser.
- Viewing tokens are 256-bit CSPRNG, validated by shape before hashing; DB stores the
  hash and an AES-256-GCM copy under a separate key.
- Payment truth comes from the webhook (signature-verified, `payment_status === "paid"`);
  the success page additionally confirms with Stripe's API and never creates rows.
- Webhook idempotency: `stripe_checkout_session_id` is `UNIQUE` + `ON CONFLICT DO NOTHING`.
- All SQL uses postgres.js tagged templates (bound parameters); IDs are zod-validated.
- Expiry is enforced server-side on every request; refunded/unpaid statuses are refused.

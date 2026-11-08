-- Artrosefysio paid videos — database schema
-- Run once against your Postgres/Supabase database (SQL editor or psql).

create extension if not exists pgcrypto; -- for gen_random_uuid()

-- ---------------------------------------------------------------------------
-- videos: the products. One row per Cloudflare Stream video that can be bought.
-- ---------------------------------------------------------------------------
create table if not exists videos (
  id                    uuid primary key default gen_random_uuid(),
  title                 text        not null,
  description           text        not null default '',
  cloudflare_video_uid  text        not null unique,
  price                 integer     check (price > 0),               -- legacy per-video price (øre); unused
  currency              text        not null default 'nok' check (currency = lower(currency)),
  active                boolean     not null default true,
  created_at            timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- purchases: one row per successful Stripe Checkout. No customer accounts.
-- The raw viewing token is never stored: only its SHA-256 hash (for lookup)
-- and an AES-256-GCM encrypted copy (to re-show the link on the success page).
-- ---------------------------------------------------------------------------
create table if not exists purchases (
  id                          uuid primary key default gen_random_uuid(),
  video_id                    uuid        references videos(id),   -- only for older single-video purchases
  stripe_checkout_session_id  text        not null unique,   -- idempotency key for the webhook
  stripe_payment_intent_id    text,
  customer_email              text,                          -- from Stripe, for support / optional email
  amount_total                integer,                       -- what Stripe charged (øre)
  currency                    text,
  viewing_token_hash          text        not null unique,   -- sha256 hex of the token in the URL
  viewing_token_encrypted     text        not null,          -- base64(iv || tag || ciphertext)
  payment_status              text        not null check (payment_status in ('paid', 'refunded')),
  paid_at                     timestamptz not null,
  expires_at                  timestamptz not null,          -- paid_at + 6 months
  created_at                  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- video_package: the one product we sell — 6 months of access to all videos.
-- ---------------------------------------------------------------------------
create table if not exists video_package (
  id          integer     primary key default 1 check (id = 1),
  title       text        not null,
  description text        not null default '',
  price       integer     not null check (price > 0),             -- øre: 150000 = 1 500 kr
  currency    text        not null default 'nok' check (currency = lower(currency)),
  updated_at  timestamptz not null default now()
);
insert into video_package (id, title, description, price)
values (1, 'Videopakke — trening ved artrose',
        'Tilgang til alle treningsvideoene i 6 måneder. Tren hjemme når det passer deg.', 150000)
on conflict (id) do nothing;

create index if not exists purchases_video_id_idx on purchases (video_id);
create index if not exists purchases_payment_intent_idx on purchases (stripe_payment_intent_id);

-- ---------------------------------------------------------------------------
-- Lock the tables down. The app connects with the database owner / service
-- role via DATABASE_URL, so no API-level access is needed. If you use
-- Supabase, this also keeps the auto-generated REST API from exposing rows.
-- ---------------------------------------------------------------------------
alter table videos    enable row level security;
alter table purchases enable row level security;
alter table video_package enable row level security;

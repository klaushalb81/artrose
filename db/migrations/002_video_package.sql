-- 002: sell one package (all videos, 6 months) instead of individual videos.
-- Backwards compatible: existing rows and the previous code keep working.

create table if not exists video_package (
  id          integer     primary key default 1 check (id = 1),   -- exactly one row
  title       text        not null,
  description text        not null default '',
  price       integer     not null check (price > 0),             -- øre: 150000 = 1 500 kr
  currency    text        not null default 'nok' check (currency = lower(currency)),
  updated_at  timestamptz not null default now()
);
alter table video_package enable row level security;

insert into video_package (id, title, description, price)
values (
  1,
  'Videopakke — trening ved artrose',
  'Tilgang til alle treningsvideoene i 6 måneder. Tren hjemme når det passer deg.',
  150000
)
on conflict (id) do nothing;

-- Videos are now part of the package and no longer have their own price.
alter table videos alter column price drop not null;

-- Purchases buy the package, not one video. Keep video_id for older purchases.
alter table purchases alter column video_id drop not null;
alter table purchases add column if not exists amount_total integer;  -- what Stripe charged, øre
alter table purchases add column if not exists currency text;

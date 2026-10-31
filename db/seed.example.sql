-- Example: add a video/product.
-- 1. Upload the video to Cloudflare Stream and copy its UID (32 hex characters).
-- 2. Make sure "Require signed URLs" is ON for that video
--    (node scripts/cloudflare-stream.mjs require-signed <uid>).
-- 3. Insert a row. Price is in øre: 29900 = 299,00 kr.

insert into videos (title, description, cloudflare_video_uid, price, currency, active)
values (
  'Kneartrose — treningsprogram',
  'Et komplett øvelsesprogram for deg med kneartrose. Følg med på videoen og tren hjemme når det passer deg.',
  'REPLACE_WITH_CLOUDFLARE_STREAM_UID',
  29900,
  'nok',
  true
);

-- To hide a video from the shop without breaking existing purchases:
-- update videos set active = false where id = '...';

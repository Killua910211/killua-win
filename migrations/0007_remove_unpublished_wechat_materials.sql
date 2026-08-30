-- These entries came from the permanent-material library, not publication records.
DELETE FROM posts
WHERE slug IN (
  'wechat-jvm-class-loading',
  'wechat-a-cat-that-does-not-cling',
  'wechat-start-with-a-small-goal',
  'wechat-concrete',
  'wechat-almost-a-hero'
);

INSERT INTO site_settings (key, value)
VALUES ('database_version', '7')
ON CONFLICT(key) DO UPDATE SET
  value = excluded.value,
  updated_at = CURRENT_TIMESTAMP;

-- Keep source attribution in structured metadata instead of displaying it as body text.
UPDATE posts
SET content = TRIM(
  REPLACE(
    content,
    char(10) || char(10) || '图片：花瓣网' || char(10) || '文字：小猪',
    ''
  )
)
WHERE slug = 'wechat-going-astray';

UPDATE posts
SET content = TRIM(
  REPLACE(
    content,
    char(10) || char(10) || '资料来源' || char(10) || char(10) || '图片：花瓣网' || char(10) || '文字：百度百科、小猪',
    ''
  )
)
WHERE slug = 'wechat-han-yao-fu';

INSERT INTO site_settings (key, value)
VALUES ('database_version', '10')
ON CONFLICT(key) DO UPDATE SET
  value = excluded.value,
  updated_at = CURRENT_TIMESTAMP;

-- 更正《总有一只猫不会粘人》的历史发布时间年份。
-- 月日与原始归档记录保持一致，仅将错误的导入年份改为用户确认的 2022 年。
UPDATE posts
SET published_at = '2022-08-17T16:02:37.000Z',
    updated_at = CURRENT_TIMESTAMP
WHERE slug = 'wechat-cat-not-clingy';

INSERT INTO site_settings (key, value)
VALUES ('database_version', '15')
ON CONFLICT(key) DO UPDATE SET
  value = excluded.value,
  updated_at = CURRENT_TIMESTAMP;

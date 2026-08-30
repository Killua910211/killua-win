-- Imported from a QQ Space screenshot supplied and confirmed by the owner.
INSERT INTO posts (
  slug,
  title,
  excerpt,
  content,
  status,
  published_at,
  category,
  source,
  source_url,
  ai_summary
) VALUES (
  'qq-jump',
  '跳',
  '从窗台、花、街头到夜晚，反复地跳。',
  '窗台上跳
松软的泥土上跳
飘着香的鲜花上跳

跳跳跳

轻蔑下跳
熙攘的街头下跳
飘着落叶的树子下跳

跳跳

沉默里跳
寂静的夜晚里跳
挂着红酒的杯子里跳

跳',
  'published',
  '2016-09-05T14:06:00.000Z',
  '诗歌',
  'QQ空间「独行虫 / CHENKEXI」',
  NULL,
  '反复出现的“跳”让动作从轻快逐渐带上情绪：窗台、鲜花、街头与夜晚构成不断变换的舞台，最后只留下一个干净的“跳”，像一次不解释的自我驱动。'
)
ON CONFLICT(slug) DO UPDATE SET
  title = excluded.title,
  excerpt = excluded.excerpt,
  content = excluded.content,
  status = excluded.status,
  published_at = excluded.published_at,
  category = excluded.category,
  source = excluded.source,
  source_url = excluded.source_url,
  ai_summary = excluded.ai_summary,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_settings (key, value)
VALUES ('database_version', '11')
ON CONFLICT(key) DO UPDATE SET
  value = excluded.value,
  updated_at = CURRENT_TIMESTAMP;

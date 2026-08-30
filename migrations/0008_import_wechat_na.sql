-- Imported from the published WeChat article screenshot supplied by the owner.
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
  'wechat-na',
  '呐',
  '一则关于骨灰、桃树与怕鬼的短对话，用黑色幽默把死亡说得轻巧。',
  '呐

呐，如果我死了就把我的骨灰
埋在一棵树下

什么树

桃树吧，听说桃树辟邪？
我可怕鬼呢！

而且

桃子可好吃呐',
  'published',
  '2020-04-27T16:18:00.000Z',
  '短篇',
  '公众号「一意孤行的猪」',
  NULL,
  '用死亡、辟邪与桃子的反差消解沉重话题，是一则带黑色幽默和童真感的短篇对话。'
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
VALUES ('database_version', '8')
ON CONFLICT(key) DO UPDATE SET
  value = excluded.value,
  updated_at = CURRENT_TIMESTAMP;

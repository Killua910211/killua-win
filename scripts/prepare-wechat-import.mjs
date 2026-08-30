import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const INPUT_PATH = resolve('outputs/wechat-published.json');
const OUTPUT_PATH = resolve('migrations/0006_import_wechat_articles.sql');

const DUPLICATE_TITLES = new Set([
  '一个人需要多少心酸往事才能成长',
  '必须承认我很忧郁',
  '此人可谓之妙哉',
]);

const ARTICLE_DETAILS = new Map([
  [
    'JVM基础概念、类加载机制',
    {
      slug: 'wechat-jvm-class-loading',
      category: '技术',
      excerpt: '从 JVM 的基本组成出发，梳理类加载生命周期、双亲委派与代码执行方式。',
      summary:
        '这篇技术笔记从 JVM 规范、实现以及 JDK、JRE 的关系切入，重点梳理类加载的五个阶段、双亲委派及其打破场景，并对解释执行、即时编译和混合执行作了对照。它保留了学习时搭建知识骨架的过程，适合作为概念索引来阅读。',
    },
  ],
  [
    '总有一只猫不会粘人',
    {
      slug: 'wechat-a-cat-that-does-not-cling',
      category: '随笔',
      excerpt: 'Lucky 用第一人称讲述自己的粉红童年、捕鼠功绩和日渐下滑的家庭地位。',
      summary:
        '文章借 Lucky 的猫眼视角，把被收养、性别误认、捕鼠立功和家庭地位变化串成一篇轻喜剧。夸张的自尊与及时的退缩让这只猫很像人：嘴上拒绝成为“废猫”，面对窗外和楼道时，却仍选择熟悉而安全的生活。',
    },
  ],
  [
    '先定一个小目标，比如挣它一个亿',
    {
      slug: 'wechat-start-with-a-small-goal',
      category: '随笔',
      excerpt: '把宏大愿望拆成可以行动、衡量和按时完成的小目标。',
      summary:
        '文章把流行语重新解释成一套行动方法：方向可以很大，但迈出的台阶必须具体。SMART 原则提供了拆分目标的框架，游泳与骑车的例子则说明，完成一次可感知的进步，也能为漫长过程补充信心。',
    },
  ],
  [
    '混泥土',
    {
      slug: 'wechat-concrete',
      category: '随笔',
      excerpt: '一首借“水、泥与混凝土”玩双关的极短诗。',
      summary:
        '这首极短诗用“混泥土”制造文字错位：水与泥的物理混合，被悄悄转成喜欢一个人的亲密时刻。篇幅虽短，却在“那时我是水”的落点上完成了身份与情感的转换。',
    },
  ],
  [
    '几乎成了英雄',
    {
      slug: 'wechat-almost-a-hero',
      category: '随笔',
      excerpt: '一张奥特曼光盘，让一个普通人开始策划自己的英雄时刻。',
      summary:
        '文章用武侠和奥特曼的语气搭建英雄叙事，却把高潮落在一句轻声的咒骂和迅速离开上。宏大想象与怯懦行动之间的落差构成笑点，也写出了普通人渴望证明自己、又被现实胆量拉回原地的瞬间。',
    },
  ],
]);

const FOOTER_MARKERS = [
  '图片：',
  '图片:',
  '文字：',
  '文字:',
  'Different Version Of Myself',
  '欢迎大家分享至朋友圈',
  '长按二维码',
  '一意孤行的猪',
];

function cleanContent(content) {
  const paragraphs = content
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  if (paragraphs[0] === '点击蓝字关注我') {
    paragraphs.shift();
  }

  const footerIndex = paragraphs.findIndex((paragraph) =>
    FOOTER_MARKERS.some((marker) => paragraph.startsWith(marker)),
  );

  return (footerIndex === -1 ? paragraphs : paragraphs.slice(0, footerIndex)).join(
    '\n\n',
  );
}

function sql(value) {
  if (value === null || value === undefined) {
    return 'NULL';
  }

  return `'${String(value).replaceAll("'", "''")}'`;
}

function articleStatement(article, details) {
  const values = [
    details.slug,
    article.title,
    details.excerpt,
    cleanContent(article.content_text),
    'published',
    article.published_at,
    details.category,
    '微信公众号',
    article.source_url.replace(/^http:/, 'https:'),
    details.summary,
  ];

  return `INSERT INTO posts (
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
  ${values.map(sql).join(',\n  ')}
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
  updated_at = CURRENT_TIMESTAMP;`;
}

async function main() {
  const archive = JSON.parse(await readFile(INPUT_PATH, 'utf8'));
  const imported = [];
  const duplicates = [];

  for (const article of archive.articles ?? []) {
    if (DUPLICATE_TITLES.has(article.title)) {
      duplicates.push(article.title);
      continue;
    }

    const details = ARTICLE_DETAILS.get(article.title);
    if (!details) {
      throw new Error(`尚未审核文章：${article.title}`);
    }

    imported.push(articleStatement(article, details));
  }

  if (imported.length !== ARTICLE_DETAILS.size) {
    throw new Error(
      `预期导入 ${ARTICLE_DETAILS.size} 篇，实际生成 ${imported.length} 篇`,
    );
  }

  const migration = `-- Imported from the official WeChat permanent-material API.
-- Exact-title duplicates already present in the QQ archive were intentionally skipped.
ALTER TABLE posts ADD COLUMN category TEXT NOT NULL DEFAULT '随笔';

${imported.join('\n\n')}

INSERT INTO site_settings (key, value)
VALUES ('database_version', '6')
ON CONFLICT(key) DO UPDATE SET
  value = excluded.value,
  updated_at = CURRENT_TIMESTAMP;
`;

  await writeFile(OUTPUT_PATH, migration, 'utf8');
  console.log(`已生成 ${imported.length} 篇文章；跳过 ${duplicates.length} 篇重复文章。`);
  console.log(`重复：${duplicates.join('、')}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});

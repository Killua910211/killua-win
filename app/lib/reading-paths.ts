/**
 * 人工挑选的主题阅读路径。
 *
 * 和分类/年份不同，这是几条手工连起来的线索：同一个主题在不同年份被
 * 反复写过，串起来读比单独一篇更有意思。slug 必须对应 static-posts.ts
 * 里真实存在的文章 —— 不在这里发明新文章，也不做标签系统，只是一份
 * 手动维护的清单。想加一条新路径，照着现有结构加一个对象即可。
 */
export interface ReadingPath {
  id: string;
  title: string;
  /** 一句话说明这几篇文章为什么该放在一起读。 */
  connection: string;
  /** 按建议的阅读顺序排列，真实 slug。 */
  slugs: readonly string[];
}

export const READING_PATHS: readonly ReadingPath[] = [
  {
    id: 'loneliness-revisited',
    title: '孤独，被重新讲述了四次',
    connection:
      '同一个问题——如何与孤独相处——在 2011、2013、2014、2025 年被反复重写，每次都站在不同的位置回头看。',
    slugs: [
      'talking-with-jitou-town',
      'qq-1373953433',
      'qq-1402588027',
      'loneliness-is-not-a-misunderstanding',
    ],
  },
  {
    id: 'hero-to-responsibility',
    title: '从想当英雄，到愿意负责',
    connection:
      '英雄幻想、原地重复的冲动、对命运与"存在即合理"的理解，最终落回一份对家人具体的责任——五篇文章记录了这条路。',
    slugs: [
      'qq-almost-a-hero',
      'qq-jump',
      'wechat-han-yao-fu',
      'qq-1480836477',
      'qq-1706977003',
    ],
  },
  {
    id: 'small-things-big-feelings',
    title: '拿一只蚊子、一只猫说大事',
    connection:
      '蚊子、拔火罐、饥饿、生死对话、不粘人的猫——借一个小小的载体，把分工、死亡、身份和价值感一次次讲清楚。',
    slugs: [
      'qq-1324106738',
      'what-i-think-about-when-cupping',
      'wechat-hunger',
      'wechat-na',
      'wechat-cat-not-clingy',
    ],
  },
];

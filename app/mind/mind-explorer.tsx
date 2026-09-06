'use client';

import { useMemo, useState } from 'react';

type Topic = {
  id: string;
  label: string;
  short: string;
  title: string;
  thesis: string;
  detail: string;
  signals: string[];
  practice: string;
  color: string;
};

const topics: Topic[] = [
  {
    id: 'control',
    label: '控制与不确定性',
    short: 'CONTROL',
    title: '控制能力很强，但接受「不可控」的能力没那么强。',
    thesis: '你习惯把模糊问题结构化，把结构量化，再通过比较和执行获得确定感。',
    detail: '这套机制在工作、健康管理和风险决策里是优势；但爱情、亲密关系、孤独与意义没有稳定的最优解。当同一套系统被带进这些领域，标准会变成挑剔，分析会变成过度审视，寻找答案也可能变成迟迟不开始经历。',
    signals: ['发现问题 → 分析 → 建模 → 比较 → 找最优解 → 执行', '面对关系时，会本能地寻找风险、变量和确定答案', '最难接受的不是负面结论，而是没有逻辑的评价'],
    practice: '遇到无法优化的问题，先问：「我现在需要的是更多信息，还是一次真实经历？」',
    color: 'lime',
  },
  {
    id: 'sensitivity',
    label: '敏感与理性化',
    short: 'SENSITIVITY',
    title: '你可能比自己表现出来的更敏感。',
    thesis: '高敏感度与高理性压制并存：你会把情绪拿到分析桌上，而不是直接被情绪带走。',
    detail: '你对别人态度的变化、关系里的距离感、身体细微变化、审美差异和话里的潜台词有较高感知力。元认知让你能准确描述发生了什么，但「理解情绪」不等于「消化情绪」——知道原因，不代表状态已经改变。',
    signals: ['直接、冷静的表达，常常是保护层而不是低敏感', '会追问「为什么会这样」「属于什么阶段」「我会不会崩溃」', '分析很清楚时，情绪仍可能没有被真正安放'],
    practice: '先给情绪一个名字，再决定要不要解释它；允许「我现在就是难受」成为完整的信息。',
    color: 'blue',
  },
  {
    id: 'relationships',
    label: '关系与进入门槛',
    short: 'RELATIONSHIPS',
    title: '你渴望被理解，但外部人格也有一种「不容易进入感」。',
    thesis: '深层关系需求其实很高，只是对人的筛选标准也高，对依赖和失控的接受度偏低。',
    detail: '你希望对方有智力、表达、人格、审美和自己的世界，同时情绪不能太麻烦，还要能理解你的复杂性。这里有一个关系悖论：你在筛选别人，别人也在筛选你；你期待别人进入内在世界，但别人首先接触到的可能是理性、判断力、标准和距离感。',
    signals: ['普通社交满足度偏低，深层连接需求偏高', '容易觉得「很难遇到真正能交流的人」', '更容易展现判断力，而不是展现需要、脆弱和邀请'],
    practice: '在评估对方之前，主动暴露一点真实的需要：让关系有机会从「筛选」进入「互相靠近」。',
    color: 'warm',
  },
  {
    id: 'meaning',
    label: '能力与意义',
    short: 'MEANING',
    title: '你的能力系统跑得比意义系统快。',
    thesis: '旧的人生驱动力正在边际递减，新的驱动力还没有完全建立。',
    detail: '你已经比较擅长解决工作、团队、钱、身体、消费、技术和风险问题。这些是生存与控制问题。于是问题从「我怎么才能过得更好？」升级为「什么才算过得好？」这不一定是出了问题，也可能是人生课题进入了下一层。',
    signals: ['赚钱、能力、职位、消费和证明自己的奖励越来越不够用', '外部生活可以正常运转，内部却出现「也就这样」', '对爱情、婚姻、孤独、哲学和意义的兴趣变强'],
    practice: '不要急着为意义找一个漂亮答案；先建立值得重复的投入、连接和经历。',
    color: 'violet',
  },
  {
    id: 'curiosity',
    label: '好奇心与保护因素',
    short: 'CURIOSITY',
    title: '你还没有失去对世界的兴趣。',
    thesis: '好奇心是重要的保护因素，也是把旧系统带向新意义的入口。',
    detail: '从技术、健康、运动、营养、摄影到宇宙、哲学、爱情与日本社会，看似分散的兴趣说明你仍然在向世界伸出触角。你不是看透人生以后觉得无聊，而是正在经历驱动力换挡：旧的方式不够用了，新的方式正在形成。',
    signals: ['愿意持续追问，并且接受不舒服但有逻辑的结论', '能跨越具体问题，观察自己的长期模式', '现实能力、执行力、自省能力和好奇心构成了不错的基础盘'],
    practice: '把好奇心从「理解更多」带到「参与更多」：每周安排一件不以优化和产出为目的的事。',
    color: 'soft',
  },
];

const reviewCards = [
  { prompt: '我最容易把什么问题当成工程问题？', answer: '爱情、婚姻、孤独、意义，以及任何没有标准答案的人生问题。' },
  { prompt: '理解情绪，等于消化情绪吗？', answer: '不等于。解释能带来距离，但情绪还需要被感受、表达和经历。' },
  { prompt: '当前最大的长期风险是什么？', answer: '不是失败，而是外部生活正常，内部却逐渐觉得「什么都没什么意思」。' },
  { prompt: '现在更重要的问题发生了什么变化？', answer: '从「怎么过得更好」变成「什么才算过得好」。' },
];

export function MindExplorer() {
  const [activeId, setActiveId] = useState('control');
  const [revealed, setRevealed] = useState<number[]>([]);
  const [query, setQuery] = useState('');

  const activeTopic = topics.find((topic) => topic.id === activeId) ?? topics[0];
  const filteredTopics = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return topics;
    return topics.filter((topic) => `${topic.label} ${topic.title} ${topic.detail} ${topic.short}`.toLowerCase().includes(normalized));
  }, [query]);

  function toggleReview(index: number) {
    setRevealed((current) => current.includes(index) ? current.filter((item) => item !== index) : [...current, index]);
  }

  return (
    <>
      <section className="mind-overview" aria-labelledby="mind-overview-heading">
        <div className="section-label">
          <span>02</span>
          <span>Reading map</span>
        </div>
        <div>
          <p className="eyebrow">A compressed view / 压缩后的核心判断</p>
          <h2 id="mind-overview-heading">不是「问题很多」，而是两道核心课题在不同场景里的投影。</h2>
          <div className="mind-core-grid">
            <article>
              <span className="mind-card-index">01 / CONTROL</span>
              <h3>把不可控的部分，重新交还给生活。</h3>
              <p>高控制、高反思、强现实感，是能力的正面；它的背面是很难容忍模糊、等待和没有最优解。</p>
            </article>
            <article>
              <span className="mind-card-index">02 / MEANING</span>
              <h3>让意义系统追上能力系统。</h3>
              <p>你已经很擅长得到想要的东西，新的问题开始变成：得到以后，什么值得继续投入？</p>
            </article>
          </div>
        </div>
      </section>

      <section className="mind-workspace" aria-labelledby="mind-workspace-heading">
        <div className="section-label light">
          <span>03</span>
          <span>Explore by theme</span>
        </div>
        <div className="mind-workspace-body">
          <div className="mind-workspace-heading">
            <div>
              <p className="eyebrow">Topic index / 主题索引</p>
              <h2 id="mind-workspace-heading">沿着一条线索，回到当时的判断。</h2>
            </div>
            <label className="mind-search">
              <span className="sr-only">搜索主题</span>
              <span aria-hidden="true">⌕</span>
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索主题" />
            </label>
          </div>

          <div className="mind-topic-layout">
            <nav className="mind-topic-nav" aria-label="心理认知主题">
              {filteredTopics.map((topic, index) => (
                <button className={activeId === topic.id ? 'is-active' : ''} key={topic.id} onClick={() => setActiveId(topic.id)} type="button">
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <strong>{topic.label}</strong>
                  <em>{topic.short}</em>
                </button>
              ))}
              {filteredTopics.length === 0 ? <p className="mind-empty">没有匹配的主题。</p> : null}
            </nav>

            <article className={`mind-detail mind-detail-${activeTopic.color}`}>
              <div className="mind-detail-topline">
                <span>{activeTopic.short}</span>
                <span>Observation / 观察</span>
              </div>
              <h3>{activeTopic.title}</h3>
              <p className="mind-thesis">{activeTopic.thesis}</p>
              <div className="mind-detail-columns">
                <div>
                  <span className="mind-subhead">How it appears / 表现</span>
                  <p>{activeTopic.detail}</p>
                </div>
                <div>
                  <span className="mind-subhead">Signals / 识别信号</span>
                  <ul>
                    {activeTopic.signals.map((signal) => <li key={signal}>{signal}</li>)}
                  </ul>
                </div>
              </div>
              <div className="mind-practice">
                <span className="mind-subhead">Try this / 复习时带走</span>
                <p>{activeTopic.practice}</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="mind-review" aria-labelledby="mind-review-heading">
        <div className="section-label">
          <span>04</span>
          <span>Review loop</span>
        </div>
        <div className="mind-review-body">
          <p className="eyebrow">Recall / 主动回忆</p>
          <h2 id="mind-review-heading">先自己回答，再打开当时的结论。</h2>
          <p className="mind-review-intro">把复习从重新阅读，变成一次小型的自我提问。答案来自这次对话的压缩整理。</p>
          <div className="mind-review-grid">
            {reviewCards.map((card, index) => {
              const isOpen = revealed.includes(index);
              return (
                <button className={`mind-review-card ${isOpen ? 'is-open' : ''}`} key={card.prompt} onClick={() => toggleReview(index)} type="button" aria-expanded={isOpen}>
                  <span className="mind-review-number">{String(index + 1).padStart(2, '0')}</span>
                  <strong>{card.prompt}</strong>
                  <span className="mind-review-answer">{isOpen ? card.answer : '点击揭示结论 ↗'}</span>
                </button>
              );
            })}
          </div>
          <div className="mind-closing-note">
            <span className="mind-card-index">ONE SENTENCE</span>
            <p>你不是一个不知道自己要什么的人；你已经很擅长得到想要的东西。真正的问题开始变成——得到以后呢？</p>
          </div>
        </div>
      </section>
    </>
  );
}

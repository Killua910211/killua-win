'use client';

import { useRef, useState, type KeyboardEvent } from 'react';
import styles from './mind.module.css';

type Topic = {
  id: string;
  label: string;
  short: string;
  title: string;
  protectedPhrase: string;
  thesis: string;
  detail: string;
  signals: string[];
  practice: string;
};

const topics: Topic[] = [
  {
    id: 'control',
    label: '控制与不确定性',
    short: 'CONTROL',
    title: '控制能力很强，但接受「不可控」的能力没那么强。',
    protectedPhrase: '「不可控」',
    thesis: '你习惯把模糊问题结构化，把结构量化，再通过比较和执行获得确定感。',
    detail: '这套机制在工作、健康管理和风险决策里是优势；但爱情、亲密关系、孤独与意义没有稳定的最优解。当同一套系统被带进这些领域，标准会变成挑剔，分析会变成过度审视，寻找答案也可能变成迟迟不开始经历。',
    signals: ['发现问题 → 分析 → 建模 → 比较 → 找最优解 → 执行', '面对关系时，会本能地寻找风险、变量和确定答案', '最难接受的不是负面结论，而是没有逻辑的评价'],
    practice: '遇到无法优化的问题，先问：「我现在需要的是更多信息，还是一次真实经历？」',
  },
  {
    id: 'sensitivity',
    label: '敏感与理性化',
    short: 'SENSITIVITY',
    title: '你可能比自己表现出来的更敏感。',
    protectedPhrase: '更敏感',
    thesis: '高敏感度与高理性压制并存：你会把情绪拿到分析桌上，而不是直接被情绪带走。',
    detail: '你对别人态度的变化、关系里的距离感、身体细微变化、审美差异和话里的潜台词有较高感知力。元认知让你能准确描述发生了什么，但「理解情绪」不等于「消化情绪」——知道原因，不代表状态已经改变。',
    signals: ['直接、冷静的表达，常常是保护层而不是低敏感', '会追问「为什么会这样」「属于什么阶段」「我会不会崩溃」', '分析很清楚时，情绪仍可能没有被真正安放'],
    practice: '先给情绪一个名字，再决定要不要解释它；允许「我现在就是难受」成为完整的信息。',
  },
  {
    id: 'relationships',
    label: '关系与进入门槛',
    short: 'RELATIONSHIPS',
    title: '你渴望被理解，但外部人格也有一种「不容易进入感」。',
    protectedPhrase: '「不容易进入感」',
    thesis: '深层关系需求其实很高，只是对人的筛选标准也高，对依赖和失控的接受度偏低。',
    detail: '你希望对方有智力、表达、人格、审美和自己的世界，同时情绪不能太麻烦，还要能理解你的复杂性。这里有一个关系悖论：你在筛选别人，别人也在筛选你；你期待别人进入内在世界，但别人首先接触到的可能是理性、判断力、标准和距离感。',
    signals: ['普通社交满足度偏低，深层连接需求偏高', '容易觉得「很难遇到真正能交流的人」', '更容易展现判断力，而不是展现需要、脆弱和邀请'],
    practice: '在评估对方之前，主动暴露一点真实的需要：让关系有机会从「筛选」进入「互相靠近」。',
  },
  {
    id: 'meaning',
    label: '能力与意义',
    short: 'MEANING',
    title: '你的能力系统跑得比意义系统快。',
    protectedPhrase: '意义系统',
    thesis: '旧的人生驱动力正在边际递减，新的驱动力还没有完全建立。',
    detail: '你已经比较擅长解决工作、团队、钱、身体、消费、技术和风险问题。这些是生存与控制问题。于是问题从「我怎么才能过得更好？」升级为「什么才算过得好？」这不一定是出了问题，也可能是人生课题进入了下一层。',
    signals: ['赚钱、能力、职位、消费和证明自己的奖励越来越不够用', '外部生活可以正常运转，内部却出现「也就这样」', '对爱情、婚姻、孤独、哲学和意义的兴趣变强'],
    practice: '不要急着为意义找一个漂亮答案；先建立值得重复的投入、连接和经历。',
  },
  {
    id: 'curiosity',
    label: '好奇心与保护因素',
    short: 'CURIOSITY',
    title: '你还没有失去对世界的兴趣。',
    protectedPhrase: '对世界的兴趣',
    thesis: '好奇心是重要的保护因素，也是把旧系统带向新意义的入口。',
    detail: '从技术、健康、运动、营养、摄影到宇宙、哲学、爱情与日本社会，看似分散的兴趣说明你仍然在向世界伸出触角。你不是看透人生以后觉得无聊，而是正在经历驱动力换挡：旧的方式不够用了，新的方式正在形成。',
    signals: ['愿意持续追问，并且接受不舒服但有逻辑的结论', '能跨越具体问题，观察自己的长期模式', '现实能力、执行力、自省能力和好奇心构成了不错的基础盘'],
    practice: '把好奇心从「理解更多」带到「参与更多」：每周安排一件不以优化和产出为目的的事。',
  },
];

function titleWithProtectedPhrase(text: string, phrase: string) {
  const [before, after] = text.split(phrase);
  return <>{before}<span className="type-keep">{phrase}</span>{after}</>;
}

/**
 * 主题切换是这一页唯一的客户端交互，按 WAI-ARIA 的 tab 模式实现。
 *
 * 之前是一排普通按钮：靠 `is-active` 这个 class 表示选中，读屏软件读到的
 * 只是五个同样的按钮，既不知道哪一个是当前项，也不知道右边那块内容归谁。
 * 现在 tab 与面板互相指认，方向键在标签之间移动（roving tabindex），
 * 五个面板都渲染出来，非当前项用 hidden 收起——内容仍留在 DOM 里，
 * 页内查找和搜索引擎都还能拿到。
 */
export function MindTopics() {
  const [activeId, setActiveId] = useState(topics[0].id);
  const tabRefs = useRef(new Map<string, HTMLButtonElement>());

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const last = topics.length - 1;
    const target =
      event.key === 'ArrowDown' || event.key === 'ArrowRight' ? (index === last ? 0 : index + 1)
      : event.key === 'ArrowUp' || event.key === 'ArrowLeft' ? (index === 0 ? last : index - 1)
      : event.key === 'Home' ? 0
      : event.key === 'End' ? last
      : null;

    if (target === null) return;

    event.preventDefault();
    const next = topics[target];
    setActiveId(next.id);
    tabRefs.current.get(next.id)?.focus();
  }

  return (
    <section className="mind-workspace" id="mind-workspace" aria-labelledby="mind-workspace-heading">
      <div className="section-label light">
        <span>03</span>
        <span lang="en">Explore by theme</span>
      </div>
      <div className="mind-workspace-body">
        <div className="mind-workspace-heading">
          <p className="eyebrow">Topic index / 主题索引</p>
          <h2 id="mind-workspace-heading">沿着一条线索，回到当时的判断。</h2>
        </div>

        <div className="mind-topic-layout">
          <div className="mind-topic-nav" role="tablist" aria-label="心理认知主题" aria-orientation="vertical">
            {topics.map((topic, index) => {
              const isActive = topic.id === activeId;

              return (
                <button
                  aria-controls={`mind-panel-${topic.id}`}
                  aria-selected={isActive}
                  id={`mind-tab-${topic.id}`}
                  key={topic.id}
                  onClick={() => setActiveId(topic.id)}
                  onKeyDown={(event) => handleKeyDown(event, index)}
                  ref={(node) => {
                    if (node) tabRefs.current.set(topic.id, node);
                    else tabRefs.current.delete(topic.id);
                  }}
                  role="tab"
                  tabIndex={isActive ? 0 : -1}
                  type="button"
                >
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <strong>{topic.label}</strong>
                  <em lang="en">{topic.short}</em>
                </button>
              );
            })}
          </div>

          {topics.map((topic) => (
            <article
              aria-labelledby={`mind-tab-${topic.id}`}
              className={`mind-detail ${styles.detail}`}
              hidden={topic.id !== activeId}
              id={`mind-panel-${topic.id}`}
              key={topic.id}
              role="tabpanel"
              tabIndex={0}
            >
              <div className="mind-detail-topline">
                <span lang="en">{topic.short}</span>
                <span>Observation / 观察</span>
              </div>
              <h3>{titleWithProtectedPhrase(topic.title, topic.protectedPhrase)}</h3>
              <p className="mind-thesis">{topic.thesis}</p>
              <div className="mind-detail-columns">
                <div>
                  <span className="mind-subhead">How it appears / 表现</span>
                  <p>{topic.detail}</p>
                </div>
                <div>
                  <span className="mind-subhead">Signals / 识别信号</span>
                  <ul>
                    {topic.signals.map((signal) => <li key={signal}>{signal}</li>)}
                  </ul>
                </div>
              </div>
              <div className="mind-practice">
                <span className="mind-subhead">Try this / 复习时带走</span>
                <p>{topic.practice}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

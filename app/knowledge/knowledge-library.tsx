'use client';

import { useMemo, useState } from 'react';

type KnowledgeCard = {
  id: string;
  category: string;
  tag: string;
  title: string;
  idea: string;
  takeaway: string;
  source: string;
  tone: 'lime' | 'blue' | 'warm' | 'violet' | 'soft';
};

const categories = ['全部', '心理认知', '哲学与生活', '健康与身体', '工作与 AI'];

const cards: KnowledgeCard[] = [
  {
    id: 'emotion',
    category: '心理认知',
    tag: 'MIND / 01',
    title: '理解情绪，不等于消化情绪。',
    idea: '一个人可以很清楚地解释自己为什么难受，但解释本身并不会自动完成情绪的消化。',
    takeaway: '先命名，再感受；不要把“我已经想明白了”误认为“我已经走出来了”。',
    source: '人格结构分析：控制感、敏感度与意义感',
    tone: 'lime',
  },
  {
    id: 'control',
    category: '心理认知',
    tag: 'MIND / 02',
    title: '不要把人生中没有标准答案的部分，当成工程问题。',
    idea: '分析、建模、比较和执行，可以解决很多现实问题；但爱情、亲密、孤独与意义，往往需要先经历，答案才会出现。',
    takeaway: '遇到卡住的问题时，问自己：我缺的是更多信息，还是一次真实经历？',
    source: '人格结构分析：控制感、敏感度与意义感',
    tone: 'blue',
  },
  {
    id: 'meaning',
    category: '心理认知',
    tag: 'MIND / 03',
    title: '旧的奖励变得不够用，不一定意味着生活变差。',
    idea: '当赚钱、能力、职位、消费和证明自己越来越容易获得，过去有效的驱动力会出现边际递减。',
    takeaway: '问题会从“怎样过得更好”升级成“什么才算过得好”。',
    source: '人格结构分析：控制感、敏感度与意义感',
    tone: 'violet',
  },
  {
    id: 'curiosity',
    category: '心理认知',
    tag: 'MIND / 04',
    title: '好奇心，是驱动力换挡时的重要保护因素。',
    idea: '对技术、健康、哲学、关系和世界持续提问，说明旧的动力可能正在退场，但对世界的兴趣还在。',
    takeaway: '把“理解更多”往前推一步，安排一些不以优化和产出为目的的参与。',
    source: '人格结构分析：控制感、敏感度与意义感',
    tone: 'soft',
  },
  {
    id: 'pain-boredom',
    category: '哲学与生活',
    tag: 'PHILOSOPHY / 01',
    title: '欲望没有满足时是痛苦，满足之后可能是无聊。',
    idea: '这不是“快乐不存在”，而是提醒人：满足一个欲望，通常只会让新的欲望有机会出现。',
    takeaway: '可以把无聊看作一个信号：当前的刺激已经完成任务，接下来需要重新选择投入的方向。',
    source: '关于叔本华、痛苦与无聊的对话',
    tone: 'warm',
  },
  {
    id: 'body-data',
    category: '健康与身体',
    tag: 'HEALTH / 01',
    title: '健康记录的价值，不只在于一个漂亮的数字。',
    idea: '单次读数容易制造焦虑，连续记录才能把偶然波动放回趋势里，帮助判断真正发生了什么。',
    takeaway: '看健康数据时，同时看时间窗口、覆盖天数和变化趋势，不要只看某一天的结果。',
    source: 'Apple Health 长期记录与健康页面整理',
    tone: 'blue',
  },
  {
    id: 'prompt-loop',
    category: '工作与 AI',
    tag: 'AI / 01',
    title: '高质量对话，来自持续校准，而不是一次完美提问。',
    idea: '先让 AI 产出一个可讨论的版本，再补充背景、指出偏差、收紧目标，通常比一开始追求万能提示词更有效。',
    takeaway: '把对话当成一个反馈循环：提出 → 检查 → 修正 → 再输出。',
    source: '个人 AI 辅助工作与开发流程记录',
    tone: 'lime',
  },
  {
    id: 'decision',
    category: '工作与 AI',
    tag: 'METHOD / 01',
    title: '比较的目的，是让决策更清楚，不是让不确定性归零。',
    idea: '列出选项、风险和权重可以提高判断质量，但世界不会因此变成完全可预测的系统。',
    takeaway: '为决策设一个停止条件：信息已经足够支持行动，就把剩下的不确定性留给执行。',
    source: '长期决策与方案比较对话',
    tone: 'soft',
  },
];

export function KnowledgeLibrary() {
  const [activeCategory, setActiveCategory] = useState('全部');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(cards[0].id);

  const visibleCards = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return cards.filter((card) => {
      const matchesCategory = activeCategory === '全部' || card.category === activeCategory;
      const matchesQuery = !normalized || `${card.title} ${card.idea} ${card.takeaway} ${card.source} ${card.tag}`.toLowerCase().includes(normalized);
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, query]);

  const selectedCard = visibleCards.find((card) => card.id === selectedId) ?? visibleCards[0];

  return (
    <>
      <section className="knowledge-index" aria-labelledby="knowledge-index-heading">
        <div className="section-label">
          <span>05</span>
          <span>Card index</span>
        </div>
        <div className="knowledge-index-body">
          <div className="knowledge-index-heading">
            <div>
              <p className="eyebrow">Distilled notes / 提炼后的卡片</p>
              <h2 id="knowledge-index-heading">把对话中的好东西，放进一个可以回来找的地方。</h2>
            </div>
            <label className="knowledge-search">
              <span className="sr-only">搜索知识点</span>
              <span aria-hidden="true">⌕</span>
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索知识点" />
            </label>
          </div>
          <nav className="knowledge-categories" aria-label="知识点分类">
            {categories.map((category) => (
              <button className={activeCategory === category ? 'is-active' : ''} key={category} onClick={() => setActiveCategory(category)} type="button">
                {category}
                {category !== '全部' ? <span>{cards.filter((card) => card.category === category).length}</span> : <span>{cards.length}</span>}
              </button>
            ))}
          </nav>
          <div className="knowledge-library-layout">
            <div className="knowledge-card-grid">
              {visibleCards.map((card, index) => (
                <button className={`knowledge-card knowledge-card-${card.tone} ${selectedCard?.id === card.id ? 'is-selected' : ''}`} key={card.id} onClick={() => setSelectedId(card.id)} type="button" aria-pressed={selectedCard?.id === card.id}>
                  <span className="knowledge-card-topline"><span>{String(index + 1).padStart(2, '0')}</span><span>{card.tag}</span></span>
                  <strong>{card.title}</strong>
                  <span className="knowledge-card-source">{card.category} · {card.source}</span>
                </button>
              ))}
              {visibleCards.length === 0 ? <p className="knowledge-empty">没有找到匹配的知识点。</p> : null}
            </div>
            {selectedCard ? (
              <article className="knowledge-detail" aria-live="polite">
                <div className="knowledge-detail-topline"><span>{selectedCard.tag}</span><span>Selected card</span></div>
                <h3>{selectedCard.title}</h3>
                <p className="knowledge-idea">{selectedCard.idea}</p>
                <div className="knowledge-takeaway">
                  <span className="knowledge-subhead">Takeaway / 带走</span>
                  <p>{selectedCard.takeaway}</p>
                </div>
                <div className="knowledge-source">
                  <span className="knowledge-subhead">Source / 来源</span>
                  <p>{selectedCard.source}</p>
                </div>
              </article>
            ) : null}
          </div>
        </div>
      </section>
      <section className="knowledge-method" aria-labelledby="knowledge-method-heading">
        <div className="section-label light">
          <span>06</span>
          <span>How to keep it useful</span>
        </div>
        <div>
          <p className="eyebrow">A living archive / 让它继续生长</p>
          <h2 id="knowledge-method-heading">每一张卡片，都应该能在下一次对话或下一次决定里派上用场。</h2>
          <div className="knowledge-method-grid">
            <div><span>01</span><p>提炼</p><small>从长对话里留下一个真正可复述的判断。</small></div>
            <div><span>02</span><p>验证</p><small>区分事实、推论和只适用于当下的个人观察。</small></div>
            <div><span>03</span><p>调用</p><small>在新的问题里使用它，再回来修正这张卡片。</small></div>
          </div>
        </div>
      </section>
    </>
  );
}

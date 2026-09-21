type KnowledgeCard = {
  id: string;
  category: string;
  tag: string;
  title: string;
  idea: string;
  takeaway: string;
  source: string;
};

/*
 * 这一层只收「人格结构分析」以外的对话。那场对话已经在本页按主题展开、又做过一遍
 * 主动回忆；再放一组同源卡片，只会让同样几句结论在同一页里出现第三遍。
 *
 * 四张卡片全文直出，不再是「点一张、右边换一张」：一共四条，藏起三条既省不了
 * 版面，又让页内查找和搜索引擎只能看到当前选中的那一条。
 */
const cards: KnowledgeCard[] = [
  {
    id: 'pain-boredom',
    category: '哲学与生活',
    tag: 'Philosophy / 01',
    title: '欲望没有满足时是痛苦，满足之后可能是无聊。',
    idea: '这不是“快乐不存在”，而是提醒人：满足一个欲望，通常只会让新的欲望有机会出现。',
    takeaway: '可以把无聊看作一个信号：当前的刺激已经完成任务，接下来需要重新选择投入的方向。',
    source: '关于叔本华、痛苦与无聊的对话',
  },
  {
    id: 'body-data',
    category: '健康与身体',
    tag: 'Health / 01',
    title: '健康记录的价值，不只在于一个漂亮的数字。',
    idea: '单次读数容易制造焦虑，连续记录才能把偶然波动放回趋势里，帮助判断真正发生了什么。',
    takeaway: '看健康数据时，同时看时间窗口、覆盖天数和变化趋势，不要只看某一天的结果。',
    source: 'Apple Health 长期记录与健康页面整理',
  },
  {
    id: 'prompt-loop',
    category: '工作与 AI',
    tag: 'AI / 01',
    title: '高质量对话，来自持续校准，而不是一次完美提问。',
    idea: '先让 AI 产出一个可讨论的版本，再补充背景、指出偏差、收紧目标，通常比一开始追求万能提示词更有效。',
    takeaway: '把对话当成一个反馈循环：提出 → 检查 → 修正 → 再输出。',
    source: '个人 AI 辅助工作与开发流程记录',
  },
  {
    id: 'decision',
    category: '工作与 AI',
    tag: 'Method / 01',
    title: '比较的目的，是让决策更清楚，不是让不确定性归零。',
    idea: '列出选项、风险和权重可以提高判断质量，但世界不会因此变成完全可预测的系统。',
    takeaway: '为决策设一个停止条件：信息已经足够支持行动，就把剩下的不确定性留给执行。',
    source: '长期决策与方案比较对话',
  },
];

export function KnowledgeLibrary() {
  return (
    <>
      <section className="knowledge-index" id="mind-library" aria-labelledby="knowledge-index-heading">
        <div className="section-label">
          <span>05</span>
          <span lang="en">Card index</span>
        </div>
        <div className="knowledge-index-body">
          <div className="knowledge-index-heading">
            <p className="eyebrow">Distilled notes / 提炼后的卡片</p>
            <h2 id="knowledge-index-heading">把其它对话里的好东西，放进一个可以回来找的地方。</h2>
            <p className="knowledge-index-intro">
              心理认知那场对话已经在 <a href="#mind-workspace">主题线索</a> 和 <a href="#mind-review">自我复习</a> 里展开，这里不再复述它的结论，只留下别的对话带出来的判断。
            </p>
          </div>
          <ol className="knowledge-card-grid">
            {cards.map((card, index) => (
              <li className="knowledge-card" key={card.id}>
                <span className="knowledge-card-topline">
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <span lang="en">{card.tag}</span>
                </span>
                <h3>{card.title}</h3>
                <p className="knowledge-idea">{card.idea}</p>
                <div className="knowledge-takeaway">
                  <span className="knowledge-subhead">Takeaway / 带走</span>
                  <p>{card.takeaway}</p>
                </div>
                <p className="knowledge-card-source">{card.category} · {card.source}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section className="knowledge-method" aria-labelledby="knowledge-method-heading">
        <div className="section-label light">
          <span>06</span>
          <span lang="en">How to keep it useful</span>
        </div>
        <div>
          <p className="eyebrow">A living archive / 让它继续生长</p>
          <h2 id="knowledge-method-heading">
            每一张卡片，都应该能在<span className="type-keep">下一次对话</span>或<span className="type-keep">下一次决定</span>里派上用场。
          </h2>
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

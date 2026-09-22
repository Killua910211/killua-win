import { SiteFooter } from '@/app/components/site-footer';
import { SiteHeader } from '@/app/components/site-header';
import { SectionNav } from '@/app/components/section-nav';
import { PageHero } from '@/app/components/page-hero';
import { buildMetadata } from '@/app/lib/metadata';
import { KnowledgeLibrary } from '@/app/knowledge/knowledge-library';
import { MindTopics } from './mind-topics';
import styles from './mind.module.css';

export const metadata = buildMetadata({
  title: 'Mind',
  description: '将控制、不确定性、关系、意义、身体记录与持续行动整理成可回看的个人认知地图。',
  path: '/mind',
});

/**
 * 04 区的自我复习卡：问题在外面，答案折起来。
 *
 * 这一区写着「先自己回答，再回看当时的结论」，而答案原本就印在问题下面，
 * 主动回忆根本没有发生的机会。答案改成 details，展开与否由读者决定。
 */
const reviewCards = [
  { prompt: '我是在收集必要信息，还是在延迟一次经历？', answer: '当问题没有唯一解时，继续分析不一定会带来更多确定感；给一次小规模的真实尝试设定边界，也是一种验证。' },
  { prompt: '我能把这件事先说成一个可观察的事实吗？', answer: '把“我就是这样”拆成时间、行为和结果，先记录发生了什么，再决定要不要为它命名。' },
  { prompt: '这段关系里，我有没有只做筛选而没有发出邀请？', answer: '标准可以保护边界，但关系也需要被看见的需要、一次具体的邀请，以及允许对方逐步靠近的空间。' },
  { prompt: '我愿意连续投入哪件不必立刻产出结果的事？', answer: '意义不必先被解释清楚；先选择一件愿意重复参与的事，再观察它是否慢慢形成方向。' },
];

export default function MindPage() {
  return (
    <>
      <SiteHeader current="mind" />
      <main id="main" className="mind-page">
        <PageHero
          description="把关于控制、不确定性、关系、意义、身体记录与持续行动的对话，整理成一张可回看的认知地图。这里记录的是观察、提问与复盘，不是诊断。"
          eyebrow="Mind / 心理认知"
          label="Cognitive notebook"
          number="01"
          title={<>UNDERSTAND<br />THE <span className="outline">INNER</span><br />SYSTEM.</>}
          titleId="mind-title"
        />
        <SectionNav
          label="认知页分区"
          items={[
            { href: '#mind-overview', label: '核心地图' },
            { href: '#mind-workspace', label: '主题线索' },
            { href: '#mind-review', label: '自我复习' },
            { href: '#mind-practice', label: '生活验证' },
            { href: '#mind-library', label: '卡片索引' },
          ]}
        />

        <section className="mind-overview" id="mind-overview" aria-labelledby="mind-overview-heading">
          <div className="section-label">
            <span>02</span>
            <span lang="en">Reading map</span>
          </div>
          <div>
            <p className="eyebrow">A compressed view / 压缩后的核心判断</p>
            <h2 id="mind-overview-heading">
              先看<span className="type-keep">两条主线</span>，再回到具体场景。
            </h2>
            <div className={`mind-core-grid ${styles.coreGrid}`}>
              <article>
                <span className="mind-card-index" lang="en">01 / CONTROL</span>
                <h3>把确定感交给结构，也留出经历的空间。</h3>
                <p>结构、记录和比较能提高判断质量；它们不必替每一个没有标准答案的问题做决定。</p>
              </article>
              <article>
                <span className="mind-card-index" lang="en">02 / MEANING</span>
                <h3>从解决问题，走向选择投入什么。</h3>
                <p>能力回答“怎么做”，意义更像一个持续选择：什么值得重复、连接和承担。</p>
              </article>
            </div>
          </div>
        </section>

        <MindTopics />

        <section className="mind-review" id="mind-review" aria-labelledby="mind-review-heading">
          <div className="section-label">
            <span>04</span>
            <span lang="en">Review loop</span>
          </div>
          <div className="mind-review-body">
            <p className="eyebrow">Recall / 主动回忆</p>
            <h2 id="mind-review-heading">先自己回答，再展开当时的结论。</h2>
            <p className="mind-review-intro">复习不是重新给自己下结论，而是用一个问题检查旧判断是否仍然适用：答案折在问题下面，想好了再展开对照。</p>
            <ol className={`mind-review-grid ${styles.reviewGrid}`}>
              {reviewCards.map((card, index) => (
                <li className={`mind-review-card ${styles.reviewCard}`} key={card.prompt}>
                  <span className="mind-review-number">{String(index + 1).padStart(2, '0')}</span>
                  <details className="mind-review-details">
                    <summary>
                      <strong>{card.prompt}</strong>
                    </summary>
                    <p className="mind-review-answer">{card.answer}</p>
                  </details>
                </li>
              ))}
            </ol>
            <div className="mind-closing-note">
              <span className="mind-card-index" lang="en">One sentence</span>
              <p>你已经很擅长把问题想清楚；下一步，是把足够清楚的部分交给行动。</p>
            </div>
          </div>
        </section>

        <section className={styles.validation} id="mind-practice" aria-labelledby="mind-practice-heading">
          <div className="section-label light">
            <span>05</span>
            <span lang="en">From map to practice</span>
          </div>
          <div className={styles.validationBody}>
            <p className="eyebrow">Small experiments / 小型验证</p>
            <h2 id="mind-practice-heading">让认知回到生活里，而不是停在结论里。</h2>
            <p className={styles.validationLead}>
              这页的判断只有在下一次选择里被使用，才算真正属于我。用足够小、可以回看的行动，检验一条想法是否值得保留。
            </p>
            <div className={styles.validationGrid}>
              <article>
                <span>01 / EVIDENCE</span>
                <h3>让记录变成提醒，而不是判决。</h3>
                <p>把身体和生活记录放回长期趋势里，用来提醒下一步，不用一个单点给当下贴标签。</p>
              </article>
              <article>
                <span>02 / EXPERIMENT</span>
                <h3>把选择变成一段小步试验。</h3>
                <p>为新的关系、兴趣或工作方式设置低成本尝试和回看时间，让行动提供下一轮判断需要的证据。</p>
              </article>
              <article>
                <span>03 / CONTACT</span>
                <h3>把理解推进到参与。</h3>
                <p>每周保留一件不以优化和产出为目的的事，让好奇心有机会遇到真实的人和真实的场景。</p>
              </article>
              <article>
                <span>04 / REVISION</span>
                <h3>只保留能被调用的判断。</h3>
                <p>把结果留成一段能回看的文字，新的经历出现后回来修正；不要把旧结论变成固定身份。</p>
              </article>
            </div>
          </div>
        </section>

        <KnowledgeLibrary />
      </main>
      <SiteFooter />
    </>
  );
}

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
  description: '把与 ChatGPT 的心理认知对话，整理成可以预习、复习和回溯的个人认知档案。',
  path: '/mind',
});

/**
 * 04 区的自我复习卡：问题在外面，答案折起来。
 *
 * 这一区写着「先自己回答，再回看当时的结论」，而答案原本就印在问题下面，
 * 主动回忆根本没有发生的机会。答案改成 details，展开与否由读者决定。
 */
const reviewCards = [
  { prompt: '我最容易把什么问题当成工程问题？', answer: '爱情、婚姻、孤独、意义，以及任何没有标准答案的人生问题。' },
  { prompt: '理解情绪，等于消化情绪吗？', answer: '不等于。解释能带来距离，但情绪还需要被感受、表达和经历。' },
  { prompt: '当前最大的长期风险是什么？', answer: '不是失败，而是外部生活正常，内部却逐渐觉得「什么都没什么意思」。' },
  { prompt: '现在更重要的问题发生了什么变化？', answer: '从「怎么过得更好」变成「什么才算过得好」。' },
];

export default function MindPage() {
  return (
    <>
      <SiteHeader current="mind" />
      <main id="main" className="mind-page">
        <PageHero
          description="整理关于「我是什么样的人」的对话，留下一张可回看的认知地图。下面各区里的「你」，是对话里 AI 对我的称呼。"
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
              不是「问题很多」，而是<span className="type-keep">两道核心课题</span>在不同场景里的投影。
            </h2>
            <div className={`mind-core-grid ${styles.coreGrid}`}>
              <article>
                <span className="mind-card-index" lang="en">01 / CONTROL</span>
                <h3>把不可控的部分，重新交还给生活。</h3>
                <p>高控制、高反思、强现实感，是能力的正面；它的背面是很难容忍模糊、等待和没有最优解。</p>
              </article>
              <article>
                <span className="mind-card-index" lang="en">02 / MEANING</span>
                <h3>让意义系统追上能力系统。</h3>
                <p>能力这一侧已经跑在前面；意义这一侧还没有建立新的标准，暂时答不出什么值得长期投入。</p>
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
            <p className="mind-review-intro">把复习从重新阅读，变成一次小型的自我提问：答案折在问题下面，想好了再展开对照。</p>
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
              <p>你不是一个不知道自己要什么的人；你已经很擅长得到想要的东西。真正的问题开始变成——得到以后呢？</p>
            </div>
          </div>
        </section>

        <KnowledgeLibrary />
      </main>
      <SiteFooter />
    </>
  );
}

import Image from 'next/image';
import { SiteFooter } from '@/app/components/site-footer';
import { SiteHeader } from '@/app/components/site-header';
import { buildMetadata } from '@/app/lib/metadata';

export const metadata = buildMetadata({
  title: 'Lab',
  description: 'AI 图像、视觉试验与不断变化的个人 Top 榜单。',
  path: '/lab',
});

const IMAGE_STUDIES = [
  {
    number: '001',
    title: 'Synthetic Bloom',
    subtitle: '合成花期',
    src: '/lab/synthetic-bloom.jpg',
    alt: '黑色植物在透明玻璃立方体中生长，背景带有荧光绿色技术网格',
    note: '把自然物放进不自然的容器里。玻璃、黑色植物与信号绿共同制造一件不存在的标本。',
    prompt: 'BOTANICAL SPECIMEN / GLASS CUBE / ACID LIME',
  },
  {
    number: '002',
    title: 'Iteration Stair',
    subtitle: '迭代阶梯',
    src: '/lab/iteration-stair.jpg',
    alt: '无限折叠的混凝土楼梯围绕一个荧光绿色门洞',
    note: '每一次迭代都像走上一层，但真正的出口也许一直在画面的中心。',
    prompt: 'ENDLESS STAIR / FOG / SIGNAL DOOR',
  },
  {
    number: '003',
    title: 'Orbital Silence',
    subtitle: '轨道静默',
    src: '/lab/orbital-silence.jpg',
    alt: '巨大黑色球体悬浮在阶梯地景上方，周围环绕荧光绿色轨道',
    note: '一个最简单的形体，也可以形成完整的引力场。重点不在球，而在它改变了周围什么。',
    prompt: 'BLACK ORB / BRUTALIST LANDSCAPE / THIN RING',
  },
] as const;

const VISUAL_RANKING = [
  {
    rank: '01',
    name: 'Signal Lime',
    description: '只在状态、链接与关键轨道出现；越克制，越醒目。',
    status: 'CORE',
  },
  {
    rank: '02',
    name: 'Monumental Type',
    description: '超大字先建立性格，再让正文负责解释。',
    status: 'ACTIVE',
  },
  {
    rank: '03',
    name: 'Warm Paper',
    description: '不使用纯白，让长内容看起来更像一本持续增页的刊物。',
    status: 'BASE',
  },
  {
    rank: '04',
    name: 'Mono Metadata',
    description: '编号、时间和状态使用等宽字，给内容加一层系统读数。',
    status: 'SYSTEM',
  },
  {
    rank: '05',
    name: 'Hard-edge Grid',
    description: '用明确的边界与错位构图维持秩序，也保留一点不稳定。',
    status: 'RULE',
  },
] as const;

const NEXT_LISTS = ['AI TOOLS', 'FILMS', 'GAMES', 'BOOKS'] as const;

export default function LabPage() {
  return (
    <>
      <SiteHeader current="lab" />

      <main id="main" className="lab-page">
        <section className="lab-hero">
          <div className="section-label light" lang="en">
            <span>00</span>
            <span>Open experiment</span>
          </div>

          <div className="lab-hero-layout">
            <div className="lab-hero-copy">
              <p className="eyebrow">Personal lab / Issue 001</p>
              <h1 lang="en">
                MAKE,
                <br />
                RANK,
                <br />
                <span className="outline">REPEAT.</span>
              </h1>
              <p className="lab-hero-intro">
                一个不要求完成度的公开试验场。
                <br />
                放置 AI 图像、临时偏好，以及尚未命名的想法。
              </p>
              <dl className="lab-hero-meta" lang="en">
                <div>
                  <dt>Studies</dt>
                  <dd>03</dd>
                </div>
                <div>
                  <dt>Ranking</dt>
                  <dd>Top 05</dd>
                </div>
                <div>
                  <dt>Status</dt>
                  <dd>Mutable</dd>
                </div>
              </dl>
            </div>

            <figure className="lab-hero-visual">
              <Image
                src="/lab/orbital-silence.jpg"
                alt="巨大黑色球体与荧光绿色轨道构成的超现实地景"
                width={1122}
                height={1402}
                sizes="(max-width: 760px) 100vw, 34vw"
                priority
              />
              <figcaption lang="en">
                <span>GEN 003</span>
                <span>Orbital Silence</span>
              </figcaption>
            </figure>
          </div>
        </section>

        <section className="lab-manifesto">
          <div className="section-label" lang="en">
            <span>01</span>
            <span>Working note</span>
          </div>
          <div className="lab-manifesto-copy">
            <p className="eyebrow">Not a portfolio / 暂不归档</p>
            <h2>
              这里不放成品，
              <br />
              只保留正在发生的东西。
            </h2>
            <p>
              图片可以来自一次偶然的提示词，榜单也可以随时重排。实验页的价值不是证明“我做完了什么”，而是留下偏好如何变化的轨迹。
            </p>
          </div>
        </section>

        <section className="lab-studies" aria-labelledby="lab-studies-heading">
          <div className="section-label" lang="en">
            <span>02</span>
            <span>Image studies</span>
          </div>
          <div className="lab-studies-body">
            <header className="lab-section-heading">
              <p className="eyebrow">Generated with AI / 生成图像</p>
              <h2 id="lab-studies-heading" lang="en">
                THREE WAYS TO
                <br />
                BUILD A <span>WORLD.</span>
              </h2>
            </header>

            <div className="lab-gallery">
              {IMAGE_STUDIES.map((study) => (
                <article className="lab-study" key={study.number}>
                  <div className="lab-study-media">
                    <Image
                      src={study.src}
                      alt={study.alt}
                      width={1122}
                      height={1402}
                      sizes="(max-width: 760px) 100vw, 58vw"
                    />
                    <span className="lab-study-number" lang="en">
                      GEN {study.number}
                    </span>
                  </div>
                  <div className="lab-study-caption">
                    <div>
                      <h3 lang="en">{study.title}</h3>
                      <span>{study.subtitle}</span>
                    </div>
                    <p>{study.note}</p>
                    <code>{study.prompt}</code>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="lab-ranking" aria-labelledby="lab-ranking-heading">
          <div className="section-label light" lang="en">
            <span>03</span>
            <span>Current ranking</span>
          </div>
          <div className="lab-ranking-body">
            <header className="lab-ranking-heading">
              <div>
                <p className="eyebrow">Top 05 / Site visual signals</p>
                <h2 id="lab-ranking-heading">
                  当前网站的
                  <br />
                  视觉信号榜。
                </h2>
              </div>
              <p>
                这是第一份示例榜单：它记录的是现有网站的设计选择，不代表永久偏好。以后可以直接替换成电影、工具、游戏或任何阶段性的 Top 5。
              </p>
            </header>

            <ol className="lab-ranking-list">
              {VISUAL_RANKING.map((item) => (
                <li key={item.rank}>
                  <span className="lab-rank-number" lang="en">
                    {item.rank}
                  </span>
                  <h3 lang="en">{item.name}</h3>
                  <p>{item.description}</p>
                  <span className="lab-rank-status" lang="en">
                    {item.status}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="lab-queue" aria-labelledby="lab-queue-heading">
          <div className="section-label" lang="en">
            <span>04</span>
            <span>Next lists</span>
          </div>
          <div className="lab-queue-body">
            <header>
              <p className="eyebrow">Open slots / 等待填入</p>
              <h2 id="lab-queue-heading">下一批榜单，先留空。</h2>
            </header>
            <div className="lab-queue-grid" lang="en">
              {NEXT_LISTS.map((list, index) => (
                <div key={list}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <strong>{list}</strong>
                  <small>OPEN SLOT ↘</small>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}

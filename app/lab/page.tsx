import { SiteFooter } from '@/app/components/site-footer';
import { SiteHeader } from '@/app/components/site-header';
import { buildMetadata } from '@/app/lib/metadata';

export const metadata = buildMetadata({
  title: 'Lab',
  description: '把 AI 图像、阶段性偏好和 Top 榜单做成可以收藏的视觉海报。',
  path: '/lab',
});

const NEXT_POSTERS = ['AI TOOLS', 'FILMS', 'GAMES', 'BOOKS'] as const;

export default function LabPage() {
  return (
    <>
      <SiteHeader current="lab" />

      <main id="main" className="lab-page">
        <section className="lab-hero" aria-labelledby="lab-heading">
          <div className="section-label light" lang="en">
            <span>00</span>
            <span>Poster archive</span>
          </div>

          <div className="lab-hero-layout">
            <div className="lab-hero-copy">
              <p className="eyebrow">Visual ranking / Poster 001</p>
              <h1 id="lab-heading" lang="en">
                TOP LISTS,
                <br />
                BUILT AS
                <br />
                <span className="outline">POSTERS.</span>
              </h1>
              <p className="lab-hero-intro">
                不是把图片和榜单分开放。
                <br />
                而是让一张图，就是一个完整主题。
              </p>
              <dl className="lab-hero-meta" lang="en">
                <div>
                  <dt>Posters</dt>
                  <dd>01</dd>
                </div>
                <div>
                  <dt>Format</dt>
                  <dd>4 : 5</dd>
                </div>
                <div>
                  <dt>Status</dt>
                  <dd>Growing</dd>
                </div>
              </dl>
            </div>

            <figure className="lab-hero-visual lab-poster-visual">
              <a
                className="lab-poster-image-link"
                href="/lab/life-rpg-top10.png"
                target="_blank"
                rel="noreferrer"
                aria-label="查看人生最值得培养的能力 Top 10 海报原图"
              >
                <img
                  src="/lab/life-rpg-top10.png"
                  alt="像素游戏风格的信息图海报，以技能树排列人生最值得培养的十项能力"
                  width={1122}
                  height={1402}
                  loading="eager"
                  fetchPriority="high"
                />
              </a>
              <figcaption lang="en">
                <span>POSTER 001 / LIFE RPG</span>
                <span>VIEW FULL SIZE ↗</span>
              </figcaption>
            </figure>
          </div>
        </section>

        <section className="lab-manifesto">
          <div className="section-label" lang="en">
            <span>01</span>
            <span>The format</span>
          </div>
          <div className="lab-manifesto-copy">
            <p className="eyebrow">One image / One complete idea</p>
            <h2>
              一张图讲完一个主题，
              <br />
              也保留足够强的视觉记忆。
            </h2>
            <p>
              实验页之后会以这种“榜单海报”为主要单位：可以是 AI 生成，也可以是找到后想保存的图。每张海报都需要有明确主题、清晰排序，以及一眼就能认出的视觉系统。
            </p>
          </div>
        </section>

        <section className="lab-queue" aria-labelledby="lab-queue-heading">
          <div className="section-label" lang="en">
            <span>02</span>
            <span>Next posters</span>
          </div>
          <div className="lab-queue-body">
            <header>
              <p className="eyebrow">Open slots / 等待下一张图</p>
              <h2 id="lab-queue-heading">同类海报，继续往这里加。</h2>
            </header>
            <div className="lab-queue-grid" lang="en">
              {NEXT_POSTERS.map((poster, index) => (
                <div key={poster}>
                  <span>POSTER {String(index + 2).padStart(3, '0')}</span>
                  <strong>{poster}</strong>
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

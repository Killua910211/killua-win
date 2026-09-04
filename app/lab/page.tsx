import { SiteFooter } from '@/app/components/site-footer';
import { SiteHeader } from '@/app/components/site-header';
import { buildMetadata } from '@/app/lib/metadata';

export const metadata = buildMetadata({
  title: 'Lab',
  description: '收集一些有趣的榜单。',
  path: '/lab',
});

export default function LabPage() {
  return (
    <>
      <SiteHeader current="lab" />

      <main id="main" className="lab-rankings-page">
        <section className="notes-hero notes-hero-compact lab-rankings-hero">
          <div className="section-label light" lang="en">
            <span>00</span>
            <span>Lab</span>
          </div>
          <div>
            <p className="eyebrow">Interesting rankings</p>
            <h1>
              有趣的
              <br />
              <span className="outline">榜单。</span>
            </h1>
          </div>
        </section>

        <section className="lab-rankings" aria-label="榜单列表">
          <div className="section-label" lang="en">
            <span>01</span>
            <span>Rankings</span>
          </div>
          <article className="lab-ranking-item">
            <a
              href="/lab/life-rpg-top10.png"
              target="_blank"
              rel="noreferrer"
              aria-label="查看人生最值得培养的能力 Top 10 原图"
            >
              <img
                src="/lab/life-rpg-top10.png"
                alt="人生最值得培养的能力 Top 10 像素游戏风格榜单"
                width={1122}
                height={1402}
                loading="eager"
                fetchPriority="high"
              />
            </a>
          </article>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}

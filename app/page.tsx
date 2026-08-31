import { Suspense } from 'react';
import Link from 'next/link';
import { SiteFooter } from '@/app/components/site-footer';
import { SiteHeader } from '@/app/components/site-header';
import { SystemReadout } from '@/app/components/system-readout';
import { buildMetadata, SITE } from '@/app/lib/metadata';
import { countPublishedPosts } from '@/app/lib/posts';

export const metadata = buildMetadata({
  title: null,
  description: SITE.description,
  path: '/',
});

/**
 * 首页每小时重新生成一次。
 *
 * 之前没有任何缓存声明，而页面里既有一次 D1 计数又有一次跨站 fetch，
 * 每个请求都要重新付这两笔钱。注意 vinext 默认的 ISR 存储是进程内的 Map
 * （node_modules/vinext/dist/shims/cache-handler.js），在 Workers 上等于
 * 每个 colo 的 isolate 各存一份 —— 命中率不如 KV，但对这类内容变动极慢的
 * 页面已经足够。要做成跨 isolate 共享需要装 @vinext/cloudflare 并绑一个
 * KV namespace，见 README 的「以后可以做的事」。
 */
export const revalidate = 3600;

type Track = {
  number: string;
  title: string;
  cn: string;
  description: string;
  href?: string;
  status: string;
};

function TrackContents({ track }: { track: Track }) {
  return (
    <>
      <span className="track-number">{track.number}</span>
      <div>
        <h2 lang="en">{track.title}</h2>
        <p className="track-cn">{track.cn}</p>
      </div>
      <p className="track-description">{track.description}</p>
      <span className="coming" lang="en">
        {track.status}
      </span>
    </>
  );
}

export default async function Home() {
  // 取不到就退回一个静态文案 —— countPublishedPosts 内部吞掉错误返回 null，
  // 首页不该因为一个计数而具备 500 的可能。
  const publishedCount = await countPublishedPosts();

  const tracks: Track[] = [
    {
      number: '01',
      title: 'Notes',
      cn: '碎片与思考',
      description: '记录学到的事，以及那些还没有标准答案的问题。',
      href: '/notes',
      status: publishedCount === null ? 'ARCHIVE' : `${publishedCount} ESSAYS`,
    },
    {
      number: '02',
      title: 'Builds',
      cn: '作品与实验',
      description: '放置小产品、原型和其他值得被看见的东西。',
      status: 'SOON',
    },
    {
      number: '03',
      title: 'Elsewhere',
      cn: '去往别处',
      description: '收集有用的链接，也为下一次相遇留个入口。',
      status: 'SOON',
    },
  ];

  return (
    <>
      <SiteHeader variant="overlay" current="home" />

      <main id="main">
        <section className="hero" id="top">
          <div className="hero-kicker">
            <span lang="en">Personal space</span>
            <span lang="en">Shanghai / UTC+8</span>
          </div>

          <h1 lang="en">
            A QUIET PLACE
            <br />
            FOR <span className="outline">LOUD</span> IDEAS.
          </h1>

          <div className="hero-bottom">
            <p>
              一个正在生长的个人数字空间。
              <br />
              收集作品、实验，和有意思的未完成。
            </p>
            <a className="round-link" href="#space" aria-label="向下浏览">
              <span aria-hidden="true">↓</span>
            </a>
          </div>

          <div className="orb" aria-hidden="true">
            <div className="orb-ring" />
            <div className="orb-core" />
            <span>K</span>
          </div>
        </section>

        <section className="index" id="space">
          <div className="section-label light" lang="en">
            <span>01—03</span>
            <span>Space index</span>
          </div>
          <div className="track-list">
            {tracks.map((track) =>
              track.href ? (
                <Link className="track track-link" href={track.href} key={track.number}>
                  <TrackContents track={track} />
                </Link>
              ) : (
                <article
                  className="track"
                  id={track.number === '02' ? 'builds' : undefined}
                  key={track.number}
                >
                  <TrackContents track={track} />
                </article>
              ),
            )}
          </div>
        </section>

        {/*
          SystemReadout 要跨站取 os.killua.win 的数字。Suspense 边界让首页
          其余部分先 flush，慢的那一块自己等 —— 没有这个边界的话，整个首页
          的第一个字节都要等那次 fetch 返回。fallback 给 null 是因为这一块
          本来就是「有就显示、没有就整块不渲染」。
        */}
        <Suspense fallback={null}>
          <SystemReadout />
        </Suspense>
      </main>

      <SiteFooter />
    </>
  );
}

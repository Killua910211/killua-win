import Link from 'next/link';
import { Suspense } from 'react';
import { SiteFooter } from '@/app/components/site-footer';
import { SiteHeader } from '@/app/components/site-header';
import { SystemReadout } from '@/app/components/system-readout';
import { buildMetadata, SITE } from '@/app/lib/metadata';

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

export default function Home() {
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
            <div className="hero-intro">
              <p>写下长期思考，记录身体的变化，也整理我和 AI 一起思考的过程。</p>
              <Link className="hero-primary-action" href="/notes#reading-paths">
                阅读精选 <span aria-hidden="true">↗</span>
              </Link>
            </div>
            <a className="round-link" href="#learning" aria-label="向下浏览">
              <span aria-hidden="true">↓</span>
            </a>
          </div>

          <div className="orb" aria-hidden="true">
            <div className="orb-ring" />
            <div className="orb-core" />
            <span>K</span>
          </div>
        </section>

        <section className="home-learning" id="learning" aria-labelledby="home-learning-heading">
          <div className="section-label">
            <span>01</span>
            <span>Learning atlas</span>
          </div>
          <div className="home-learning-body">
            <p className="eyebrow">New section / 学习空间</p>
            <h2 id="home-learning-heading">知识不是一排书名，<br />而是一组彼此相连的问题。</h2>
            <div className="home-learning-bottom">
              <p>从哲学体系树开始，把不同学科整理成可以探索、比较和持续生长的个人地图。</p>
              <Link href="/learning">
                进入学习空间 <span aria-hidden="true">↗</span>
              </Link>
            </div>
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

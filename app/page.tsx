import Link from 'next/link';
import { Suspense } from 'react';
import { SiteFooter } from '@/app/components/site-footer';
import { SiteHeader } from '@/app/components/site-header';
import { PageHero } from '@/app/components/page-hero';
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
      <SiteHeader current="home" />

      <main id="main">
        <PageHero
          decoration={
            <div className="home-hero-effects">
              <span className="home-hero-aura" />
              <span className="home-hero-orbit-bloom" />
              <span className="home-hero-scan" />
              <span className="home-hero-dust home-hero-dust-one" />
              <span className="home-hero-dust home-hero-dust-two" />
              <div className="orb"><div className="orb-ring" /><div className="orb-core" /><span>K</span></div>
            </div>
          }
          description="写下长期思考，记录身体的变化，也整理我和 AI 一起思考的过程。"
          eyebrow="Personal space / 上海"
          id="top"
          label="Personal space"
          number="01"
          title={<><span>A QUIET</span><br />PLACE FOR <span className="outline">LOUD</span> IDEAS.</>}
          titleId="home-title"
          variant="home"
          action={
            <>
              <Link className="page-hero__primary-action" href="/notes#archive">阅读精选 <span aria-hidden="true">↗</span></Link>
              <Link className="page-hero__secondary-action" href="/learning">进入学习空间 <span aria-hidden="true">↗</span></Link>
            </>
          }
        />

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

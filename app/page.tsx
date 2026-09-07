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
 * 首页不做整页 ISR。
 *
 * 这里包含跨站 OS 汇总；OS 的公开字段变更后，跨部署留存的一张首页缓存会让
 * 用户继续看到旧卡片，即使 Worker 已经发布。保持动态渲染，确保发布一完成
 * 首页的结构就随之切换。SystemReadout 本身有超时与 Suspense 边界，慢时不阻塞
 * 其余首页内容。
 */
export const revalidate = 0;

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
              <span className="hero-scan hero-scan--diagonal" />
              <span className="hero-scan hero-scan--horizontal" />
              <span className="hero-scan hero-scan--vertical" />
              <span className="hero-scan hero-scan--grid" />
              <span className="hero-scan hero-scan--radial" />
              <span className="home-hero-dust home-hero-dust-one" />
              <span className="home-hero-dust home-hero-dust-two" />
              <span className="home-hero-dust home-hero-dust-three" />
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

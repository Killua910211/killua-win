'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { SiteFooter } from '@/app/components/site-footer';
import { SiteHeader } from '@/app/components/site-header';

/**
 * 页面级错误边界。
 *
 * 最现实的触发路径是数据库：app/lib/posts.ts 里的查询失败会往外抛，
 * 而在这个文件存在之前，那一抛就是一个没有任何样式的 500 页。
 * 最常见的成因是部署了引用新列的代码却忘了 apply 迁移 —— 现在
 * `pnpm deploy` 已经把 migrate 串进去了，但兜底仍然要有。
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('app.render_failed', { message: error.message, digest: error.digest });
  }, [error]);

  return (
    <>
      <SiteHeader />

      <main id="main" className="status-page">
        <section className="status-hero">
          <div className="section-label light" lang="en">
            <span>500</span>
            <span>Something broke</span>
          </div>
          <div>
            <p className="eyebrow">Error / 这一页没能打开</p>
            <h1 lang="en">
              TAKE TWO,
              <br />
              <span className="outline">MAYBE.</span>
            </h1>
            <p className="status-intro">
              页面渲染时出了问题。可以重试一次，还是不行的话稍后再来。
            </p>
            <div className="status-actions">
              <button className="status-link" onClick={reset} type="button">
                重试
              </button>
              <Link className="status-link" href="/">
                回到首页
              </Link>
            </div>
            {error.digest ? (
              <p className="status-digest" lang="en">
                Digest {error.digest}
              </p>
            ) : null}
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}

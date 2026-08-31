import { SiteHeader } from '@/app/components/site-header';

/**
 * 文章页的加载骨架。
 *
 * 缓存未命中时这一页要等一次 D1 查询，没有骨架的话导航后是一段白屏。
 * 只画标题区的形状 —— 正文长度未知，假装知道反而更晃眼。
 */
export default function LoadingPost() {
  return (
    <>
      <SiteHeader current="notes" />
      <main id="main" className="post-page">
        <div className="post-skeleton" aria-hidden="true">
          <div className="post-heading">
            <span className="skeleton-line skeleton-back" />
            <div className="skeleton-meta">
              <span className="skeleton-line" />
              <span className="skeleton-line" />
            </div>
            <span className="skeleton-line skeleton-title" />
            <span className="skeleton-line skeleton-title skeleton-title-short" />
          </div>
        </div>
        <p className="visually-hidden" role="status">
          正在加载文章…
        </p>
      </main>
    </>
  );
}

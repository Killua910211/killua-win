import Link from 'next/link';
import { SiteFooter } from '@/app/components/site-footer';
import { SiteHeader } from '@/app/components/site-header';

export const metadata = {
  title: '页面未找到',
  robots: { index: false, follow: true },
};

/**
 * 没有这个文件的话，404 会落到 vinext 的默认页 —— 它内联了
 * `body { background: #fff }`，把站点的纸色整个盖掉，结果是一个
 * 纯白英文页出现在 lang="zh-CN" 的文档里。
 */
export default function NotFound() {
  return (
    <>
      <SiteHeader />

      <main id="main" className="status-page">
        <section className="status-hero">
          <div className="section-label light" lang="en">
            <span>404</span>
            <span>Not found</span>
          </div>
          <div>
            <p className="eyebrow">Error / 页面未找到</p>
            <h1 lang="en">
              NOTHING
              <br />
              <span className="outline">HERE.</span>
            </h1>
            <p className="status-intro">
              这个地址下没有东西 —— 可能是链接旧了，也可能是我把它挪走了。
            </p>
            <div className="status-actions">
              <Link className="status-link" href="/">
                回到首页
              </Link>
              <Link className="status-link" href="/notes">
                去看 Notes
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}

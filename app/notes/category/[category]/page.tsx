import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { NotesArchive } from '@/app/components/notes-archive';
import { SiteFooter } from '@/app/components/site-footer';
import { SiteHeader } from '@/app/components/site-header';
import { buildMetadata } from '@/app/lib/metadata';
import { groupByCategory, listPublishedPosts } from '@/app/lib/posts';

export const revalidate = 3600;

type CategoryPageProps = {
  params: Promise<{ category: string }>;
};

/**
 * 分类从 `?category=` 挪到独立路由段。
 *
 * 除了让 /notes 和这一页都能被整页缓存（searchParams 会强制动态渲染），
 * 还解决了重复内容：过滤后的页面以前和 /notes 共用同一个 title 和
 * 同一个 canonical，搜索引擎看到的是好几份自称是同一页的东西。
 *
 * 没有 generateStaticParams 是有意的：vinext 的预渲染跑在纯 Node 里
 * （见 node_modules/vinext/dist/build/run-prerender.js 的说明：
 * "no wrangler/miniflare is needed"），构建期拿不到 D1 绑定，
 * 任何在那里查库的 generateStaticParams 都会让构建直接失败。
 * 这一页走按需 ISR：第一个请求渲染，之后一小时内走缓存。
 */
async function resolveCategory(params: CategoryPageProps['params']) {
  const { category } = await params;
  const decoded = decodeURIComponent(category);
  const posts = await listPublishedPosts();
  const exists = groupByCategory(posts).some(([name]) => name === decoded);
  return { decoded, posts, exists };
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { decoded, exists } = await resolveCategory(params);

  if (!exists) {
    return { title: '分类未找到' };
  }

  return buildMetadata({
    title: `${decoded} · Notes`,
    description: `KILLUA.WIN 中归类为「${decoded}」的文章。`,
    path: `/notes/category/${encodeURIComponent(decoded)}`,
  });
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { decoded, posts, exists } = await resolveCategory(params);

  if (!exists) {
    notFound();
  }

  return (
    <>
      <SiteHeader current="notes" />

      <main id="main" className="notes-page">
        <section className="notes-hero notes-hero-compact">
          <div className="section-label light" lang="en">
            <span>01</span>
            <span>Writing archive</span>
          </div>
          <div>
            <p className="eyebrow">Notes / 碎片与思考</p>
            <h1>{decoded}</h1>
            <p className="notes-intro">
              只看这一类。想看全部，回到{' '}
              <Link className="notes-intro-link" href="/notes#archive">
                Notes 总览
              </Link>
              。
            </p>
          </div>
        </section>

        <NotesArchive posts={posts} activeCategory={decoded} sectionNumber="02" />
      </main>

      <SiteFooter />
    </>
  );
}

import { NotesArchive } from '@/app/components/notes-archive';
import { NotesPreface } from '@/app/components/notes-preface';
import { SiteFooter } from '@/app/components/site-footer';
import { SiteHeader } from '@/app/components/site-header';
import { buildMetadata } from '@/app/lib/metadata';
import { listPublishedPosts } from '@/app/lib/posts';

export const metadata = buildMetadata({
  title: 'Notes',
  description: '旧文章与新想法，在这里继续生长。',
  path: '/notes',
});

/**
 * 从 force-dynamic 改成每小时再生成。
 *
 * 之前分类过滤走 `?category=`，读 searchParams 会让这一页**永远**动态渲染，
 * 缓存声明写了也没用。现在分类是独立路由段 /notes/category/[category]，
 * 这一页不再读任何请求态输入，可以整页缓存。
 */
export const revalidate = 3600;

export default async function NotesPage() {
  const posts = await listPublishedPosts();

  return (
    <>
      <SiteHeader current="notes" />

      <main id="main" className="notes-page">
        <section className="notes-hero">
          <div className="section-label light" lang="en">
            <span>01</span>
            <span>Writing archive</span>
          </div>
          <div>
            <p className="eyebrow">Notes / 碎片与思考</p>
            <h1 lang="en">
              OLD WORDS,
              <br />
              NEW <span className="outline">LIGHT.</span>
            </h1>
            <p className="notes-intro">
              从旧空间迁来的文字，也会放进以后持续写下的新想法。
            </p>
          </div>
        </section>

        <NotesPreface />

        <NotesArchive posts={posts} sectionNumber="01" />
      </main>

      <SiteFooter />
    </>
  );
}

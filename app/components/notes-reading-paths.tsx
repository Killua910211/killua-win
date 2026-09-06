import Link from 'next/link';
import { READING_PATHS } from '@/app/lib/reading-paths';
import { formatPublishedDate, type PostSummary } from '@/app/lib/posts';

type NotesReadingPathsProps = {
  posts: readonly PostSummary[];
  sectionNumber: string;
};

export function NotesReadingPaths({ posts, sectionNumber }: NotesReadingPathsProps) {
  const bySlug = new Map(posts.map((post) => [post.slug, post]));
  const paths = READING_PATHS.map((path) => ({
    ...path,
    posts: path.slugs
      .map((slug) => bySlug.get(slug))
      .filter((post): post is PostSummary => Boolean(post)),
  })).filter((path) => path.posts.length > 1);

  if (paths.length === 0) return null;

  return (
    <section
      className="notes-reading-paths"
      id="reading-paths"
      aria-labelledby="notes-reading-paths-heading"
    >
      <div className="section-label" lang="en">
        <span>{sectionNumber}</span>
        <span>Reading paths</span>
      </div>
      <div className="notes-reading-paths-copy">
        <h2 id="notes-reading-paths-heading">按主题读</h2>
        <p className="notes-reading-paths-intro">
          除了按分类和年份翻，这几条是手工连起来的线索：同一个主题隔了好几年被反复写过。
        </p>
        <div className="notes-reading-paths-list">
          {paths.map((path) => (
            <article className="notes-reading-path" key={path.id}>
              <h3>{path.title}</h3>
              <p className="notes-reading-path-connection">{path.connection}</p>
              <ol>
                {path.posts.map((post) => (
                  <li key={post.slug}>
                    <Link href={`/notes/${post.slug}`} prefetch={false}>
                      {post.title}
                    </Link>
                    {post.published_at ? (
                      <time dateTime={post.published_at}>
                        {formatPublishedDate(post.published_at)}
                      </time>
                    ) : null}
                  </li>
                ))}
              </ol>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

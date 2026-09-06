import { READING_PATHS } from '@/app/lib/reading-paths';
import type { PostSummary } from '@/app/lib/posts';

const MAX_RELATED = 2;

/**
 * 给一篇文章找 1-2 篇相关旧文章，用在文章末尾。
 *
 * 优先复用 reading-paths 里手工挑的主题线索——那些关联已经是人工确认过的。
 * 没被收进任何路径的文章，退回同分类里发布时间最接近的邻居：仍然是真实
 * 存在、有明确关联（同分类+时间相近）的文章，不需要逐篇手动打标签。
 */
export function getRelatedPosts(
  post: PostSummary,
  allPosts: readonly PostSummary[],
): PostSummary[] {
  const bySlug = new Map(allPosts.map((candidate) => [candidate.slug, candidate]));
  const path = READING_PATHS.find((candidate) => candidate.slugs.includes(post.slug));

  if (path) {
    const related = path.slugs
      .filter((slug) => slug !== post.slug)
      .map((slug) => bySlug.get(slug))
      .filter((candidate): candidate is PostSummary => Boolean(candidate));

    if (related.length > 0) return related.slice(0, MAX_RELATED);
  }

  const postTime = post.published_at ? new Date(post.published_at).getTime() : null;

  const sameCategory = allPosts
    .filter((candidate) => candidate.slug !== post.slug && candidate.category === post.category)
    .sort((a, b) => {
      if (postTime === null || !a.published_at || !b.published_at) return 0;
      const diffA = Math.abs(new Date(a.published_at).getTime() - postTime);
      const diffB = Math.abs(new Date(b.published_at).getTime() - postTime);
      return diffA - diffB;
    });

  return sameCategory.slice(0, MAX_RELATED);
}

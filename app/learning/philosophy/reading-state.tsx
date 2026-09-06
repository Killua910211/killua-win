'use client';

import Link from 'next/link';
import { useEffect, useState, type CSSProperties } from 'react';

/**
 * 阅读进度只做一件事：读写旧静态页留下的那把钥匙。
 *
 * 键名和值的形状必须和 public/learning/philosophy-tree.html 完全一致
 * （一个只含核心问题 ID 的字符串数组），否则在旧页面读过的 17 题会在新
 * 页面里全部归零。这里刻意不引入 tree.ts —— 那会把整份 data.json 打进
 * 客户端包，核心问题 ID 由服务端组件按需传进来就够了。
 */
const VISITED_STORAGE_KEY = 'pt-philosophy-tree:v1:visited';

export type ChecklistQuestion = {
  id: string;
  title: string;
  href: string;
};

export type ChecklistGroup = {
  id: string;
  title: string;
  href: string;
  summary: string;
  questions: ChecklistQuestion[];
};

function readVisited(coreIds: readonly string[]): string[] {
  try {
    const saved: unknown = JSON.parse(window.localStorage.getItem(VISITED_STORAGE_KEY) ?? 'null');
    if (!Array.isArray(saved)) return [];
    return saved.filter((id): id is string => typeof id === 'string' && coreIds.includes(id));
  } catch {
    // 隐私模式或存储被禁用：当作没有历史，页面其它部分照常可用。
    return [];
  }
}

/**
 * 返回已读 ID；未水合前是 null，用来把「还不知道」和「读过 0 题」区分开。
 * 传了 markId 就顺手把当前节点记成已读。
 */
function useVisitedIds(coreIds: readonly string[], markId?: string): string[] | null {
  const [visited, setVisited] = useState<string[] | null>(null);

  useEffect(() => {
    const current = readVisited(coreIds);
    const shouldMark = Boolean(markId && coreIds.includes(markId) && !current.includes(markId));
    const next = shouldMark && markId ? [...current, markId] : current;

    if (shouldMark) {
      try {
        window.localStorage.setItem(VISITED_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // 写不进去也不影响这次阅读，只是下次不会记得。
      }
    }

    const updateId = window.setTimeout(() => setVisited(next), 0);
    return () => window.clearTimeout(updateId);
  }, [coreIds, markId]);

  return visited;
}

function progressStyle(readCount: number, total: number): CSSProperties {
  const percent = total ? Math.round((readCount / total) * 100) : 0;
  return { '--pt-progress': `${percent}%` } as CSSProperties;
}

/**
 * 首屏主 CTA。
 *
 * 没有历史时是「从哲学总览开始」，有历史时是「继续学习」并直接指向下一个
 * 没读过的核心问题 —— 回访的人不该被硬塞回总览。
 */
export function PhilosophyResume({
  coreIds,
  questions,
  overviewHref,
}: {
  coreIds: readonly string[];
  questions: ChecklistQuestion[];
  overviewHref: string;
}) {
  const visited = useVisitedIds(coreIds);
  const total = coreIds.length;
  const hasHistory = visited !== null && visited.length > 0;
  const nextUnread = visited ? questions.find((question) => !visited.includes(question.id)) : undefined;

  const href = hasHistory ? (nextUnread?.href ?? overviewHref) : overviewHref;
  const label = hasHistory ? '继续学习' : '从哲学总览开始';
  const hint = !hasHistory
    ? `${total} 个核心问题 · 先看总览，再挑一个问题读完`
    : nextUnread
      ? `下一题 · ${nextUnread.title}`
      : `${total} 个核心问题都读过了 · 回总览复习`;

  return (
    <div className="learning-resume">
      <Link className="learning-resume-cta" href={href}>
        <span>{label}</span>
        <span aria-hidden="true">↗</span>
      </Link>
      <p className="learning-resume-hint">{hint}</p>
      <div className="learning-progress" style={progressStyle(visited?.length ?? 0, total)}>
        <p className="learning-progress-label" aria-live="polite">
          <span lang="en">CORE QUESTIONS</span>
          <span>已读 {visited === null ? '—' : visited.length} / {total}</span>
        </p>
        <span className="learning-progress-track" aria-hidden="true">
          <span className="learning-progress-bar" />
        </span>
      </div>
    </div>
  );
}

/**
 * 单独的进度条。markId 传核心问题 ID 时，打开这一页就算读过。
 */
export function ReadingProgress({
  coreIds,
  markId,
  caption,
}: {
  coreIds: readonly string[];
  markId?: string;
  caption?: string;
}) {
  const visited = useVisitedIds(coreIds, markId);
  const total = coreIds.length;
  const isRead = Boolean(visited && markId && visited.includes(markId));

  return (
    <div className="learning-progress" style={progressStyle(visited?.length ?? 0, total)}>
      <p className="learning-progress-label" aria-live="polite">
        <span lang="en">{caption ?? 'CORE QUESTIONS'}</span>
        <span>
          {markId ? (isRead ? '已标记为读过 · ' : '') : ''}已读 {visited === null ? '—' : visited.length} / {total}
        </span>
      </p>
      <span className="learning-progress-track" aria-hidden="true">
        <span className="learning-progress-bar" />
      </span>
    </div>
  );
}

/**
 * 「按问题」区块：五个问题域 + 17 个核心问题的真实链接。
 *
 * 内容在服务端就渲染完（客户端组件同样参与 SSR），已读状态在水合后补上，
 * 所以没有 JS 也能看到全部链接。
 */
export function CoreQuestionChecklist({
  coreIds,
  groups,
  headingLevel = 'h3',
}: {
  coreIds: readonly string[];
  groups: ChecklistGroup[];
  headingLevel?: 'h3' | 'h4';
}) {
  const visited = useVisitedIds(coreIds);
  const GroupHeading = headingLevel;
  const QuestionHeading = headingLevel === 'h3' ? 'h4' : 'h5';
  return (
    <div className="learning-question-groups">
      {groups.map((group, groupIndex) => {
        const readInGroup = visited
          ? group.questions.filter((question) => visited.includes(question.id)).length
          : 0;
        const questionOffset = groups
          .slice(0, groupIndex)
          .reduce((total, item) => total + item.questions.length, 0);

        return (
          <article className="learning-question-group" key={group.id}>
            <div className="learning-question-group-head">
              <GroupHeading>
                <Link className="learning-question-domain-link" href={group.href}>
                  {group.title}
                </Link>
              </GroupHeading>
              <p className="learning-question-count" lang="en">
                {visited === null ? '—' : readInGroup} / {group.questions.length}
              </p>
            </div>
            <p className="learning-question-group-summary">{group.summary}</p>
            <ul className="learning-question-list">
              {group.questions.map((question, questionIndex) => {
                const isRead = Boolean(visited?.includes(question.id));

                return (
                  <li key={question.id} data-read={isRead ? 'true' : undefined}>
                    <Link className="learning-question-link" href={question.href}>
                      <span className="learning-question-index" lang="en" aria-hidden="true">
                        {String(questionOffset + questionIndex + 1).padStart(2, '0')}
                      </span>
                      <QuestionHeading className="learning-question-title">
                        {question.title}
                      </QuestionHeading>
                      <span className="learning-question-state">
                        {visited === null ? '' : isRead ? '已读' : '未读'}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </article>
        );
      })}
    </div>
  );
}

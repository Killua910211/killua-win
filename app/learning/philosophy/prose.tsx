import { Fragment, type ReactNode } from 'react';
import { ConceptGloss } from './concept-card';

/**
 * 正文里的行内概念标记。
 *
 * 语法只有一种：`[[concept-id|显示文本]]`。
 *
 * 之所以不做成更通用的富文本，是因为知识库只需要这一个能力。引入 MDX 或
 * 自定义节点树，会让每次写内容都要先想数据结构；一个五行的正则解析器
 * 就够了，而且不认识的概念 id 会在构建期直接抛错，不会静默漏渲染。
 */

const GLOSS = /\[\[([a-z0-9-]+)\|([^\]|]+)\]\]/g;

export function hasGloss(text: string): boolean {
  GLOSS.lastIndex = 0;
  return GLOSS.test(text);
}

export function renderProse(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  let cursor = 0;
  let key = 0;

  GLOSS.lastIndex = 0;
  for (let match = GLOSS.exec(text); match; match = GLOSS.exec(text)) {
    if (match.index > cursor) {
      parts.push(<Fragment key={`t${key}`}>{text.slice(cursor, match.index)}</Fragment>);
      key += 1;
    }
    parts.push(
      <ConceptGloss id={match[1]} key={`g${key}`}>
        {match[2]}
      </ConceptGloss>,
    );
    key += 1;
    cursor = match.index + match[0].length;
  }

  if (cursor < text.length) {
    parts.push(<Fragment key={`t${key}`}>{text.slice(cursor)}</Fragment>);
  }

  return parts;
}

/**
 * 一个正文段落。
 *
 * 没有概念注解时仍然是 <p>；有注解时降级成 div，因为 <details> 不能放进
 * <p>——浏览器解析时会把段落提前闭合，后半句会掉出段落之外。
 */
export function Prose({
  children,
  className,
  trailing,
}: {
  children: string;
  className?: string;
  /** 段末追加的内容，例如引用角标。 */
  trailing?: ReactNode;
}) {
  const glossed = hasGloss(children);
  const content = (
    <>
      {glossed ? renderProse(children) : children}
      {trailing}
    </>
  );

  if (!glossed) {
    return <p className={className}>{content}</p>;
  }
  return <div className={[className, 'philosophy-para'].filter(Boolean).join(' ')}>{content}</div>;
}

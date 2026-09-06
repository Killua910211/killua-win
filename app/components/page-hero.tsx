import type { ReactNode } from 'react';
import { ContentContainer } from './content-container';

type PageHeroProps = {
  action?: ReactNode;
  decoration?: ReactNode;
  description: ReactNode;
  eyebrow: ReactNode;
  footer?: ReactNode;
  id?: string;
  label: string;
  number: string;
  title: ReactNode;
  titleId: string;
  variant?: 'home' | 'default';
};

/** 顶层栏目共享的首屏骨架；栏目只提供自己的内容与可选装饰。 */
export function PageHero({
  action,
  decoration,
  description,
  eyebrow,
  footer,
  id,
  label,
  number,
  title,
  titleId,
  variant = 'default',
}: PageHeroProps) {
  return (
    <section className={`page-hero page-hero--${variant}`} id={id} aria-labelledby={titleId}>
      <ContentContainer className="page-hero__grid">
        <div className="section-label page-hero__label" lang="en">
          <span>{number}</span>
          <span>{label}</span>
        </div>
        <div className="page-hero__body">
          <p className="eyebrow page-hero__eyebrow">{eyebrow}</p>
          <h1 id={titleId}>{title}</h1>
          <div className="page-hero__description">{description}</div>
          {action ? <div className="page-hero__action">{action}</div> : null}
          {footer ? <div className="page-hero__footer">{footer}</div> : null}
        </div>
        <div className="page-hero__decoration" aria-hidden="true">{decoration}</div>
      </ContentContainer>
    </section>
  );
}

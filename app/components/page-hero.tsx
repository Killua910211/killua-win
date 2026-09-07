'use client';

import type { PointerEvent, ReactNode } from 'react';
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

function updateHomePointer(event: PointerEvent<HTMLElement>) {
  if (event.pointerType === 'touch' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const bounds = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty('--pointer-x', `${((event.clientX - bounds.left) / bounds.width) * 100}%`);
  event.currentTarget.style.setProperty('--pointer-y', `${((event.clientY - bounds.top) / bounds.height) * 100}%`);
}

function HeroScanLayers() {
  return (
    <>
      <span className="hero-scan hero-scan--diagonal" />
      <span className="hero-scan hero-scan--horizontal" />
      <span className="hero-scan hero-scan--vertical" />
      <span className="hero-scan hero-scan--grid" />
      <span className="hero-scan hero-scan--radial" />
    </>
  );
}

function AmbientHeroEffects() {
  return (
    <div className="page-hero__ambient" aria-hidden="true">
      <span className="page-hero__ambient-glow" />
      <HeroScanLayers />
      <span className="home-hero-dust home-hero-dust-one" />
      <span className="home-hero-dust home-hero-dust-two" />
      <span className="home-hero-dust home-hero-dust-three" />
    </div>
  );
}

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
  const isHome = variant === 'home';

  return (
    <section
      className={`page-hero page-hero--${variant}`}
      id={id}
      aria-labelledby={titleId}
      onPointerMove={isHome ? updateHomePointer : undefined}
    >
      {isHome && decoration ? <div className="page-hero__decoration" aria-hidden="true">{decoration}</div> : null}
      {!isHome ? <AmbientHeroEffects /> : null}
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
        {!isHome && decoration ? <div className="page-hero__decoration" aria-hidden="true">{decoration}</div> : null}
      </ContentContainer>
    </section>
  );
}

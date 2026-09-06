'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

const navigationItems = [
  { href: '/', key: 'home', label: 'Home' },
  { href: '/notes', key: 'notes', label: 'Notes' },
  { href: '/health', key: 'health', label: 'Health' },
  { href: '/mind', key: 'mind', label: 'Mind' },
  { href: '/learning', key: 'learning', label: 'Learn' },
] as const;

type SiteHeaderProps = {
  /** 当前页，用于给对应导航项加 aria-current。 */
  current?: 'home' | 'notes' | 'health' | 'mind' | 'learning';
};

export function SiteHeader({ current }: SiteHeaderProps) {
  const onHome = current === 'home';
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isMenuOpen) return;

    const menu = mobileMenuRef.current;
    const previousOverflow = document.body.style.overflow;
    const focusableSelector = 'a[href], button:not([disabled])';

    document.body.style.overflow = 'hidden';
    window.requestAnimationFrame(() => menu?.querySelector<HTMLElement>(focusableSelector)?.focus());

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        setIsMenuOpen(false);
        menuButtonRef.current?.focus();
        return;
      }

      if (event.key !== 'Tab' || !menu) return;

      const focusable = Array.from(menu.querySelectorAll<HTMLElement>(focusableSelector));
      const first = focusable[0];
      const last = focusable.at(-1);

      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    function handleRouteChange() {
      setIsMenuOpen(false);
    }

    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('popstate', handleRouteChange);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, [isMenuOpen]);

  return (
    <header className="site-header">
      <div className="site-header__inner">
        {/* 首页的 wordmark 指向页内锚点，内页则回到站点根。 */}
        {onHome ? (
          <a className="wordmark" href="#top" aria-label="killua.win 首页">
            <span className="wordmark-dot" aria-hidden="true" />
            KILLUA.WIN
          </a>
        ) : (
          <Link className="wordmark" href="/" aria-label="killua.win 首页">
            <span className="wordmark-dot" aria-hidden="true" />
            KILLUA.WIN
          </Link>
        )}

        <nav className="desktop-nav" aria-label="主导航" lang="en">
          {navigationItems.map((item) => (
            <Link
              className={item.key === 'home' ? 'nav-secondary' : undefined}
              aria-current={current === item.key ? 'page' : undefined}
              href={item.href}
              key={item.key}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <span className="edition" lang="en">ED. 001</span>
          <a className="os-entry" href="https://os.killua.win/today" target="_blank" rel="noreferrer">
            KILLUA OS <span aria-hidden="true">↗</span>
          </a>
        </div>

        <button
          aria-controls="mobile-main-navigation"
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? '关闭主导航' : '打开主导航'}
          className="mobile-nav-toggle"
          onClick={() => setIsMenuOpen((open) => !open)}
          ref={menuButtonRef}
          type="button"
        >
          <span aria-hidden="true" className="mobile-nav-toggle-icon" />
          <span>{isMenuOpen ? 'Close' : 'Menu'}</span>
        </button>
      </div>

      <nav
        aria-label="移动端主导航"
        aria-hidden={!isMenuOpen}
        className={`mobile-nav${isMenuOpen ? ' is-open' : ''}`}
        id="mobile-main-navigation"
        ref={mobileMenuRef}
      >
        <span className="mobile-nav-label" lang="en">Navigation</span>
        <div className="mobile-nav-links" lang="en">
          {navigationItems.map((item) => (
            <Link
              aria-current={current === item.key ? 'page' : undefined}
              href={item.href}
              key={item.key}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
        <a className="mobile-nav-os-entry" href="https://os.killua.win/today" target="_blank" rel="noreferrer">
          KILLUA OS <span aria-hidden="true">↗</span>
        </a>
      </nav>
    </header>
  );
}

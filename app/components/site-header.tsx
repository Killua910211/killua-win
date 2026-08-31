import Link from 'next/link';

type SiteHeaderProps = {
  /**
   * 'overlay' 是首页那版：绝对定位浮在深色 hero 上。
   * 'solid' 是内页那版：正常文档流，自带深色底。
   */
  variant?: 'overlay' | 'solid';
  /** 当前页，用于给对应导航项加 aria-current。 */
  current?: 'home' | 'notes';
};

export function SiteHeader({ variant = 'solid', current }: SiteHeaderProps) {
  const onHome = current === 'home';

  return (
    <header className={variant === 'overlay' ? 'site-header' : 'site-header page-site-header'}>
      {/*
        首页的 wordmark 指向页内锚点（平滑回到顶部），内页指向站点根。
        用普通 <a> 而不是 <Link> 是有意的：同页锚点不需要走路由。
      */}
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

      <nav aria-label="主导航" lang="en">
        {!onHome ? <Link href="/">Home</Link> : null}
        <Link aria-current={current === 'notes' ? 'page' : undefined} href="/notes">
          Notes
        </Link>
        <a className="nav-secondary" href={onHome ? '#builds' : '/#builds'}>
          Builds
        </a>
      </nav>

      <div className="header-actions">
        <span className="edition" lang="en">
          ED. 001
        </span>
        <a className="os-entry" href="https://os.killua.win/today" target="_blank" rel="noreferrer">
          KILLUA OS <span aria-hidden="true">↗</span>
        </a>
      </div>
    </header>
  );
}

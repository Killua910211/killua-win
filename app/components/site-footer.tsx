import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer>
      <Link className="wordmark footer-mark" href="/" aria-label="killua.win 首页">
        <span className="wordmark-dot" aria-hidden="true" />
        KILLUA.WIN
      </Link>
      <p lang="en">Ideas need somewhere to land.</p>
      <p lang="en">© 2026 / ALL SYSTEMS NOMINAL</p>
    </footer>
  );
}

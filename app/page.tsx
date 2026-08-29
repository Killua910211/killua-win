import Link from 'next/link';

const tracks = [
  {
    number: '01',
    title: 'Notes',
    cn: '碎片与思考',
    description: '记录学到的事，以及那些还没有标准答案的问题。',
    href: '/notes',
    status: '04 ESSAYS',
  },
  {
    number: '02',
    title: 'Builds',
    cn: '作品与实验',
    description: '放置小产品、原型和其他值得被看见的东西。',
    status: 'SOON',
  },
  {
    number: '03',
    title: 'Elsewhere',
    cn: '去往别处',
    description: '收集有用的链接，也为下一次相遇留个入口。',
    status: 'SOON',
  },
];

function TrackContents({ track }: { track: (typeof tracks)[number] }) {
  return (
    <>
      <span className="track-number">{track.number}</span>
      <div>
        <h3>{track.title}</h3>
        <p className="track-cn">{track.cn}</p>
      </div>
      <p className="track-description">{track.description}</p>
      <span className="coming">{track.status}</span>
    </>
  );
}

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="killua.win 首页">
          <span className="wordmark-dot" />
          KILLUA.WIN
        </a>
        <nav aria-label="主导航">
          <a href="#about">About</a>
          <a href="#space">Index</a>
        </nav>
        <span className="edition">ED. 001</span>
      </header>

      <section className="hero" id="top">
        <div className="hero-kicker">
          <span>Personal space</span>
          <span>Shanghai / UTC+8</span>
        </div>

        <h1>
          A QUIET PLACE
          <br />
          FOR <span className="outline">LOUD</span> IDEAS.
        </h1>

        <div className="hero-bottom">
          <p>
            一个正在生长的个人数字空间。
            <br />
            收集作品、实验，和有意思的未完成。
          </p>
          <a className="round-link" href="#about" aria-label="向下浏览">
            <span>↓</span>
          </a>
        </div>

        <div className="orb" aria-hidden="true">
          <div className="orb-ring" />
          <div className="orb-core" />
          <span>K</span>
        </div>
      </section>

      <section className="statement" id="about">
        <div className="section-label">
          <span>00</span>
          <span>Now loading</span>
        </div>
        <div className="statement-copy">
          <p className="eyebrow">The first page</p>
          <h2>
            网站已经开始了。
            <br />
            剩下的，边走边写。
          </h2>
          <div className="statement-meta">
            <p>
              这是 killua.win 的第一个版本。这里会逐渐加入文章、项目和更多个人线索。
            </p>
            <div className="status">
              <span className="pulse" />
              Building in public
            </div>
          </div>
        </div>
      </section>

      <section className="index" id="space">
        <div className="section-label light">
          <span>01—03</span>
          <span>Space index</span>
        </div>
        <div className="track-list">
          {tracks.map((track) =>
            track.href ? (
              <Link className="track track-link" href={track.href} key={track.number}>
                <TrackContents track={track} />
              </Link>
            ) : (
              <article className="track" key={track.number}>
                <TrackContents track={track} />
              </article>
            ),
          )}
        </div>
      </section>

      <footer>
        <a className="wordmark footer-mark" href="#top">
          <span className="wordmark-dot" />
          KILLUA.WIN
        </a>
        <p>Ideas need somewhere to land.</p>
        <p>© 2026 / ALL SYSTEMS NOMINAL</p>
      </footer>
    </main>
  );
}

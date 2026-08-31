'use client';

/**
 * 只有根 layout 自己抛错时才会走到这里 —— 那时连 <html>/<body> 都还没有，
 * 所以这个组件必须自带。样式也只能内联：globals.css 是 layout 引进来的。
 */
export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="zh-CN">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          background: '#151515',
          color: '#f2f0e8',
          fontFamily: 'system-ui, sans-serif',
          textAlign: 'center',
          padding: '24px',
        }}
      >
        <div>
          <p style={{ color: '#ccff00', letterSpacing: '0.14em', fontSize: 11 }}>KILLUA.WIN</p>
          <h1 style={{ fontWeight: 520, letterSpacing: '-0.04em' }}>站点没能启动</h1>
          <p style={{ opacity: 0.7, lineHeight: 1.8 }}>请稍后再试一次。</p>
          <button
            onClick={reset}
            type="button"
            style={{
              marginTop: 16,
              padding: '10px 18px',
              border: '1px solid #ccff00',
              background: 'transparent',
              color: '#ccff00',
              cursor: 'pointer',
              font: 'inherit',
            }}
          >
            重试
          </button>
        </div>
      </body>
    </html>
  );
}

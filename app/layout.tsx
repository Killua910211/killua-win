import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { SITE } from '@/app/lib/metadata';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

/**
 * 这里只放站点级默认值，**不放 url 和 canonical**。
 * 每一页都用 buildMetadata() 自己生成完整的一份 —— 见 app/lib/metadata.ts
 * 里关于「同名 key 整体覆盖」的说明。
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  alternates: {
    // 只能用字符串形式。vinext 的 metadata shim 把 alternates.types 的每个值
    // 都当 URL 字符串处理（dist/shims/metadata.js:770 → :337 的 url.startsWith），
    // Next 支持的 [{ url, title }] 数组形式在这里会直接抛 TypeError。
    types: { 'application/rss+xml': '/feed.xml' },
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {/*
          跳转到正文。放在 body 的第一个位置，是键盘用户拿到的第一个焦点；
          平时用 clip 隐藏，聚焦时才显形。
        */}
        <a className="skip-link" href="#main">
          跳到正文
        </a>
        {/*
          页面自己渲染 <SiteHeader /> / <main> / <SiteFooter />，
          header 和 footer 必须是 body 的直接子元素才拿得到
          banner / contentinfo 这两个 landmark —— 套在 <main> 里会全部失效。
        */}
        {children}
      </body>
    </html>
  );
}

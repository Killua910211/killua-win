import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.killua.win'),
  title: 'KILLUA.WIN — A quiet place for loud ideas',
  description: '一个正在生长的个人数字空间，收集作品、实验与有趣的未完成。',
  openGraph: {
    title: 'KILLUA.WIN — A quiet place for loud ideas',
    description: '一个正在生长的个人数字空间。',
    type: 'website',
    locale: 'zh_CN',
    url: 'https://www.killua.win',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'KILLUA.WIN' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KILLUA.WIN — A quiet place for loud ideas',
    description: '一个正在生长的个人数字空间。',
    images: ['/og.png'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { loadProfileFromEnv } from '@/lib/env-config';

// 从环境变量加载个人信息用于 SEO
const profile = loadProfileFromEnv();

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://portfolio.example.com'),
  title: {
    default: process.env.NEXT_PUBLIC_SITE_TITLE || "个人简介",
    template: `%s | ${process.env.NEXT_PUBLIC_SITE_NAME || "个人网站"}`,
  },
  description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION || "个人简介网站",
  keywords: process.env.NEXT_PUBLIC_SITE_KEYWORDS?.split(',') || [],
  authors: [{ name: process.env.NEXT_PUBLIC_SITE_NAME || "个人网站" }],
  creator: process.env.NEXT_PUBLIC_SITE_NAME || "个人网站",
  openGraph: {
    type: "website",
    locale: process.env.NEXT_PUBLIC_SITE_LOCALE || "zh_CN",
    url: "/",
    title: process.env.NEXT_PUBLIC_SITE_TITLE || "个人简介",
    description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION || "个人简介网站",
    siteName: process.env.NEXT_PUBLIC_SITE_NAME || "个人网站",
    images: [
      {
        url: process.env.NEXT_PUBLIC_OG_IMAGE || "/images/og-image.jpg",
        width: parseInt(process.env.NEXT_PUBLIC_OG_IMAGE_WIDTH || "1200"),
        height: parseInt(process.env.NEXT_PUBLIC_OG_IMAGE_HEIGHT || "630"),
        alt: process.env.NEXT_PUBLIC_SITE_NAME || "个人网站",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: process.env.NEXT_PUBLIC_SITE_TITLE || "个人简介",
    description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION || "个人简介网站",
    images: [process.env.NEXT_PUBLIC_OG_IMAGE || "/images/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
    other: {
      bing: process.env.NEXT_PUBLIC_BING_VERIFICATION || '',
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 结构化数据 (JSON-LD) - 从 profile.json 动态生成
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://shanshui.site/',
    sameAs: Object.values(profile.social),
    jobTitle: profile.title,
    description: profile.bio,
    email: profile.email,
  };

  return (
    <html lang="zh-CN">
      <head>
        {/* 结构化数据 */}
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* 防止深色模式闪烁 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme');
                if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col min-h-screen transition-colors">
        <Navigation />
        <main className="flex-1 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
        <Footer />
      </body>
    </html>
  );
}

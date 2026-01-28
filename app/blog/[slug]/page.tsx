/**
 * 博客文章详情页面
 * 
 * 功能：
 * - 使用getPostBySlug()加载文章
 * - 显示文章标题、日期、标签
 * - 使用MarkdownRenderer渲染内容
 * - 实现generateStaticParams()生成静态路径
 * - 添加返回博客列表的链接
 * 
 * 验证需求：5.2, 7.4, 12.4
 */

import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import Badge from '@/components/ui/Badge';
import FadeIn from '@/components/animations/FadeIn';
import { getAllPosts, getPostBySlug } from '@/lib/blog';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

/**
 * 生成静态路径
 */
export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

/**
 * 生成页面元数据
 */
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = getPostBySlug(params.slug);

  if (!post) {
    return {
      title: '文章未找到',
    };
  }

  return {
    title: post.title,
    description: post.description,
    keywords: post.tags,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      tags: post.tags,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  };
}

/**
 * 格式化日期
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * 估算阅读时间（基于字数）
 */
function estimateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.length;
  return Math.ceil(wordCount / wordsPerMinute);
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getPostBySlug(params.slug);

  // 如果文章不存在，显示404页面
  if (!post) {
    notFound();
  }

  const readingTime = estimateReadingTime(post.content);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://portfolio.example.com';

  // 结构化数据 (JSON-LD) for BlogPosting
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Person',
      name: 'Portfolio',
    },
    publisher: {
      '@type': 'Person',
      name: 'Portfolio',
    },
    keywords: post.tags.join(', '),
    url: `${baseUrl}/blog/${post.slug}`,
    image: post.coverImage ? `${baseUrl}${post.coverImage}` : undefined,
  };

  return (
    <>
      {/* 结构化数据 */}
      <Script
        id="blog-post-json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-4xl mx-auto">
        {/* 返回按钮 */}
        <FadeIn>
          <Link
            href="/blog"
            className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>返回博客列表</span>
          </Link>
        </FadeIn>

        {/* 文章头部 */}
        <FadeIn delay={0.1}>
          <article className="space-y-6">
            {/* 标题 */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
              {post.title}
            </h1>

            {/* 元信息 */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              {/* 发布日期 */}
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(post.date)}</span>
              </div>

              {/* 阅读时间 */}
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>{readingTime} 分钟阅读</span>
              </div>
            </div>

            {/* 标签 */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* 摘要 */}
            {post.description && (
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed border-l-4 border-blue-500 pl-4 py-2 bg-gray-50 dark:bg-gray-800">
                {post.description}
              </p>
            )}
          </article>
        </FadeIn>

        {/* 分隔线 */}
        <FadeIn delay={0.2}>
          <hr className="my-8 border-t-2 border-gray-200 dark:border-gray-700" />
        </FadeIn>

        {/* 文章内容 */}
        <FadeIn delay={0.3}>
          <div className="prose prose-lg max-w-none">
            <MarkdownRenderer content={post.content} />
          </div>
        </FadeIn>

        {/* 返回按钮（底部） */}
        <FadeIn delay={0.4}>
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <Link
              href="/blog"
              className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>返回博客列表</span>
            </Link>
          </div>
        </FadeIn>
      </div>
    </>
  );
}

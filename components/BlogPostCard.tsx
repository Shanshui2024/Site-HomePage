/**
 * BlogPostCard Component
 * 
 * 功能：
 * - 显示博客文章卡片
 * - 包含标题、摘要、日期、标签和封面图
 * - 点击卡片导航到文章详情
 * 
 * 验证需求：5.1, 5.2
 */

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import type { BlogPost } from '@/types';

interface BlogPostCardProps {
  post: BlogPost;
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

export default function BlogPostCard({ post }: BlogPostCardProps) {
  const readingTime = estimateReadingTime(post.content);

  return (
    <Link href={`/blog/${post.slug}`}>
      <Card hover className="h-full flex flex-col">
        {/* 封面图 */}
        {post.coverImage && (
          <div className="relative w-full h-48 rounded-t-lg overflow-hidden">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}

        <div className="flex flex-col flex-1 p-6">
          <CardHeader>
            {/* 标题 */}
            <CardTitle className="line-clamp-2 hover:text-primary-600 transition-colors">
              {post.title}
            </CardTitle>

            {/* 摘要 */}
            <CardDescription className="line-clamp-3 mt-2">
              {post.description}
            </CardDescription>
          </CardHeader>

          <CardContent className="flex-1">
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
          </CardContent>

          <CardFooter className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            {/* 发布日期 */}
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(post.date)}</span>
            </div>

            {/* 阅读时间 */}
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{readingTime} 分钟</span>
            </div>
          </CardFooter>
        </div>
      </Card>
    </Link>
  );
}

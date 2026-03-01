'use client';

/**
 * 博客列表客户端组件
 * 
 * 处理客户端交互（标签筛选）
 */

import React, { useState, useMemo } from 'react';
import { BookOpen, ExternalLink, AlertTriangle } from 'lucide-react';
import BlogPostCard from '@/components/BlogPostCard';
import TagFilter from '@/components/TagFilter';
import FadeIn from '@/components/animations/FadeIn';
import Card from '@/components/ui/Card';
import type { BlogPost } from '@/types';

interface BlogListClientProps {
  allPosts: BlogPost[];
  allTags: string[];
}

export default function BlogListClient({ allPosts, allTags }: BlogListClientProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // 根据选中的标签筛选文章
  const filteredPosts = useMemo(() => {
    if (!selectedTag) {
      return allPosts;
    }
    return allPosts.filter((post) => post.tags.includes(selectedTag));
  }, [allPosts, selectedTag]);

  return (
    <div className="space-y-8">
      {/* 新博客地址通知 */}
      <FadeIn>
        <Card className="bg-gradient-to-br from-yellow-50 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20 border-2 border-yellow-200 dark:border-yellow-800">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">重要通知</h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300">
              我的博客已经迁移到新的独立站点，欢迎访问获取最新内容！
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-4">
              <a
                href="https://blog.shanshui.site"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors shadow-md hover:shadow-lg"
              >
                访问新博客
                <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            </div>
          </div>
        </Card>
      </FadeIn>

      {/* 页面标题 */}
      <FadeIn delay={0.1}>
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100">
            博客
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            分享技术心得、学习笔记和开发经验
          </p>
        </div>
      </FadeIn>

      {/* 标签筛选 */}
      {allTags.length > 0 && (
        <FadeIn delay={0.2}>
          <div className="flex justify-center">
            <TagFilter
              tags={allTags}
              selectedTag={selectedTag}
              onTagSelect={setSelectedTag}
            />
          </div>
        </FadeIn>
      )}

      {/* 文章列表 */}
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post, index) => (
            <FadeIn key={post.slug} delay={0.3 + index * 0.05}>
              <BlogPostCard post={post} />
            </FadeIn>
          ))}
        </div>
      ) : (
        /* 空状态 */
        <FadeIn delay={0.3}>
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <BookOpen className="w-12 h-12 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {selectedTag ? '没有找到相关文章' : '暂无文章'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
              {selectedTag
                ? `标签 &ldquo;${selectedTag}&rdquo; 下暂时没有文章，试试其他标签吧！`
                : '还没有发布任何文章，敬请期待！'}
            </p>
            {selectedTag && (
              <button
                onClick={() => setSelectedTag(null)}
                className="mt-4 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                查看全部文章
              </button>
            )}
          </div>
        </FadeIn>
      )}

      {/* 文章统计 */}
      {filteredPosts.length > 0 && (
        <FadeIn delay={0.4}>
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            {selectedTag ? (
              <p>
                标签 &ldquo;{selectedTag}&rdquo; 下共有 {filteredPosts.length} 篇文章
              </p>
            ) : (
              <p>共有 {allPosts.length} 篇文章</p>
            )}
          </div>
        </FadeIn>
      )}
    </div>
  );
}

'use client';

/**
 * FriendLinkCard Component
 * 
 * 功能：
 * - 显示友链卡片
 * - 包含头像、名称、描述
 * - 链接在新标签页打开（target="_blank" rel="noopener noreferrer"）
 * - 添加悬停动画效果
 * - 头像加载失败时显示默认图标
 * 
 * 验证需求：6.2, 6.3
 */

import React, { useState } from 'react';
import Image from 'next/image';
import { ExternalLink, Link as LinkIcon } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import type { FriendLink } from '@/types';

interface FriendLinkCardProps {
  link: FriendLink;
}

export default function FriendLinkCard({ link }: FriendLinkCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block h-full"
    >
      <Card hover className="h-full">
        <div className="flex items-start space-x-4">
          {/* 头像 */}
          <div className="relative w-16 h-16 flex-shrink-0 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
            {!imageError ? (
              <Image
                src={link.avatar}
                alt={link.name}
                fill
                sizes="64px"
                className="object-cover"
                loading="lazy"
                quality={75}
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200">
                <LinkIcon className="w-8 h-8 text-primary-600" />
              </div>
            )}
          </div>

          {/* 内容 */}
          <div className="flex-1 min-w-0">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg truncate">
                  {link.name}
                </CardTitle>
                <ExternalLink className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0 ml-2" />
              </div>
              <CardDescription className="line-clamp-2">
                {link.description}
              </CardDescription>
            </CardHeader>
          </div>
        </div>
      </Card>
    </a>
  );
}

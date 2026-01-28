'use client';

/**
 * TagFilter Component
 * 
 * 功能：
 * - 显示所有可用标签
 * - 点击标签筛选文章
 * - 高亮当前选中的标签
 * 
 * 验证需求：5.3
 */

import React from 'react';
import Badge from '@/components/ui/Badge';

interface TagFilterProps {
  tags: string[];
  selectedTag: string | null;
  onTagSelect: (tag: string | null) => void;
}

export default function TagFilter({ tags, selectedTag, onTagSelect }: TagFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 items-center">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">筛选标签：</span>
      
      {/* "全部"按钮 */}
      <button
        onClick={() => onTagSelect(null)}
        className={`
          px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
          ${
            selectedTag === null
              ? 'bg-primary-600 text-white shadow-md'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }
        `}
      >
        全部
      </button>

      {/* 标签按钮 */}
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => onTagSelect(tag)}
          className={`
            px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
            ${
              selectedTag === tag
                ? 'bg-primary-600 text-white shadow-md'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }
          `}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}

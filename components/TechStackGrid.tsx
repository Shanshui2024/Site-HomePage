'use client';

/**
 * TechStackGrid Component
 * 
 * 功能：
 * - 按类别分组显示技术栈
 * - 每个技术项显示图标和名称
 * - 悬停时显示熟练度级别
 * - 使用渐入动画
 * 
 * 验证需求：4.1, 4.2, 4.3
 */

import React, { useState } from 'react';
import { Code2 } from 'lucide-react';
import FadeIn from '@/components/animations/FadeIn';
import type { TechCategory, TechItem } from '@/types';

interface TechStackGridProps {
  categories: TechCategory[];
}

// 熟练度级别的中文映射和颜色
const levelConfig = {
  beginner: { label: '初学者', color: 'bg-gray-100 text-gray-700' },
  intermediate: { label: '中级', color: 'bg-blue-100 text-blue-700' },
  advanced: { label: '高级', color: 'bg-green-100 text-green-700' },
  expert: { label: '专家', color: 'bg-purple-100 text-purple-700' },
};

/**
 * 技术项卡片组件
 */
function TechItemCard({ item }: { item: TechItem }) {
  const [isHovered, setIsHovered] = useState(false);
  const levelInfo = levelConfig[item.level];

  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-200 hover:shadow-md hover:border-blue-300 hover:-translate-y-1 cursor-pointer">
        {/* 技术图标 */}
        <div className="w-16 h-16 mb-3 flex items-center justify-center">
          {/* 使用简单的图标占位符，实际项目中可以使用真实的技术图标 */}
          <div className="w-full h-full rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
            <Code2 className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        {/* 技术名称 */}
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 text-center">
          {item.name}
        </h3>

        {/* 熟练度级别 - 悬停时显示 */}
        {isHovered && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/95 dark:bg-gray-800/95 rounded-lg border-2 border-blue-400 transition-all duration-200">
            <div className={`px-4 py-2 rounded-full text-sm font-medium ${levelInfo.color}`}>
              {levelInfo.label}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * 技术栈网格组件
 */
export default function TechStackGrid({ categories }: TechStackGridProps) {
  return (
    <div className="space-y-12">
      {categories.map((category, categoryIndex) => (
        <FadeIn key={category.name} delay={categoryIndex * 0.1}>
          <div>
            {/* 类别标题 */}
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 pb-2 border-b-2 border-blue-500">
              {category.name}
            </h2>

            {/* 技术项网格 */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {category.items.map((item, itemIndex) => (
                <FadeIn key={item.name} delay={categoryIndex * 0.1 + itemIndex * 0.05}>
                  <TechItemCard item={item} />
                </FadeIn>
              ))}
            </div>
          </div>
        </FadeIn>
      ))}
    </div>
  );
}

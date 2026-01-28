'use client';

/**
 * Timeline Component
 * 
 * 功能：
 * - 展示个人成就和经历的时间线
 * - 使用垂直时间线布局
 * - 添加滚动触发的动画
 * 
 * 验证需求：7.5
 */

import React from 'react';
import { Circle } from 'lucide-react';
import FadeIn from '@/components/animations/FadeIn';

interface TimelineItem {
  year: string;
  event: string;
}

interface TimelineProps {
  items: TimelineItem[];
}

export default function Timeline({ items }: TimelineProps) {
  return (
    <div className="relative">
      {/* 时间线主线 */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-500 to-primary-200" />

      {/* 时间线项目 */}
      <div className="space-y-8">
        {items.map((item, index) => (
          <FadeIn key={`${item.year}-${index}`} delay={index * 0.1}>
            <div className="relative flex items-start space-x-6">
              {/* 时间点 */}
              <div className="relative z-10 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-white dark:bg-gray-800 border-4 border-blue-500 flex items-center justify-center shadow-lg">
                  <Circle className="w-6 h-6 text-blue-600 fill-current" />
                </div>
              </div>

              {/* 内容卡片 */}
              <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                  {/* 年份 */}
                  <h3 className="text-2xl font-bold text-primary-600">
                    {item.year}
                  </h3>
                </div>

                {/* 事件描述 */}
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {item.event}
                </p>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  );
}

import type { Metadata } from 'next';
import TechStackGrid from '@/components/TechStackGrid';
import { loadConfig } from '@/lib/config';
import { techStackSchema, type TechStackData } from '@/types';

/**
 * 技术栈页面
 * 
 * 功能：
 * - 加载tech-stack.json数据
 * - 使用TechStackGrid组件展示技术栈
 * - 添加页面标题和描述
 * 
 * 验证需求：4.1
 */

export const metadata: Metadata = {
  title: '技术栈',
  description: '查看我掌握的技术和工具，包括前端、后端和开发工具',
};

export default function TechStackPage() {
  // 加载技术栈数据
  const techStackData: TechStackData = loadConfig('data/tech-stack.json', techStackSchema);

  return (
    <div className="space-y-8">
      {/* 页面标题和描述 */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100">
          技术栈
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          这里展示了我掌握的技术和工具。悬停在技术图标上可以查看我的熟练度级别。
        </p>
      </div>

      {/* 技术栈网格 */}
      <TechStackGrid categories={techStackData.categories} />
    </div>
  );
}

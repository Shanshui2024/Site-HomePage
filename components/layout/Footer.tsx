/**
 * 页脚组件
 * 
 * 显示版权信息和社交链接
 * 从 profile.json 读取社交链接数据，保持与首页一致
 * 验证需求：3.5
 */

import Link from 'next/link';
import { Mail } from 'lucide-react';
import { Github } from 'lucide-react';
import BilibiliIcon from '@/components/icons/BilibiliIcon';
import QQIcon from '@/components/icons/QQIcon';
import { loadProfileFromEnv } from '@/lib/env-config';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  // 从环境变量加载数据
  const profile = loadProfileFromEnv();

  // 社交图标映射
  const socialIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    github: Github,
    bilibili: BilibiliIcon,
    qq: QQIcon,
  };

  // 社交链接配置（从 profile.json 动态生成）
  const socialLinks = [
    ...Object.entries(profile.social).map(([platform, url]) => ({
      name: platform.charAt(0).toUpperCase() + platform.slice(1),
      href: url,
      icon: socialIconMap[platform],
      ariaLabel: `访问 ${platform.charAt(0).toUpperCase() + platform.slice(1)} 主页`,
    })).filter(link => link.icon), // 只保留有图标的平台
    {
      name: 'Email',
      href: `mailto:${profile.email}`,
      icon: Mail,
      ariaLabel: '发送邮件',
    },
  ];

  return (
    <footer className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center space-y-4">
          {/* 社交链接 */}
          <div className="flex items-center space-x-4">
            {socialLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  aria-label={link.ariaLabel}
                >
                  <Icon className="w-5 h-5" />
                </a>
              );
            })}
          </div>

          {/* 版权信息 */}
          <div className="text-center text-sm text-gray-600 dark:text-gray-300">
            <p>© 2026 - {currentYear} Shanshui-山重水复. All rights reserved.</p>
            <p className="mt-1">
              Built with{' '}
              <Link 
                href="https://nextjs.org" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 hover:underline"
              >
                Next.js
              </Link>
              {' '}and{' '}
              <Link 
                href="https://tailwindcss.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 hover:underline"
              >
                Tailwind CSS
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

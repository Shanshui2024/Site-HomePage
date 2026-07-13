'use client';

/**
 * 导航组件
 * 
 * 实现桌面端导航栏，显示所有页面链接
 * 验证需求：1.2, 1.4, 1.5
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { NavItem } from '@/types';
import MobileMenu from './MobileMenu';
import ThemeSwitcher from '@/components/ThemeSwitcher';

// 导航项配置
const navItems: NavItem[] = [
  { label: '首页', href: '/' },
  { label: '技术栈', href: '/tech-stack' },
  { label: '博客', href: 'https://blog.shanshui.site/' },
  { label: '友链', href: '/friends' },
  { label: '关于', href: '/about' },
];

export default function Navigation() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 判断链接是否为当前激活页面
  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo/Brand */}
            <Link 
              href="/" 
              className="text-xl font-bold text-gray-900 dark:text-white hover:opacity-80 transition-opacity"
            >
              Shanshui-山重水复
            </Link>

            {/* 桌面端导航 - 在移动端隐藏 */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const active = isActive(item.href);
                const isExternal = item.href.startsWith('http');
                const linkClass = `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
                }`;

                if (isExternal) {
                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={linkClass}
                    >
                      {item.label}
                    </a>
                  );
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={linkClass}
                  >
                    {item.label}
                  </Link>
                );
              })}
              
              {/* 主题切换器 */}
              <div className="ml-4">
                <ThemeSwitcher />
              </div>
            </div>

            {/* 移动端右侧按钮组 */}
            <div className="md:hidden flex items-center gap-2">
              <ThemeSwitcher />
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="打开菜单"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 移动端菜单 */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        currentPath={pathname}
      />

      {/* 占位元素，防止内容被固定导航遮挡 */}
      <div className="h-16" />
    </>
  );
}

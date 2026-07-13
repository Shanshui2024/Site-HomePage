'use client';

/**
 * 移动端汉堡菜单组件
 * 
 * 实现移动端菜单，使用framer-motion实现展开/收起动画
 * 点击菜单项后自动关闭
 * 验证需求：1.5
 */

import React, { useEffect } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MobileMenuProps, NavItem } from '@/types';

// 导航项配置（与Navigation组件保持一致）
const navItems: NavItem[] = [
  { label: '首页', href: '/' },
  { label: '技术栈', href: '/tech-stack' },
  { label: '博客', href: 'https://blog.shanshui.site/' },
  { label: '友链', href: '/friends' },
  { label: '关于', href: '/about' },
];

export default function MobileMenu({ isOpen, onClose, currentPath }: MobileMenuProps) {
  // 判断链接是否为当前激活页面
  const isActive = (href: string) => {
    if (href === '/') {
      return currentPath === '/';
    }
    return currentPath.startsWith(href);
  };

  // 当菜单打开时，禁止body滚动
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // 点击菜单项后关闭菜单
  const handleLinkClick = () => {
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50 md:hidden"
          />

          {/* 菜单面板 */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ 
              type: 'spring', 
              damping: 25, 
              stiffness: 200,
              duration: 0.3 
            }}
            className="fixed top-0 right-0 bottom-0 w-64 bg-white dark:bg-gray-800 shadow-2xl z-50 md:hidden transition-colors"
          >
            {/* 菜单头部 */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">菜单</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="关闭菜单"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* 菜单项列表 */}
            <nav className="p-4">
              <ul className="space-y-2">
                {navItems.map((item, index) => {
                  const isExternal = item.href.startsWith('http');
                  const linkClass = `block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                    isActive(item.href)
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
                  }`;

                  return (
                    <motion.li
                      key={item.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.2 }}
                    >
                      {isExternal ? (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={handleLinkClick}
                          className={linkClass}
                        >
                          {item.label}
                        </a>
                      ) : (
                        <Link
                          href={item.href}
                          onClick={handleLinkClick}
                          className={linkClass}
                        >
                          {item.label}
                        </Link>
                      )}
                    </motion.li>
                  );
                })}
              </ul>
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

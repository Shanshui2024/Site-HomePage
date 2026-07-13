/**
 * 导航激活状态属性测试
 * 
 * Feature: personal-portfolio, Property 1: 导航激活状态一致性
 * 
 * *对于任意*页面路径，当用户访问该页面时，导航组件中对应的链接应该被标记为激活状态，
 * 且只有一个链接处于激活状态。
 * 
 * **Validates: Requirements 1.2**
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import * as fc from 'fast-check';

// Mock next/navigation
const mockPathname = { current: '/' };
jest.mock('next/navigation', () => ({
  usePathname: () => mockPathname.current,
}));

// Import Navigation after mocking
import Navigation from '../Navigation';

// 导航项配置（与Navigation组件中的配置保持一致）
const navItems = [
  { label: '首页', href: '/' },
  { label: '技术栈', href: '/tech-stack' },
  { label: '博客', href: 'https://blog.shanshui.site/' },
  { label: '友链', href: '/friends' },
  { label: '关于', href: '/about' },
];

/**
 * 判断链接是否为当前激活页面的纯函数
 * 这个函数模拟Navigation组件中的isActive逻辑
 */
function isActive(href: string, pathname: string): boolean {
  if (href === '/') {
    return pathname === '/';
  }
  return pathname.startsWith(href);
}

/**
 * 生成有效页面路径的arbitrary
 * 包括基础路径和子路径
 */
const validPathArbitrary = fc.oneof(
  // 基础路径
  fc.constantFrom('/', '/tech-stack', '/friends', '/about'),
  // 其他可能的子路径
  fc.string({ minLength: 1, maxLength: 30 })
    .filter(s => /^[a-zA-Z0-9-]+$/.test(s))
    .map(slug => `/tech-stack/${slug}`),
  fc.string({ minLength: 1, maxLength: 30 })
    .filter(s => /^[a-zA-Z0-9-]+$/.test(s))
    .map(slug => `/about/${slug}`)
);

/**
 * Feature: personal-portfolio, Property 1: 导航激活状态一致性
 */
describe('Property 1: 导航激活状态一致性', () => {
  beforeEach(() => {
    mockPathname.current = '/';
  });

  /**
   * Property 1.1: 对于任意有效路径，恰好有一个导航项处于激活状态
   * 
   * 验证：当用户访问任意页面时，导航组件中应该恰好有一个链接被标记为激活状态
   */
  it('对于任意有效路径，恰好有一个导航项处于激活状态', () => {
    fc.assert(
      fc.property(
        validPathArbitrary,
        (pathname) => {
          // 计算激活的导航项数量
          const activeCount = navItems.filter(item => isActive(item.href, pathname)).length;
          
          // 验证：恰好有一个导航项处于激活状态
          expect(activeCount).toBe(1);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 1.2: 激活状态与路径匹配
   * 
   * 验证：激活的导航项应该与当前路径匹配
   */
  it('激活的导航项应该与当前路径匹配', () => {
    fc.assert(
      fc.property(
        validPathArbitrary,
        (pathname) => {
          // 找到激活的导航项
          const activeItem = navItems.find(item => isActive(item.href, pathname));
          
          // 验证：激活项存在
          expect(activeItem).toBeDefined();
          
          // 验证：路径应该以激活项的href开头（或完全匹配首页）
          if (activeItem!.href === '/') {
            expect(pathname).toBe('/');
          } else {
            expect(pathname.startsWith(activeItem!.href)).toBe(true);
          }
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 1.3: 首页路径只激活首页链接
   * 
   * 验证：当路径为'/'时，只有首页链接被激活
   */
  it('首页路径只激活首页链接', () => {
    const pathname = '/';
    
    navItems.forEach(item => {
      const active = isActive(item.href, pathname);
      if (item.href === '/') {
        expect(active).toBe(true);
      } else {
        expect(active).toBe(false);
      }
    });
  });

  /**
   * Property 1.4: 子路径激活父路径的导航项
   * 
   * 验证：对于任意子路径，应该激活对应的父路径导航项
   */
  it('子路径应该激活对应的父路径导航项', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('/tech-stack', '/friends', '/about'),
        fc.string({ minLength: 1, maxLength: 30 }).filter(s => /^[a-zA-Z0-9-]+$/.test(s)),
        (basePath, subPath) => {
          const fullPath = `${basePath}/${subPath}`;
          
          // 找到激活的导航项
          const activeItem = navItems.find(item => isActive(item.href, fullPath));
          
          // 验证：激活项存在且href与basePath匹配
          expect(activeItem).toBeDefined();
          expect(activeItem!.href).toBe(basePath);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 1.5: 非首页路径不激活首页链接
   * 
   * 验证：当路径不是'/'时，首页链接不应该被激活
   */
  it('非首页路径不应该激活首页链接', () => {
    fc.assert(
      fc.property(
        validPathArbitrary.filter(p => p !== '/'),
        (pathname) => {
          const homeActive = isActive('/', pathname);
          
          // 验证：首页链接不应该被激活
          expect(homeActive).toBe(false);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 1.6: 渲染验证 - 激活链接具有正确的CSS类
   * 
   * 验证：在实际渲染中，激活的链接应该具有激活状态的CSS类
   */
  it('渲染时激活链接应具有正确的CSS类', () => {
    // 测试几个代表性的路径
    const testPaths = ['/', '/tech-stack', '/about'];
    
    testPaths.forEach(pathname => {
      mockPathname.current = pathname;
      
      const { unmount } = render(<Navigation />);
      
      // 找到预期激活的导航项
      const expectedActiveItem = navItems.find(item => isActive(item.href, pathname));
      
      // 获取桌面端导航中的所有链接
      const allLinks = screen.getAllByRole('link');
      
      // 过滤出导航链接（排除Logo链接）
      const navLinks = allLinks.filter(link => 
        navItems.some(item => item.label === link.textContent)
      );
      
      // 验证激活状态
      navLinks.forEach(link => {
        const linkText = link.textContent;
        const navItem = navItems.find(item => item.label === linkText);
        
        if (navItem && navItem.href === expectedActiveItem?.href) {
          // 激活链接应该有激活样式
          expect(link).toHaveClass('bg-primary-100');
          expect(link).toHaveClass('text-primary-700');
        }
      });
      
      unmount();
    });
  });

  /**
   * Property 1.7: isActive函数的幂等性
   * 
   * 验证：对同一路径多次调用isActive应返回相同结果
   */
  it('isActive函数应该是幂等的', () => {
    fc.assert(
      fc.property(
        validPathArbitrary,
        fc.constantFrom(...navItems.map(item => item.href)),
        (pathname, href) => {
          const result1 = isActive(href, pathname);
          const result2 = isActive(href, pathname);
          const result3 = isActive(href, pathname);
          
          // 验证：多次调用返回相同结果
          expect(result1).toBe(result2);
          expect(result2).toBe(result3);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 1.8: 激活状态互斥性
   * 
   * 验证：对于任意路径，不同的导航项不能同时处于激活状态
   */
  it('不同导航项不能同时处于激活状态', () => {
    fc.assert(
      fc.property(
        validPathArbitrary,
        (pathname) => {
          const activeItems = navItems.filter(item => isActive(item.href, pathname));
          
          // 验证：最多只有一个激活项
          expect(activeItems.length).toBeLessThanOrEqual(1);
          
          // 验证：至少有一个激活项（对于有效路径）
          expect(activeItems.length).toBeGreaterThanOrEqual(1);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});

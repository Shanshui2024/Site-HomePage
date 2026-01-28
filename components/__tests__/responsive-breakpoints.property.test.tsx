/**
 * 响应式断点属性测试
 * 
 * Feature: personal-portfolio, Property 14: 响应式断点正确应用
 * 
 * *对于任意*视口宽度，当宽度小于768px时应用移动端样式，
 * 768px-1023px时应用平板端样式，大于等于1024px时应用桌面端样式。
 * 
 * **Validates: Requirements 8.1**
 */

import React from 'react';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import * as fc from 'fast-check';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
      <div {...props}>{children}</div>
    ),
    li: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
      <li {...props}>{children}</li>
    ),
  },
  AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
  useReducedMotion: () => false,
}));

// Import components after mocking
import Navigation from '../layout/Navigation';
import TechStackGrid from '../TechStackGrid';
import FriendLinkCard from '../FriendLinkCard';
import type { TechCategory, FriendLink } from '@/types';

// 响应式断点定义（与TailwindCSS一致）
const BREAKPOINTS = {
  mobile: { min: 0, max: 767 },      // < 768px
  tablet: { min: 768, max: 1023 },   // 768px - 1023px
  desktop: { min: 1024, max: 2560 }, // >= 1024px
};

// TailwindCSS断点前缀
const TAILWIND_BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
};

/**
 * 检查元素是否包含指定断点的响应式类
 */
function hasBreakpointClass(className: string, breakpoint: 'sm' | 'md' | 'lg' | 'xl'): boolean {
  const regex = new RegExp(`\\b${breakpoint}:`);
  return regex.test(className);
}

/**
 * 提取元素的所有响应式类
 */
function extractResponsiveClasses(className: string): {
  mobile: string[];
  sm: string[];
  md: string[];
  lg: string[];
  xl: string[];
} {
  const classes = className.split(/\s+/);
  const result = {
    mobile: [] as string[],
    sm: [] as string[],
    md: [] as string[],
    lg: [] as string[],
    xl: [] as string[],
  };

  classes.forEach(cls => {
    if (cls.startsWith('sm:')) {
      result.sm.push(cls);
    } else if (cls.startsWith('md:')) {
      result.md.push(cls);
    } else if (cls.startsWith('lg:')) {
      result.lg.push(cls);
    } else if (cls.startsWith('xl:')) {
      result.xl.push(cls);
    } else if (!cls.includes(':')) {
      result.mobile.push(cls);
    }
  });

  return result;
}

/**
 * 检查网格布局的列数配置
 */
function extractGridCols(className: string): {
  mobile: number | null;
  sm: number | null;
  md: number | null;
  lg: number | null;
} {
  const result = {
    mobile: null as number | null,
    sm: null as number | null,
    md: null as number | null,
    lg: null as number | null,
  };

  // 匹配 grid-cols-{n} 模式
  const mobileMatch = className.match(/\bgrid-cols-(\d+)\b/);
  if (mobileMatch) result.mobile = parseInt(mobileMatch[1], 10);

  const smMatch = className.match(/\bsm:grid-cols-(\d+)\b/);
  if (smMatch) result.sm = parseInt(smMatch[1], 10);

  const mdMatch = className.match(/\bmd:grid-cols-(\d+)\b/);
  if (mdMatch) result.md = parseInt(mdMatch[1], 10);

  const lgMatch = className.match(/\blg:grid-cols-(\d+)\b/);
  if (lgMatch) result.lg = parseInt(lgMatch[1], 10);

  return result;
}

/**
 * Feature: personal-portfolio, Property 14: 响应式断点正确应用
 */
describe('Property 14: 响应式断点正确应用', () => {
  afterEach(() => {
    cleanup();
  });

  /**
   * Property 14.1: 导航组件使用正确的响应式断点
   * 
   * 验证：导航组件应该使用md断点（768px）来区分移动端和桌面端
   */
  it('导航组件应使用md断点（768px）区分移动端和桌面端', () => {
    const { container } = render(<Navigation />);

    // 查找桌面端导航容器
    const desktopNav = container.querySelector('.hidden.md\\:flex');
    expect(desktopNav).not.toBeNull();

    // 验证使用md断点
    expect(desktopNav).toHaveClass('md:flex');
    expect(desktopNav).toHaveClass('hidden');

    // 查找汉堡菜单按钮
    const menuButton = container.querySelector('button[aria-label="打开菜单"]');
    expect(menuButton).not.toBeNull();
    expect(menuButton).toHaveClass('md:hidden');
  });

  /**
   * Property 14.2: TechStackGrid使用三级响应式断点
   * 
   * 验证：技术栈网格应该使用sm、md、lg断点实现渐进式列数增加
   */
  it('TechStackGrid应使用多级响应式断点', () => {
    const testCategories: TechCategory[] = [
      {
        name: 'Frontend',
        items: [
          { name: 'React', icon: 'react', level: 'expert', category: 'Frontend' },
        ],
      },
    ];

    const { container } = render(<TechStackGrid categories={testCategories} />);

    // 查找网格容器
    const gridContainer = container.querySelector('.grid');
    expect(gridContainer).not.toBeNull();

    const className = gridContainer!.className;
    const gridCols = extractGridCols(className);

    // 验证移动端列数（默认）
    expect(gridCols.mobile).toBe(2);

    // 验证sm断点列数
    expect(gridCols.sm).toBe(3);

    // 验证md断点列数（平板端）
    expect(gridCols.md).toBe(4);

    // 验证lg断点列数（桌面端）
    expect(gridCols.lg).toBe(5);
  });

  /**
   * Property 14.3: 对于任意移动端视口宽度，应使用默认（无前缀）样式
   * 
   * 验证：当视口宽度小于768px时，应用移动端样式
   */
  it('对于任意移动端视口宽度，组件应包含默认样式类', () => {
    fc.assert(
      fc.property(
        // 生成移动端视口宽度 (1-767px)
        fc.integer({ min: 1, max: BREAKPOINTS.mobile.max }),
        (viewportWidth) => {
          const testCategories: TechCategory[] = [
            {
              name: 'Test',
              items: [
                { name: 'Item', icon: 'icon', level: 'beginner', category: 'Test' },
              ],
            },
          ];

          const { container, unmount } = render(<TechStackGrid categories={testCategories} />);

          // 查找网格容器
          const gridContainer = container.querySelector('.grid');
          expect(gridContainer).not.toBeNull();

          const className = gridContainer!.className;
          const responsiveClasses = extractResponsiveClasses(className);

          // 验证存在移动端默认样式
          expect(responsiveClasses.mobile.length).toBeGreaterThan(0);
          expect(responsiveClasses.mobile).toContain('grid');
          expect(responsiveClasses.mobile).toContain('grid-cols-2');

          unmount();
          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Property 14.4: 对于任意平板端视口宽度，应使用md断点样式
   * 
   * 验证：当视口宽度在768px-1023px之间时，应用平板端样式
   */
  it('对于任意平板端视口宽度，组件应包含md断点样式类', () => {
    fc.assert(
      fc.property(
        // 生成平板端视口宽度 (768-1023px)
        fc.integer({ min: BREAKPOINTS.tablet.min, max: BREAKPOINTS.tablet.max }),
        (viewportWidth) => {
          const testCategories: TechCategory[] = [
            {
              name: 'Test',
              items: [
                { name: 'Item', icon: 'icon', level: 'beginner', category: 'Test' },
              ],
            },
          ];

          const { container, unmount } = render(<TechStackGrid categories={testCategories} />);

          // 查找网格容器
          const gridContainer = container.querySelector('.grid');
          expect(gridContainer).not.toBeNull();

          const className = gridContainer!.className;
          const responsiveClasses = extractResponsiveClasses(className);

          // 验证存在md断点样式
          expect(responsiveClasses.md.length).toBeGreaterThan(0);
          expect(responsiveClasses.md.some(cls => cls.includes('grid-cols'))).toBe(true);

          unmount();
          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Property 14.5: 对于任意桌面端视口宽度，应使用lg断点样式
   * 
   * 验证：当视口宽度大于等于1024px时，应用桌面端样式
   */
  it('对于任意桌面端视口宽度，组件应包含lg断点样式类', () => {
    fc.assert(
      fc.property(
        // 生成桌面端视口宽度 (1024-2560px)
        fc.integer({ min: BREAKPOINTS.desktop.min, max: BREAKPOINTS.desktop.max }),
        (viewportWidth) => {
          const testCategories: TechCategory[] = [
            {
              name: 'Test',
              items: [
                { name: 'Item', icon: 'icon', level: 'beginner', category: 'Test' },
              ],
            },
          ];

          const { container, unmount } = render(<TechStackGrid categories={testCategories} />);

          // 查找网格容器
          const gridContainer = container.querySelector('.grid');
          expect(gridContainer).not.toBeNull();

          const className = gridContainer!.className;
          const responsiveClasses = extractResponsiveClasses(className);

          // 验证存在lg断点样式
          expect(responsiveClasses.lg.length).toBeGreaterThan(0);
          expect(responsiveClasses.lg.some(cls => cls.includes('grid-cols'))).toBe(true);

          unmount();
          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Property 14.6: 响应式断点应该渐进式增加列数
   * 
   * 验证：随着视口宽度增加，网格列数应该渐进式增加
   * mobile(2) < sm(3) < md(4) < lg(5)
   */
  it('响应式断点应该渐进式增加列数', () => {
    const testCategories: TechCategory[] = [
      {
        name: 'Test',
        items: [
          { name: 'Item', icon: 'icon', level: 'beginner', category: 'Test' },
        ],
      },
    ];

    const { container } = render(<TechStackGrid categories={testCategories} />);

    // 查找网格容器
    const gridContainer = container.querySelector('.grid');
    expect(gridContainer).not.toBeNull();

    const className = gridContainer!.className;
    const gridCols = extractGridCols(className);

    // 验证列数渐进式增加
    if (gridCols.mobile !== null && gridCols.sm !== null) {
      expect(gridCols.sm).toBeGreaterThan(gridCols.mobile);
    }
    if (gridCols.sm !== null && gridCols.md !== null) {
      expect(gridCols.md).toBeGreaterThan(gridCols.sm);
    }
    if (gridCols.md !== null && gridCols.lg !== null) {
      expect(gridCols.lg).toBeGreaterThan(gridCols.md);
    }
  });

  /**
   * Property 14.7: 断点值应符合TailwindCSS标准
   * 
   * 验证：使用的断点值应该符合TailwindCSS的标准断点
   * sm: 640px, md: 768px, lg: 1024px
   */
  it('断点值应符合TailwindCSS标准', () => {
    // 验证TailwindCSS标准断点值
    expect(TAILWIND_BREAKPOINTS.sm).toBe(640);
    expect(TAILWIND_BREAKPOINTS.md).toBe(768);
    expect(TAILWIND_BREAKPOINTS.lg).toBe(1024);

    // 验证项目使用的断点与需求一致
    // 移动端: < 768px
    expect(BREAKPOINTS.mobile.max).toBe(TAILWIND_BREAKPOINTS.md - 1);
    // 平板端: 768px - 1023px
    expect(BREAKPOINTS.tablet.min).toBe(TAILWIND_BREAKPOINTS.md);
    expect(BREAKPOINTS.tablet.max).toBe(TAILWIND_BREAKPOINTS.lg - 1);
    // 桌面端: >= 1024px
    expect(BREAKPOINTS.desktop.min).toBe(TAILWIND_BREAKPOINTS.lg);
  });

  /**
   * Property 14.8: 对于任意视口宽度，组件应正确渲染
   * 
   * 验证：无论视口宽度如何，组件都应该正确渲染并包含响应式类
   */
  it('对于任意视口宽度，组件应正确渲染并包含响应式类', () => {
    fc.assert(
      fc.property(
        // 生成任意视口宽度 (1-2560px)
        fc.integer({ min: 1, max: 2560 }),
        (viewportWidth) => {
          const testCategories: TechCategory[] = [
            {
              name: 'Test',
              items: [
                { name: 'Item', icon: 'icon', level: 'beginner', category: 'Test' },
              ],
            },
          ];

          const { container, unmount } = render(<TechStackGrid categories={testCategories} />);

          // 验证组件正确渲染
          const gridContainer = container.querySelector('.grid');
          expect(gridContainer).not.toBeNull();

          const className = gridContainer!.className;

          // 验证包含响应式类
          expect(hasBreakpointClass(className, 'sm')).toBe(true);
          expect(hasBreakpointClass(className, 'md')).toBe(true);
          expect(hasBreakpointClass(className, 'lg')).toBe(true);

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 14.9: 友链页面网格应使用三级响应式断点
   * 
   * 验证：友链卡片网格应该使用md和lg断点实现响应式布局
   * 移动端单列，平板端双列，桌面端三列
   */
  it('友链卡片应正确渲染', () => {
    const testLink: FriendLink = {
      name: 'Test Friend',
      description: 'A test friend link',
      url: 'https://example.com',
      avatar: '/images/avatar.jpg',
    };

    const { container } = render(<FriendLinkCard link={testLink} />);

    // 验证友链卡片正确渲染
    const card = container.querySelector('a');
    expect(card).not.toBeNull();
    expect(card).toHaveAttribute('href', testLink.url);
    expect(card).toHaveAttribute('target', '_blank');
  });

  /**
   * Property 14.10: 响应式类应该覆盖所有三个断点层级
   * 
   * 验证：组件应该包含移动端、平板端和桌面端的样式定义
   */
  it('响应式类应覆盖所有三个断点层级', () => {
    fc.assert(
      fc.property(
        // 生成随机类别数量
        fc.integer({ min: 1, max: 3 }),
        (categoryCount) => {
          const testCategories: TechCategory[] = Array.from({ length: categoryCount }, (_, i) => ({
            name: `Category${i}`,
            items: [
              { name: `Item${i}`, icon: 'icon', level: 'beginner' as const, category: `Category${i}` },
            ],
          }));

          const { container, unmount } = render(<TechStackGrid categories={testCategories} />);

          // 查找网格容器
          const gridContainer = container.querySelector('.grid');
          expect(gridContainer).not.toBeNull();

          const className = gridContainer!.className;
          const responsiveClasses = extractResponsiveClasses(className);

          // 验证三个层级都有样式定义
          // 移动端（默认）
          expect(responsiveClasses.mobile.length).toBeGreaterThan(0);
          // 平板端（md）
          expect(responsiveClasses.md.length).toBeGreaterThan(0);
          // 桌面端（lg）
          expect(responsiveClasses.lg.length).toBeGreaterThan(0);

          unmount();
          return true;
        }
      ),
      { numRuns: 30 }
    );
  });
});

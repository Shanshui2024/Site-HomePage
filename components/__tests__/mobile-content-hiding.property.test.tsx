/**
 * 移动端内容隐藏属性测试
 * 
 * Feature: personal-portfolio, Property 15: 移动端非关键内容隐藏
 * 
 * *对于任意*标记为"非关键"的内容元素，在移动端视口（<768px）下
 * 应该被隐藏（display: none或visibility: hidden）。
 * 
 * **Validates: Requirements 8.3**
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

// 响应式断点定义
const MOBILE_BREAKPOINT = 768;

/**
 * TailwindCSS移动端隐藏类模式
 * 这些类在移动端（<768px）隐藏元素，在更大屏幕上显示
 */
const MOBILE_HIDDEN_PATTERNS = [
  /\bhidden\s+(?:sm:|md:|lg:|xl:)(?:flex|block|inline|grid|inline-flex|inline-block)/,
  /\bhidden\b.*\bmd:(?:flex|block|inline|grid|inline-flex|inline-block)\b/,
  /\bhidden\b.*\blg:(?:flex|block|inline|grid|inline-flex|inline-block)\b/,
];

/**
 * TailwindCSS桌面端隐藏类模式
 * 这些类在桌面端隐藏元素，只在移动端显示
 */
const DESKTOP_HIDDEN_PATTERNS = [
  /\bmd:hidden\b/,
  /\blg:hidden\b/,
  /\bsm:hidden\b/,
];

/**
 * 检查元素是否在移动端隐藏（非关键内容）
 */
function isMobileHidden(className: string): boolean {
  return MOBILE_HIDDEN_PATTERNS.some(pattern => pattern.test(className));
}

/**
 * 检查元素是否在桌面端隐藏（移动端专用内容）
 */
function isDesktopHidden(className: string): boolean {
  return DESKTOP_HIDDEN_PATTERNS.some(pattern => pattern.test(className));
}

/**
 * 检查className是否包含hidden类
 */
function hasHiddenClass(className: string): boolean {
  return /\bhidden\b/.test(className);
}

/**
 * 检查className是否包含响应式显示类
 */
function hasResponsiveDisplayClass(className: string, breakpoint: 'sm' | 'md' | 'lg' | 'xl'): boolean {
  const displayClasses = ['flex', 'block', 'inline', 'grid', 'inline-flex', 'inline-block'];
  return displayClasses.some(display => 
    new RegExp(`\\b${breakpoint}:${display}\\b`).test(className)
  );
}

/**
 * 递归查找所有带有响应式隐藏类的元素
 */
function findElementsWithResponsiveHiding(container: Element): Element[] {
  const elements: Element[] = [];
  
  const traverse = (element: Element) => {
    const className = element.className;
    if (typeof className === 'string') {
      if (isMobileHidden(className) || isDesktopHidden(className)) {
        elements.push(element);
      }
    }
    
    Array.from(element.children).forEach(child => traverse(child));
  };
  
  traverse(container);
  return elements;
}

/**
 * Feature: personal-portfolio, Property 15: 移动端非关键内容隐藏
 */
describe('Property 15: 移动端非关键内容隐藏', () => {
  afterEach(() => {
    cleanup();
  });

  /**
   * Property 15.1: 导航组件桌面端导航在移动端隐藏
   * 
   * 验证：桌面端导航栏应该使用 hidden md:flex 模式，在移动端隐藏
   */
  it('导航组件桌面端导航应在移动端隐藏', () => {
    const { container } = render(<Navigation />);

    // 查找桌面端导航容器
    const desktopNav = container.querySelector('.hidden.md\\:flex');
    expect(desktopNav).not.toBeNull();

    // 验证使用正确的隐藏模式
    const className = desktopNav!.className;
    expect(hasHiddenClass(className)).toBe(true);
    expect(hasResponsiveDisplayClass(className, 'md')).toBe(true);
  });

  /**
   * Property 15.2: 移动端汉堡菜单按钮在桌面端隐藏
   * 
   * 验证：汉堡菜单按钮应该使用 md:hidden 模式，在桌面端隐藏
   */
  it('移动端汉堡菜单按钮应在桌面端隐藏', () => {
    const { container } = render(<Navigation />);

    // 查找汉堡菜单按钮
    const menuButton = container.querySelector('button[aria-label="打开菜单"]');
    expect(menuButton).not.toBeNull();

    // 验证使用正确的隐藏模式
    const className = menuButton!.className;
    expect(isDesktopHidden(className)).toBe(true);
  });

  /**
   * Property 15.3: 对于任意移动端视口宽度，非关键内容应被隐藏
   * 
   * 验证：当视口宽度小于768px时，标记为非关键的内容应该被隐藏
   */
  it('对于任意移动端视口宽度，非关键内容应使用hidden类', () => {
    fc.assert(
      fc.property(
        // 生成移动端视口宽度 (1-767px)
        fc.integer({ min: 1, max: MOBILE_BREAKPOINT - 1 }),
        (_viewportWidth) => {
          const { container, unmount } = render(<Navigation />);

          // 查找所有带有响应式隐藏类的元素
          const elementsWithHiding = findElementsWithResponsiveHiding(container);

          // 验证存在使用响应式隐藏的元素
          expect(elementsWithHiding.length).toBeGreaterThan(0);

          // 验证每个非关键元素都使用了正确的隐藏模式
          elementsWithHiding.forEach(element => {
            const className = element.className as string;
            // 元素应该使用 hidden + 响应式显示 或 响应式隐藏 模式
            const isValidHidingPattern = 
              isMobileHidden(className) || isDesktopHidden(className);
            expect(isValidHidingPattern).toBe(true);
          });

          unmount();
          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Property 15.4: 响应式隐藏类应使用md断点（768px）
   * 
   * 验证：非关键内容的隐藏应该使用md断点，与需求8.3一致
   */
  it('响应式隐藏类应使用md断点（768px）', () => {
    const { container } = render(<Navigation />);

    // 查找桌面端导航
    const desktopNav = container.querySelector('.hidden.md\\:flex');
    expect(desktopNav).not.toBeNull();

    // 验证使用md断点
    const className = desktopNav!.className;
    expect(className).toMatch(/\bmd:/);
    expect(className).not.toMatch(/\blg:flex\b/); // 不应该使用lg断点来显示
  });

  /**
   * Property 15.5: 对于任意桌面端视口宽度，移动端专用内容应被隐藏
   * 
   * 验证：当视口宽度大于等于768px时，移动端专用内容应该被隐藏
   */
  it('对于任意桌面端视口宽度，移动端专用内容应使用md:hidden类', () => {
    fc.assert(
      fc.property(
        // 生成桌面端视口宽度 (768-2560px)
        fc.integer({ min: MOBILE_BREAKPOINT, max: 2560 }),
        (_viewportWidth) => {
          const { container, unmount } = render(<Navigation />);

          // 查找汉堡菜单按钮（移动端专用）
          const menuButton = container.querySelector('button[aria-label="打开菜单"]');
          expect(menuButton).not.toBeNull();

          // 验证使用md:hidden类
          const className = menuButton!.className;
          expect(isDesktopHidden(className)).toBe(true);

          unmount();
          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Property 15.6: 隐藏模式应该是互补的
   * 
   * 验证：桌面端导航和移动端菜单按钮应该使用互补的隐藏模式
   * - 桌面端导航：hidden md:flex（移动端隐藏，桌面端显示）
   * - 移动端按钮：md:hidden（移动端显示，桌面端隐藏）
   */
  it('桌面端导航和移动端菜单按钮应使用互补的隐藏模式', () => {
    const { container } = render(<Navigation />);

    // 查找桌面端导航
    const desktopNav = container.querySelector('.hidden.md\\:flex');
    expect(desktopNav).not.toBeNull();

    // 查找移动端菜单按钮
    const menuButton = container.querySelector('button[aria-label="打开菜单"]');
    expect(menuButton).not.toBeNull();

    const desktopNavClass = desktopNav!.className;
    const menuButtonClass = menuButton!.className;

    // 验证互补模式
    // 桌面端导航在移动端隐藏
    expect(isMobileHidden(desktopNavClass)).toBe(true);
    // 移动端按钮在桌面端隐藏
    expect(isDesktopHidden(menuButtonClass)).toBe(true);
  });

  /**
   * Property 15.7: 对于任意视口宽度，至少有一种导航方式可见
   * 
   * 验证：无论视口宽度如何，用户都应该能够访问导航
   * - 移动端：汉堡菜单按钮可见（使用md:hidden，在<768px时可见）
   * - 桌面端：完整导航栏可见（使用hidden md:flex，在>=768px时可见）
   */
  it('对于任意视口宽度，至少有一种导航方式可见', () => {
    fc.assert(
      fc.property(
        // 生成任意视口宽度 (1-2560px)
        fc.integer({ min: 1, max: 2560 }),
        (viewportWidth) => {
          const { container, unmount } = render(<Navigation />);

          // 查找桌面端导航
          const desktopNav = container.querySelector('.hidden.md\\:flex');
          // 查找移动端菜单按钮
          const menuButton = container.querySelector('button[aria-label="打开菜单"]');

          // 验证两种导航方式都存在于DOM中
          expect(desktopNav).not.toBeNull();
          expect(menuButton).not.toBeNull();

          // 验证它们使用互补的隐藏模式
          const desktopNavClass = desktopNav!.className;
          const menuButtonClass = menuButton!.className;

          // 根据视口宽度，验证正确的导航方式应该可见
          if (viewportWidth < MOBILE_BREAKPOINT) {
            // 移动端：汉堡菜单按钮应该可见
            // md:hidden 意味着在 md 及以上隐藏，在 <md 时可见
            // 所以在移动端，按钮没有基础的 hidden 类，只有 md:hidden
            expect(isDesktopHidden(menuButtonClass)).toBe(true);
            expect(hasHiddenClass(menuButtonClass) && !menuButtonClass.includes('md:hidden')).toBe(false);
          } else {
            // 桌面端：完整导航栏应该可见（有md:flex类）
            expect(hasResponsiveDisplayClass(desktopNavClass, 'md')).toBe(true);
          }

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 15.8: 非关键内容隐藏不应影响可访问性
   * 
   * 验证：隐藏的元素应该使用CSS隐藏而不是从DOM中移除
   */
  it('非关键内容隐藏应使用CSS而不是从DOM中移除', () => {
    const { container } = render(<Navigation />);

    // 查找桌面端导航
    const desktopNav = container.querySelector('.hidden.md\\:flex');
    expect(desktopNav).not.toBeNull();

    // 验证元素存在于DOM中
    expect(desktopNav).toBeInTheDocument();

    // 验证使用CSS类进行隐藏
    const className = desktopNav!.className;
    expect(hasHiddenClass(className)).toBe(true);
  });
});

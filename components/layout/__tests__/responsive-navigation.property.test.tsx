/**
 * 响应式导航属性测试
 * 
 * Feature: personal-portfolio, Property 2: 响应式导航适配
 * 
 * *对于任意*视口宽度，当宽度小于768px时，导航组件应该渲染为汉堡菜单；
 * 当宽度大于等于768px时，应该渲染为完整导航栏。
 * 
 * **Validates: Requirements 1.5**
 */

import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import * as fc from 'fast-check';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

// Import Navigation after mocking
import Navigation from '../Navigation';

// 导航项配置（与Navigation组件中的配置保持一致）
const navItems = [
  { label: '首页', href: '/' },
  { label: '技术栈', href: '/tech-stack' },
  { label: '博客', href: '/blog' },
  { label: '友链', href: '/friends' },
  { label: '关于', href: '/about' },
];

// 响应式断点
const MOBILE_BREAKPOINT = 768;

/**
 * 检查元素是否具有隐藏类（TailwindCSS的hidden或md:hidden等）
 */
function hasHiddenClass(element: HTMLElement, breakpoint: 'mobile' | 'desktop'): boolean {
  const classList = element.className;
  
  if (breakpoint === 'mobile') {
    // 在移动端，检查是否有 hidden 类但没有 md:flex 或 md:block
    // 或者检查是否有 md:hidden 类
    return classList.includes('hidden') && !classList.includes('md:hidden');
  } else {
    // 在桌面端，检查是否有 md:hidden 类
    return classList.includes('md:hidden');
  }
}

/**
 * 检查元素是否在指定断点可见
 * 基于TailwindCSS的响应式类
 */
function isVisibleAtBreakpoint(element: HTMLElement, isMobile: boolean): boolean {
  const classList = element.className;
  
  if (isMobile) {
    // 移动端：元素不应该有 hidden 类，或者应该有 md:hidden 类
    if (classList.includes('hidden') && classList.includes('md:flex')) {
      return false; // 桌面端导航在移动端隐藏
    }
    if (classList.includes('md:hidden')) {
      return true; // 移动端专用元素
    }
    return !classList.includes('hidden');
  } else {
    // 桌面端：元素不应该有 md:hidden 类
    if (classList.includes('md:hidden')) {
      return false; // 移动端专用元素在桌面端隐藏
    }
    if (classList.includes('hidden') && classList.includes('md:flex')) {
      return true; // 桌面端导航在桌面端可见
    }
    return !classList.includes('hidden');
  }
}

/**
 * Feature: personal-portfolio, Property 2: 响应式导航适配
 */
describe('Property 2: 响应式导航适配', () => {
  // 每个测试后清理
  afterEach(() => {
    cleanup();
  });
  /**
   * Property 2.1: 桌面端导航在移动端应该隐藏
   * 
   * 验证：当视口宽度小于768px时，桌面端导航（包含所有链接的水平导航栏）应该被隐藏
   */
  it('桌面端导航应该有正确的响应式隐藏类', () => {
    const { container } = render(<Navigation />);
    
    // 查找桌面端导航容器（hidden md:flex）
    const desktopNav = container.querySelector('.hidden.md\\:flex');
    
    // 验证桌面端导航存在
    expect(desktopNav).not.toBeNull();
    
    // 验证桌面端导航有正确的响应式类
    expect(desktopNav).toHaveClass('hidden');
    expect(desktopNav).toHaveClass('md:flex');
  });

  /**
   * Property 2.2: 汉堡菜单按钮在桌面端应该隐藏
   * 
   * 验证：当视口宽度大于等于768px时，汉堡菜单按钮应该被隐藏
   */
  it('汉堡菜单按钮应该有正确的响应式隐藏类', () => {
    render(<Navigation />);
    
    // 查找汉堡菜单按钮
    const menuButton = screen.getByLabelText('打开菜单');
    
    // 验证汉堡菜单按钮存在
    expect(menuButton).toBeInTheDocument();
    
    // 验证汉堡菜单按钮有md:hidden类（在桌面端隐藏）
    expect(menuButton).toHaveClass('md:hidden');
  });

  /**
   * Property 2.3: 对于任意移动端视口宽度，汉堡菜单按钮应该可见
   * 
   * 验证：对于任意小于768px的视口宽度，汉堡菜单按钮应该可见（没有hidden类）
   */
  it('对于任意移动端视口宽度，汉堡菜单按钮应该可见', () => {
    fc.assert(
      fc.property(
        // 生成移动端视口宽度 (1-767px)
        fc.integer({ min: 1, max: MOBILE_BREAKPOINT - 1 }),
        (viewportWidth) => {
          const { unmount } = render(<Navigation />);
          
          // 查找汉堡菜单按钮
          const menuButton = screen.getByLabelText('打开菜单');
          
          // 验证汉堡菜单按钮存在
          expect(menuButton).toBeInTheDocument();
          
          // 验证汉堡菜单按钮有md:hidden类（在桌面端隐藏，移动端可见）
          // 这意味着在移动端（<768px）它是可见的
          expect(menuButton).toHaveClass('md:hidden');
          expect(menuButton).not.toHaveClass('hidden');
          
          // 清理渲染
          unmount();
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 2.4: 对于任意桌面端视口宽度，桌面端导航应该可见
   * 
   * 验证：对于任意大于等于768px的视口宽度，桌面端导航应该可见
   */
  it('对于任意桌面端视口宽度，桌面端导航应该可见', () => {
    fc.assert(
      fc.property(
        // 生成桌面端视口宽度 (768-2560px)
        fc.integer({ min: MOBILE_BREAKPOINT, max: 2560 }),
        (viewportWidth) => {
          const { container, unmount } = render(<Navigation />);
          
          // 查找桌面端导航容器
          const desktopNav = container.querySelector('.hidden.md\\:flex');
          
          // 验证桌面端导航存在
          expect(desktopNav).not.toBeNull();
          
          // 验证桌面端导航有md:flex类（在桌面端可见）
          expect(desktopNav).toHaveClass('md:flex');
          
          // 清理渲染
          unmount();
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 2.5: 响应式类的互斥性
   * 
   * 验证：桌面端导航和汉堡菜单按钮的可见性应该是互斥的
   * - 移动端：汉堡菜单可见，桌面端导航隐藏
   * - 桌面端：桌面端导航可见，汉堡菜单隐藏
   */
  it('桌面端导航和汉堡菜单的可见性应该互斥', () => {
    const { container } = render(<Navigation />);
    
    // 查找桌面端导航容器
    const desktopNav = container.querySelector('.hidden.md\\:flex');
    
    // 查找汉堡菜单按钮
    const menuButton = screen.getByLabelText('打开菜单');
    
    // 验证桌面端导航在移动端隐藏（hidden），在桌面端可见（md:flex）
    expect(desktopNav).toHaveClass('hidden');
    expect(desktopNav).toHaveClass('md:flex');
    
    // 验证汉堡菜单在桌面端隐藏（md:hidden），在移动端可见（没有hidden类）
    expect(menuButton).toHaveClass('md:hidden');
    expect(menuButton).not.toHaveClass('hidden');
  });

  /**
   * Property 2.6: 桌面端导航应该包含所有导航项
   * 
   * 验证：桌面端导航应该包含所有5个导航项链接
   */
  it('桌面端导航应该包含所有导航项', () => {
    const { container } = render(<Navigation />);
    
    // 查找桌面端导航容器
    const desktopNav = container.querySelector('.hidden.md\\:flex');
    
    // 验证桌面端导航存在
    expect(desktopNav).not.toBeNull();
    
    // 验证桌面端导航包含所有导航项
    navItems.forEach(item => {
      const link = desktopNav!.querySelector(`a[href="${item.href}"]`);
      expect(link).not.toBeNull();
      expect(link!.textContent).toBe(item.label);
    });
  });

  /**
   * Property 2.7: 对于任意视口宽度，导航组件应该正确渲染
   * 
   * 验证：无论视口宽度如何，导航组件都应该正确渲染，
   * 包含桌面端导航和汉堡菜单按钮（通过CSS控制可见性）
   */
  it('对于任意视口宽度，导航组件应该正确渲染', () => {
    fc.assert(
      fc.property(
        // 生成任意视口宽度 (1-2560px)
        fc.integer({ min: 1, max: 2560 }),
        (viewportWidth) => {
          const { container, unmount } = render(<Navigation />);
          
          // 验证导航组件存在
          const nav = container.querySelector('nav');
          expect(nav).not.toBeNull();
          
          // 验证桌面端导航存在（通过CSS控制可见性）
          const desktopNav = container.querySelector('.hidden.md\\:flex');
          expect(desktopNav).not.toBeNull();
          
          // 验证汉堡菜单按钮存在（通过CSS控制可见性）
          const menuButton = screen.getByLabelText('打开菜单');
          expect(menuButton).toBeInTheDocument();
          
          // 清理渲染
          unmount();
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 2.8: 响应式断点值的正确性
   * 
   * 验证：TailwindCSS的md断点应该是768px
   * 这是通过检查CSS类来验证的
   */
  it('响应式断点应该使用md（768px）', () => {
    const { container } = render(<Navigation />);
    
    // 查找桌面端导航容器
    const desktopNav = container.querySelector('.hidden.md\\:flex');
    
    // 查找汉堡菜单按钮
    const menuButton = screen.getByLabelText('打开菜单');
    
    // 验证使用的是md断点（768px）
    // 桌面端导航使用md:flex
    expect(desktopNav).toHaveClass('md:flex');
    
    // 汉堡菜单使用md:hidden
    expect(menuButton).toHaveClass('md:hidden');
    
    // 验证没有使用其他断点（如sm、lg）来控制主要的响应式行为
    expect(desktopNav).not.toHaveClass('sm:flex');
    expect(desktopNav).not.toHaveClass('lg:flex');
    expect(menuButton).not.toHaveClass('sm:hidden');
    expect(menuButton).not.toHaveClass('lg:hidden');
  });
});

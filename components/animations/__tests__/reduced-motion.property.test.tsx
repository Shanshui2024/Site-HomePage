/**
 * 减少动画偏好属性测试
 * 
 * Feature: personal-portfolio, Property 18: 减少动画偏好支持
 * 
 * *对于任意*动画组件，当系统的prefers-reduced-motion设置为reduce时，
 * 动画应该被禁用或简化为即时过渡。
 * 
 * **Validates: Requirements 9.5**
 */

import React from 'react';
import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { render } from '@testing-library/react';
import * as fc from 'fast-check';
import * as framerMotion from 'framer-motion';
import FadeIn from '../FadeIn';
import SlideIn, { SlideDirection } from '../SlideIn';

// Mock useReducedMotion from framer-motion
jest.mock('framer-motion', () => {
  const actual = jest.requireActual('framer-motion') as typeof framerMotion;
  return {
    ...actual,
    useReducedMotion: jest.fn(),
  };
});

const mockedUseReducedMotion = framerMotion.useReducedMotion as jest.MockedFunction<typeof framerMotion.useReducedMotion>;

/**
 * Feature: personal-portfolio, Property 18: 减少动画偏好支持
 * 
 * 测试减少动画偏好的正确性属性
 */
describe('Property 18: 减少动画偏好支持', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /**
   * Property 18.1: FadeIn组件在减少动画模式下应渲染为普通div
   * 
   * 当prefers-reduced-motion为reduce时，FadeIn组件应该渲染为
   * 普通的div元素而不是motion.div，从而禁用动画。
   */
  it('FadeIn组件在减少动画模式下应渲染为普通div', () => {
    mockedUseReducedMotion.mockReturnValue(true);

    fc.assert(
      fc.property(
        // 生成任意动画配置
        fc.record({
          delay: fc.float({ min: 0, max: 5, noNaN: true }),
          duration: fc.float({ min: 0, max: 1, noNaN: true }),
          className: fc.string(),
        }),
        (config) => {
          const testContent = 'Test Content';
          const { container } = render(
            <FadeIn 
              delay={config.delay} 
              duration={config.duration}
              className={config.className}
            >
              {testContent}
            </FadeIn>
          );

          // 验证渲染的是普通div而不是motion.div
          const element = container.firstChild as HTMLElement;
          expect(element.tagName).toBe('DIV');
          
          // 验证内容正确渲染
          expect(element.textContent).toBe(testContent);
          
          // 验证没有framer-motion的动画属性
          expect(element.getAttribute('style')).toBeNull();

          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Property 18.2: SlideIn组件在减少动画模式下应渲染为普通div
   * 
   * 当prefers-reduced-motion为reduce时，SlideIn组件应该渲染为
   * 普通的div元素而不是motion.div，从而禁用动画。
   */
  it('SlideIn组件在减少动画模式下应渲染为普通div', () => {
    mockedUseReducedMotion.mockReturnValue(true);

    const directions: SlideDirection[] = ['left', 'right', 'up', 'down'];

    fc.assert(
      fc.property(
        // 生成任意动画配置
        fc.record({
          direction: fc.constantFrom(...directions),
          delay: fc.float({ min: 0, max: 5, noNaN: true }),
          duration: fc.float({ min: 0, max: 1, noNaN: true }),
          className: fc.string(),
        }),
        (config) => {
          const testContent = 'Test Content';
          const { container } = render(
            <SlideIn 
              direction={config.direction}
              delay={config.delay} 
              duration={config.duration}
              className={config.className}
            >
              {testContent}
            </SlideIn>
          );

          // 验证渲染的是普通div而不是motion.div
          const element = container.firstChild as HTMLElement;
          expect(element.tagName).toBe('DIV');
          
          // 验证内容正确渲染
          expect(element.textContent).toBe(testContent);
          
          // 验证没有framer-motion的动画属性
          expect(element.getAttribute('style')).toBeNull();

          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Property 18.3: 动画组件在正常模式下应使用motion.div
   * 
   * 当prefers-reduced-motion为false时，动画组件应该渲染为
   * motion.div元素以启用动画效果。
   */
  it('动画组件在正常模式下应使用motion.div', () => {
    mockedUseReducedMotion.mockReturnValue(false);

    const testContent = 'Test Content';
    
    // 测试FadeIn
    const { container: fadeInContainer } = render(
      <FadeIn>{testContent}</FadeIn>
    );
    const fadeInElement = fadeInContainer.firstChild as HTMLElement;
    expect(fadeInElement.tagName).toBe('DIV');
    // motion.div会添加style属性用于动画
    expect(fadeInElement.hasAttribute('style')).toBe(true);

    // 测试SlideIn
    const { container: slideInContainer } = render(
      <SlideIn>{testContent}</SlideIn>
    );
    const slideInElement = slideInContainer.firstChild as HTMLElement;
    expect(slideInElement.tagName).toBe('DIV');
    // motion.div会添加style属性用于动画
    expect(slideInElement.hasAttribute('style')).toBe(true);
  });

  /**
   * Property 18.4: 减少动画模式下内容应立即可见
   * 
   * 当prefers-reduced-motion为reduce时，内容应该立即完全可见，
   * 没有任何透明度或位置变化（通过验证没有inline style属性）。
   */
  it('减少动画模式下内容应立即可见', () => {
    mockedUseReducedMotion.mockReturnValue(true);

    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }),
        (content) => {
          // 测试FadeIn
          const { container: fadeInContainer } = render(
            <FadeIn>{content}</FadeIn>
          );
          const fadeInElement = fadeInContainer.firstChild as HTMLElement;
          
          // 验证没有inline style（即没有动画相关的透明度/位移设置）
          // 普通div不会有framer-motion添加的style属性
          expect(fadeInElement.getAttribute('style')).toBeNull();
          expect(fadeInElement.textContent).toBe(content);

          // 测试SlideIn
          const { container: slideInContainer } = render(
            <SlideIn>{content}</SlideIn>
          );
          const slideInElement = slideInContainer.firstChild as HTMLElement;
          
          // 验证没有inline style（即没有动画相关的透明度/位移设置）
          expect(slideInElement.getAttribute('style')).toBeNull();
          expect(slideInElement.textContent).toBe(content);

          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Property 18.5: 所有SlideIn方向在减少动画模式下行为一致
   * 
   * 无论SlideIn的direction属性设置为何值，在减少动画模式下
   * 都应该渲染为普通div，不应用任何位移动画。
   */
  it('所有SlideIn方向在减少动画模式下行为一致', () => {
    mockedUseReducedMotion.mockReturnValue(true);

    const directions: SlideDirection[] = ['left', 'right', 'up', 'down'];
    const testContent = 'Test Content';

    directions.forEach((direction) => {
      const { container } = render(
        <SlideIn direction={direction}>{testContent}</SlideIn>
      );
      
      const element = container.firstChild as HTMLElement;
      
      // 验证所有方向都渲染为普通div
      expect(element.tagName).toBe('DIV');
      expect(element.textContent).toBe(testContent);
      
      // 验证没有动画相关的style属性
      expect(element.getAttribute('style')).toBeNull();
    });
  });

  /**
   * Property 18.6: className在减少动画模式下应正确传递
   * 
   * 即使在减少动画模式下，className属性也应该正确应用到渲染的元素上。
   */
  it('className在减少动画模式下应正确传递', () => {
    mockedUseReducedMotion.mockReturnValue(true);

    fc.assert(
      fc.property(
        // 生成有效的CSS类名（使用字母和连字符）
        fc.string({ minLength: 1, maxLength: 20 }).filter(s => /^[a-zA-Z][a-zA-Z0-9-_]*$/.test(s)),
        (className) => {
          // 测试FadeIn
          const { container: fadeInContainer } = render(
            <FadeIn className={className}>Content</FadeIn>
          );
          expect(fadeInContainer.firstChild).toHaveClass(className);

          // 测试SlideIn
          const { container: slideInContainer } = render(
            <SlideIn className={className}>Content</SlideIn>
          );
          expect(slideInContainer.firstChild).toHaveClass(className);

          return true;
        }
      ),
      { numRuns: 50 }
    );
  });
});

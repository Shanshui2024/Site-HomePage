/**
 * 触摸目标尺寸属性测试
 * 
 * Feature: personal-portfolio, Property 16: 触摸目标最小尺寸
 * 
 * *对于任意*可交互元素（按钮、链接），其渲染后的尺寸应该至少为44x44像素，
 * 确保触摸屏上易于点击。
 * 
 * **Validates: Requirements 8.4**
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import * as fc from 'fast-check';
import Button, { ButtonProps } from '../Button';

/**
 * Helper function to extract minimum size values from Tailwind classes
 * Parses classes like 'min-h-[44px]' and 'min-w-[44px]'
 */
function extractMinSize(className: string): { minHeight: number; minWidth: number } {
  const minHeightMatch = className.match(/min-h-\[(\d+)px\]/);
  const minWidthMatch = className.match(/min-w-\[(\d+)px\]/);
  
  return {
    minHeight: minHeightMatch ? parseInt(minHeightMatch[1], 10) : 0,
    minWidth: minWidthMatch ? parseInt(minWidthMatch[1], 10) : 0,
  };
}

/**
 * Minimum touch target size as per WCAG guidelines and Requirement 8.4
 */
const MIN_TOUCH_TARGET_SIZE = 44;

/**
 * Feature: personal-portfolio, Property 16: 触摸目标最小尺寸
 * 
 * 测试可交互元素的最小触摸目标尺寸
 */
describe('Property 16: 触摸目标最小尺寸', () => {
  /**
   * Property 16.1: Button组件所有尺寸变体满足最小触摸目标
   * 
   * 对于任意Button尺寸变体（sm, md, lg），渲染后的元素应该
   * 具有至少44x44像素的最小尺寸。
   */
  it('Button组件所有尺寸变体应满足最小44x44px触摸目标', () => {
    fc.assert(
      fc.property(
        // Generate all possible button size variants
        fc.constantFrom<ButtonProps['size']>('sm', 'md', 'lg'),
        // Generate all possible button variants
        fc.constantFrom<ButtonProps['variant']>('primary', 'secondary', 'ghost'),
        // Generate random button text
        fc.string({ minLength: 1, maxLength: 20 }),
        (size, variant, buttonText) => {
          const { container } = render(
            <Button size={size} variant={variant}>
              {buttonText}
            </Button>
          );
          
          const button = container.querySelector('button');
          expect(button).not.toBeNull();
          
          if (button) {
            const className = button.className;
            const { minHeight, minWidth } = extractMinSize(className);
            
            // All sizes should meet minimum 44x44px requirement
            expect(minHeight).toBeGreaterThanOrEqual(MIN_TOUCH_TARGET_SIZE);
            expect(minWidth).toBeGreaterThanOrEqual(MIN_TOUCH_TARGET_SIZE);
          }
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 16.2: Button组件默认配置满足最小触摸目标
   * 
   * 对于任意Button内容，使用默认配置时应满足最小触摸目标要求。
   */
  it('Button组件默认配置应满足最小44x44px触摸目标', () => {
    fc.assert(
      fc.property(
        // Generate random button content
        fc.string({ minLength: 1, maxLength: 50 }),
        (buttonText) => {
          const { container } = render(
            <Button>{buttonText}</Button>
          );
          
          const button = container.querySelector('button');
          expect(button).not.toBeNull();
          
          if (button) {
            const className = button.className;
            const { minHeight, minWidth } = extractMinSize(className);
            
            expect(minHeight).toBeGreaterThanOrEqual(MIN_TOUCH_TARGET_SIZE);
            expect(minWidth).toBeGreaterThanOrEqual(MIN_TOUCH_TARGET_SIZE);
          }
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 16.3: Button组件自定义className不应覆盖最小尺寸
   * 
   * 对于任意自定义className，Button组件应保持最小触摸目标类。
   */
  it('Button组件添加自定义className后仍应包含最小尺寸类', () => {
    fc.assert(
      fc.property(
        // Generate random custom class names
        fc.string({ minLength: 1, maxLength: 30 }).map(s => s.replace(/[^a-zA-Z0-9-_]/g, '')),
        fc.constantFrom<ButtonProps['size']>('sm', 'md', 'lg'),
        (customClass, size) => {
          const { container } = render(
            <Button size={size} className={customClass}>
              Test Button
            </Button>
          );
          
          const button = container.querySelector('button');
          expect(button).not.toBeNull();
          
          if (button) {
            const className = button.className;
            
            // Should still contain min-h and min-w classes
            expect(className).toMatch(/min-h-\[\d+px\]/);
            expect(className).toMatch(/min-w-\[\d+px\]/);
            
            const { minHeight, minWidth } = extractMinSize(className);
            expect(minHeight).toBeGreaterThanOrEqual(MIN_TOUCH_TARGET_SIZE);
            expect(minWidth).toBeGreaterThanOrEqual(MIN_TOUCH_TARGET_SIZE);
          }
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 16.4: 所有Button尺寸变体的最小尺寸值验证
   * 
   * 验证每个尺寸变体的具体最小尺寸值符合预期。
   */
  it('Button尺寸变体应具有正确的最小尺寸值', () => {
    const expectedSizes: Record<NonNullable<ButtonProps['size']>, { minHeight: number; minWidth: number }> = {
      sm: { minHeight: 44, minWidth: 44 },
      md: { minHeight: 44, minWidth: 44 },
      lg: { minHeight: 48, minWidth: 48 },
    };

    fc.assert(
      fc.property(
        fc.constantFrom<NonNullable<ButtonProps['size']>>('sm', 'md', 'lg'),
        (size) => {
          const { container } = render(
            <Button size={size}>Test</Button>
          );
          
          const button = container.querySelector('button');
          expect(button).not.toBeNull();
          
          if (button) {
            const className = button.className;
            const { minHeight, minWidth } = extractMinSize(className);
            
            expect(minHeight).toBe(expectedSizes[size].minHeight);
            expect(minWidth).toBe(expectedSizes[size].minWidth);
          }
          
          return true;
        }
      ),
      { numRuns: 30 }
    );
  });
});

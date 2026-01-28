/**
 * 技术栈图标展示属性测试
 * 
 * Feature: personal-portfolio, Property 6: 技术栈图标展示
 * 
 * *对于任意*技术项，渲染后的输出应该包含图标元素（img或svg标签）。
 * 
 * **Validates: Requirements 4.3**
 */

import React from 'react';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import * as fc from 'fast-check';
import TechStackGrid from '../TechStackGrid';
import type { TechCategory, TechItem } from '@/types';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
      <div {...props}>{children}</div>
    ),
  },
  useReducedMotion: () => false,
}));

// Cleanup after each test to avoid DOM pollution
afterEach(() => {
  cleanup();
});

/**
 * 生成有效的非空字符串（用于技术名称和图标）
 */
const nonEmptyStringArbitrary = fc.stringMatching(/^[a-zA-Z][a-zA-Z0-9_-]{0,19}$/);

/**
 * 生成有效的熟练度级别
 */
const techLevelArbitrary = fc.constantFrom('beginner', 'intermediate', 'advanced', 'expert') as fc.Arbitrary<TechItem['level']>;

/**
 * 生成有效的TechItem数据
 */
const techItemArbitrary: fc.Arbitrary<TechItem> = fc.record({
  name: nonEmptyStringArbitrary.filter(s => s.length > 0),
  icon: nonEmptyStringArbitrary.filter(s => s.length > 0),
  level: techLevelArbitrary,
  category: fc.constant('TestCategory'),
});

/**
 * 生成具有唯一类别名称的TechCategory数组
 */
const uniqueCategoriesArbitrary: fc.Arbitrary<TechCategory[]> = fc.array(
  nonEmptyStringArbitrary.filter(s => s.length > 0),
  { minLength: 1, maxLength: 3 }
).chain(categoryNames => {
  const uniqueNames = [...new Set(categoryNames)];
  if (uniqueNames.length === 0) {
    uniqueNames.push('DefaultCategory');
  }
  
  return fc.tuple(
    ...uniqueNames.map(name => 
      fc.array(
        fc.record({
          name: nonEmptyStringArbitrary.filter(s => s.length > 0),
          icon: nonEmptyStringArbitrary.filter(s => s.length > 0),
          level: techLevelArbitrary,
          category: fc.constant(name),
        }),
        { minLength: 1, maxLength: 3 }
      ).map(items => ({ name, items }))
    )
  ) as fc.Arbitrary<TechCategory[]>;
});

/**
 * Feature: personal-portfolio, Property 6: 技术栈图标展示
 */
describe('Property 6: 技术栈图标展示', () => {
  /**
   * Property 6.1: 每个技术项都应包含图标元素
   * 
   * 对于任意技术项，渲染后的输出应该包含svg图标元素
   */
  it('每个技术项都应包含图标元素（svg）', () => {
    fc.assert(
      fc.property(
        techItemArbitrary,
        (item) => {
          cleanup();
          
          const categories: TechCategory[] = [{
            name: 'TestCategory',
            items: [item],
          }];
          
          const { container } = render(<TechStackGrid categories={categories} />);
          
          // 查找svg图标元素（组件使用lucide-react的Code2图标，渲染为svg）
          const svgElements = container.querySelectorAll('svg');
          
          // 应该至少有一个svg图标
          expect(svgElements.length).toBeGreaterThanOrEqual(1);
          
          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Property 6.2: 技术项数量与图标数量一致
   * 
   * 对于任意技术栈数据集，渲染的图标数量应该等于技术项总数
   */
  it('图标数量应与技术项数量一致', () => {
    fc.assert(
      fc.property(
        uniqueCategoriesArbitrary,
        (categories) => {
          cleanup();
          
          const { container } = render(<TechStackGrid categories={categories} />);
          
          // 计算技术项总数
          const totalItems = categories.reduce((sum, cat) => sum + cat.items.length, 0);
          
          // 查找所有svg图标（每个技术项应有一个图标）
          const svgElements = container.querySelectorAll('svg');
          
          // 图标数量应等于技术项数量
          expect(svgElements.length).toBe(totalItems);
          
          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Property 6.3: 图标容器存在于每个技术项中
   * 
   * 对于任意技术项，应该有一个图标容器元素
   */
  it('每个技术项都应有图标容器', () => {
    fc.assert(
      fc.property(
        uniqueCategoriesArbitrary,
        (categories) => {
          cleanup();
          
          const { container } = render(<TechStackGrid categories={categories} />);
          
          // 计算技术项总数
          const totalItems = categories.reduce((sum, cat) => sum + cat.items.length, 0);
          
          // 查找图标容器（使用组件中定义的类名）
          const iconContainers = container.querySelectorAll('.w-16.h-16');
          
          // 图标容器数量应等于技术项数量
          expect(iconContainers.length).toBe(totalItems);
          
          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Property 6.4: 空类别数组不渲染任何图标
   * 
   * 当输入空的类别数组时，不应渲染任何图标
   */
  it('空类别数组不应渲染任何图标', () => {
    const { container } = render(<TechStackGrid categories={[]} />);
    
    const svgElements = container.querySelectorAll('svg');
    expect(svgElements.length).toBe(0);
  });

  /**
   * Property 6.5: 图标元素具有正确的视觉属性
   * 
   * 对于任意技术项，其图标应该具有适当的尺寸类
   */
  it('图标应具有正确的尺寸类', () => {
    fc.assert(
      fc.property(
        techItemArbitrary,
        (item) => {
          cleanup();
          
          const categories: TechCategory[] = [{
            name: 'TestCategory',
            items: [item],
          }];
          
          const { container } = render(<TechStackGrid categories={categories} />);
          
          // 查找svg图标
          const svgElement = container.querySelector('svg');
          expect(svgElement).toBeTruthy();
          
          // 验证图标具有尺寸类（w-8 h-8）
          expect(svgElement?.classList.contains('w-8')).toBe(true);
          expect(svgElement?.classList.contains('h-8')).toBe(true);
          
          return true;
        }
      ),
      { numRuns: 50 }
    );
  });
});

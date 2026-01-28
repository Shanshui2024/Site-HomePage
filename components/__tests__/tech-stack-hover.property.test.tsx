/**
 * 技术栈悬停信息显示属性测试
 * 
 * Feature: personal-portfolio, Property 5: 技术栈悬停信息显示
 * 
 * *对于任意*技术项，当触发悬停事件时，应该显示包含技术名称和熟练度级别的信息。
 * 
 * **Validates: Requirements 4.2**
 */

import React from 'react';
import { render, fireEvent, cleanup } from '@testing-library/react';
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

// 熟练度级别的中文映射（与组件中的levelConfig保持一致）
const levelLabels: Record<TechItem['level'], string> = {
  beginner: '初学者',
  intermediate: '中级',
  advanced: '高级',
  expert: '专家',
};

/**
 * 生成有效的非空字符串（用于技术名称）
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
 * 生成包含单个技术项的类别（用于隔离测试悬停行为）
 */
const singleItemCategoryArbitrary: fc.Arbitrary<TechCategory[]> = techItemArbitrary.map(item => [{
  name: 'TestCategory',
  items: [item],
}]);

/**
 * Feature: personal-portfolio, Property 5: 技术栈悬停信息显示
 */
describe('Property 5: 技术栈悬停信息显示', () => {
  /**
   * Property 5.1: 悬停时显示熟练度级别
   * 
   * 对于任意技术项，当触发悬停事件时，应该显示对应的熟练度级别标签
   */
  it('悬停时应显示熟练度级别', () => {
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
          
          // 找到技术项卡片（通过技术名称定位）
          const techNameElement = container.querySelector('h3');
          expect(techNameElement).toBeTruthy();
          expect(techNameElement?.textContent).toBe(item.name);
          
          // 找到可悬停的卡片容器
          const cardContainer = techNameElement?.closest('.group');
          expect(cardContainer).toBeTruthy();
          
          // 悬停前不应显示熟练度级别
          const expectedLabel = levelLabels[item.level];
          expect(container.textContent).not.toContain(expectedLabel);
          
          // 触发悬停
          fireEvent.mouseEnter(cardContainer!);
          
          // 悬停后应显示熟练度级别
          expect(container.textContent).toContain(expectedLabel);
          
          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Property 5.2: 鼠标离开后隐藏熟练度级别
   * 
   * 对于任意技术项，当鼠标离开后，熟练度级别应该被隐藏
   */
  it('鼠标离开后应隐藏熟练度级别', () => {
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
          
          const techNameElement = container.querySelector('h3');
          const cardContainer = techNameElement?.closest('.group');
          expect(cardContainer).toBeTruthy();
          
          const expectedLabel = levelLabels[item.level];
          
          // 悬停显示
          fireEvent.mouseEnter(cardContainer!);
          expect(container.textContent).toContain(expectedLabel);
          
          // 离开隐藏
          fireEvent.mouseLeave(cardContainer!);
          expect(container.textContent).not.toContain(expectedLabel);
          
          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Property 5.3: 所有熟练度级别都有对应的显示标签
   * 
   * 对于每种熟练度级别，悬停时都应该显示正确的中文标签
   */
  it('所有熟练度级别都应有正确的显示标签', () => {
    const levels: TechItem['level'][] = ['beginner', 'intermediate', 'advanced', 'expert'];
    
    levels.forEach(level => {
      cleanup();
      
      const item: TechItem = {
        name: 'TestTech',
        icon: 'test-icon',
        level,
        category: 'TestCategory',
      };
      
      const categories: TechCategory[] = [{
        name: 'TestCategory',
        items: [item],
      }];
      
      const { container } = render(<TechStackGrid categories={categories} />);
      
      const cardContainer = container.querySelector('.group');
      expect(cardContainer).toBeTruthy();
      
      fireEvent.mouseEnter(cardContainer!);
      
      const expectedLabel = levelLabels[level];
      expect(container.textContent).toContain(expectedLabel);
    });
  });

  /**
   * Property 5.4: 悬停状态独立性
   * 
   * 对于多个技术项，悬停一个不应影响其他项的显示状态
   */
  it('悬停状态应相互独立', () => {
    fc.assert(
      fc.property(
        fc.array(techItemArbitrary, { minLength: 2, maxLength: 4 })
          .filter(items => {
            // 确保所有项名称唯一
            const names = items.map(i => i.name);
            return new Set(names).size === names.length;
          }),
        (items) => {
          cleanup();
          
          const categories: TechCategory[] = [{
            name: 'TestCategory',
            items,
          }];
          
          const { container } = render(<TechStackGrid categories={categories} />);
          
          // 获取所有卡片容器
          const cardContainers = container.querySelectorAll('.group');
          expect(cardContainers.length).toBe(items.length);
          
          // 悬停第一个项
          fireEvent.mouseEnter(cardContainers[0]);
          
          const firstItemLabel = levelLabels[items[0].level];
          
          // 第一个项应显示熟练度
          expect(container.textContent).toContain(firstItemLabel);
          
          // 如果其他项的熟练度级别不同，它们不应显示
          items.slice(1).forEach((item, index) => {
            if (item.level !== items[0].level) {
              // 检查该级别的标签出现次数（应该只有第一个项的）
              const label = levelLabels[item.level];
              const regex = new RegExp(label, 'g');
              const matches = container.textContent?.match(regex) || [];
              expect(matches.length).toBe(0);
            }
          });
          
          return true;
        }
      ),
      { numRuns: 30 }
    );
  });
});

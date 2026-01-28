/**
 * 技术栈分类展示属性测试
 * 
 * Feature: personal-portfolio, Property 4: 技术栈分类展示
 * 
 * *对于任意*技术栈数据集，渲染后的输出应该按类别分组，每个类别下包含该类别的所有技术项，
 * 且不同类别的技术项不应混合。
 * 
 * **Validates: Requirements 4.1**
 */

import React from 'react';
import { render, screen, within, cleanup } from '@testing-library/react';
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
 * 生成有效的非空字符串（不包含空白字符）
 * 用于生成可以被React Testing Library正确查找的文本
 */
const nonEmptyStringArbitrary = fc.stringMatching(/^[a-zA-Z][a-zA-Z0-9_-]{0,19}$/);

/**
 * 生成有效的TechItem数据的arbitrary
 */
const techLevelArbitrary = fc.constantFrom('beginner', 'intermediate', 'advanced', 'expert') as fc.Arbitrary<'beginner' | 'intermediate' | 'advanced' | 'expert'>;

const techItemArbitrary = (categoryName: string): fc.Arbitrary<TechItem> => fc.record({
  name: nonEmptyStringArbitrary.map(s => s || 'Tech'),
  icon: nonEmptyStringArbitrary.map(s => s || 'icon'),
  level: techLevelArbitrary,
  category: fc.constant(categoryName),
});

/**
 * 生成具有唯一类别名称的TechCategory数组
 */
const uniqueCategoriesArbitrary: fc.Arbitrary<TechCategory[]> = fc.array(
  nonEmptyStringArbitrary,
  { minLength: 1, maxLength: 4 }
).chain(categoryNames => {
  // 确保类别名称唯一
  const uniqueNames = [...new Set(categoryNames.filter(n => n && n.trim().length > 0))];
  if (uniqueNames.length === 0) {
    uniqueNames.push('DefaultCategory');
  }
  
  return fc.tuple(
    ...uniqueNames.map(name => 
      fc.array(techItemArbitrary(name), { minLength: 1, maxLength: 4 })
        .map(items => ({ name, items }))
    )
  ) as fc.Arbitrary<TechCategory[]>;
});

/**
 * Feature: personal-portfolio, Property 4: 技术栈分类展示
 */
describe('Property 4: 技术栈分类展示', () => {
  /**
   * Property 4.1: 所有类别都被渲染
   * 
   * 对于任意技术栈数据集，每个类别名称都应该在渲染输出中显示
   */
  it('所有类别名称都应该被渲染', () => {
    fc.assert(
      fc.property(
        uniqueCategoriesArbitrary,
        (categories) => {
          cleanup(); // Clean up before each property test iteration
          const { container } = render(<TechStackGrid categories={categories} />);
          
          // 验证：每个类别名称都应该在h2标签中显示
          const categoryHeaders = container.querySelectorAll('h2');
          const renderedNames = Array.from(categoryHeaders).map(h => h.textContent);
          
          categories.forEach(category => {
            expect(renderedNames).toContain(category.name);
          });
          
          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Property 4.2: 每个类别下的所有技术项都被渲染
   * 
   * 对于任意技术栈数据集，每个类别下的所有技术项名称都应该在渲染输出中显示
   */
  it('每个类别下的所有技术项都应该被渲染', () => {
    fc.assert(
      fc.property(
        uniqueCategoriesArbitrary,
        (categories) => {
          cleanup(); // Clean up before each property test iteration
          const { container } = render(<TechStackGrid categories={categories} />);
          
          // 验证：每个技术项名称都应该在h3标签中显示
          const techItemHeaders = container.querySelectorAll('h3');
          const renderedItemNames = Array.from(techItemHeaders).map(h => h.textContent);
          
          categories.forEach(category => {
            category.items.forEach(item => {
              expect(renderedItemNames).toContain(item.name);
            });
          });
          
          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Property 4.3: 技术项数量与输入数据一致
   * 
   * 渲染后的技术项总数应该等于输入数据中所有类别的技术项总数
   */
  it('渲染的技术项数量应与输入数据一致', () => {
    fc.assert(
      fc.property(
        uniqueCategoriesArbitrary,
        (categories) => {
          cleanup(); // Clean up before each property test iteration
          const { container } = render(<TechStackGrid categories={categories} />);
          
          // 计算输入数据中的技术项总数
          const totalItems = categories.reduce((sum, cat) => sum + cat.items.length, 0);
          
          // 计算渲染的技术项数量（通过图标容器计数）
          const iconContainers = container.querySelectorAll('.w-16.h-16');
          
          expect(iconContainers.length).toBe(totalItems);
          
          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Property 4.4: 类别数量与输入数据一致
   * 
   * 渲染后的类别标题数量应该等于输入数据中的类别数量
   */
  it('渲染的类别数量应与输入数据一致', () => {
    fc.assert(
      fc.property(
        uniqueCategoriesArbitrary,
        (categories) => {
          cleanup(); // Clean up before each property test iteration
          const { container } = render(<TechStackGrid categories={categories} />);
          
          // 类别标题使用h2标签
          const categoryHeaders = container.querySelectorAll('h2');
          
          expect(categoryHeaders.length).toBe(categories.length);
          
          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Property 4.5: 类别顺序与输入数据一致
   * 
   * 渲染后的类别顺序应该与输入数据中的顺序一致
   */
  it('类别顺序应与输入数据一致', () => {
    fc.assert(
      fc.property(
        uniqueCategoriesArbitrary,
        (categories) => {
          cleanup(); // Clean up before each property test iteration
          const { container } = render(<TechStackGrid categories={categories} />);
          
          // 获取所有类别标题
          const categoryHeaders = container.querySelectorAll('h2');
          const renderedCategoryNames = Array.from(categoryHeaders).map(h => h.textContent);
          
          // 验证顺序一致
          categories.forEach((category, index) => {
            expect(renderedCategoryNames[index]).toBe(category.name);
          });
          
          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Property 4.6: 空类别数组渲染为空
   * 
   * 当输入空的类别数组时，不应渲染任何类别标题
   */
  it('空类别数组应渲染为空', () => {
    const { container } = render(<TechStackGrid categories={[]} />);
    
    const categoryHeaders = container.querySelectorAll('h2');
    expect(categoryHeaders.length).toBe(0);
  });

  /**
   * Property 4.7: 不同类别的技术项不混合
   * 
   * 每个类别区域内只应包含属于该类别的技术项
   */
  it('不同类别的技术项不应混合', () => {
    // 使用固定的测试数据来验证分组正确性
    const testCategories: TechCategory[] = [
      {
        name: 'Frontend',
        items: [
          { name: 'React', icon: 'react', level: 'expert', category: 'Frontend' },
          { name: 'Vue', icon: 'vue', level: 'advanced', category: 'Frontend' },
        ],
      },
      {
        name: 'Backend',
        items: [
          { name: 'Node.js', icon: 'nodejs', level: 'advanced', category: 'Backend' },
          { name: 'Python', icon: 'python', level: 'intermediate', category: 'Backend' },
        ],
      },
    ];
    
    const { container } = render(<TechStackGrid categories={testCategories} />);
    
    // 获取所有类别区域（每个类别是一个包含h2和grid的div）
    const categoryHeaders = container.querySelectorAll('h2');
    
    categoryHeaders.forEach((header, index) => {
      const categorySection = header.closest('div')?.parentElement;
      expect(categorySection).toBeTruthy();
      
      const expectedCategory = testCategories[index];
      
      // 验证该区域内的技术项名称
      expectedCategory.items.forEach(item => {
        const itemElement = within(categorySection!).getByText(item.name);
        expect(itemElement).toBeInTheDocument();
      });
      
      // 验证其他类别的技术项不在此区域
      testCategories.forEach((otherCategory, otherIndex) => {
        if (otherIndex !== index) {
          otherCategory.items.forEach(item => {
            const itemElements = within(categorySection!).queryAllByText(item.name);
            expect(itemElements.length).toBe(0);
          });
        }
      });
    });
  });
});

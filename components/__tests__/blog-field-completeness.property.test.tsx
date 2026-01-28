/**
 * 博客文章字段完整性属性测试
 * 
 * Feature: personal-portfolio, Property 7: 博客文章字段完整性
 * 
 * *对于任意*博客文章列表，每篇文章的渲染输出应该包含标题、摘要、发布日期和标签
 * 这四个必需字段。
 * 
 * **Validates: Requirements 5.1**
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import * as fc from 'fast-check';
import BlogPostCard from '../BlogPostCard';
import type { BlogPost } from '@/types';

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

// Mock next/image
jest.mock('next/image', () => {
  return ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} />
  );
});

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Calendar: () => <span data-testid="calendar-icon">Calendar</span>,
  Clock: () => <span data-testid="clock-icon">Clock</span>,
}));

/**
 * 生成有效日期字符串的arbitrary
 */
const dateStringArbitrary = fc.tuple(
  fc.integer({ min: 2020, max: 2030 }),
  fc.integer({ min: 1, max: 12 }),
  fc.integer({ min: 1, max: 28 })
).map(([year, month, day]) => 
  `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
);

/**
 * 生成非空字符串的arbitrary（用于必需字段）
 */
const nonEmptyStringArbitrary = fc.string({ minLength: 1, maxLength: 50 })
  .filter(s => s.trim().length > 0)
  .map(s => s.trim());

/**
 * 生成有效标签的arbitrary
 */
const tagArbitrary = fc.string({ minLength: 1, maxLength: 20 })
  .filter(s => s.trim().length > 0)
  .map(s => s.trim());

/**
 * 生成有效的BlogPost数据的arbitrary
 */
const blogPostArbitrary: fc.Arbitrary<BlogPost> = fc.record({
  slug: nonEmptyStringArbitrary.map(s => s.replace(/[^a-zA-Z0-9-]/g, 'a') || 'post'),
  title: nonEmptyStringArbitrary,
  description: nonEmptyStringArbitrary,
  date: dateStringArbitrary,
  tags: fc.array(tagArbitrary, { minLength: 1, maxLength: 5 }),
  content: fc.string({ minLength: 1, maxLength: 500 }).map(s => s || 'Content'),
  coverImage: fc.option(fc.constant('/images/test.jpg'), { nil: undefined }),
});

/**
 * Feature: personal-portfolio, Property 7: 博客文章字段完整性
 * 
 * **Validates: Requirements 5.1**
 */
describe('Property 7: 博客文章字段完整性', () => {
  /**
   * Property 7.1: 渲染的博客文章卡片包含标题
   * 
   * 对于任意博客文章，渲染后的输出应该包含文章标题
   */
  it('渲染的博客文章卡片应包含标题', () => {
    fc.assert(
      fc.property(
        blogPostArbitrary,
        (post) => {
          const { container } = render(<BlogPostCard post={post} />);
          
          // 验证：标题应该在渲染输出中
          expect(container.textContent).toContain(post.title);
          
          // 清理
          container.remove();
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 7.2: 渲染的博客文章卡片包含摘要/描述
   * 
   * 对于任意博客文章，渲染后的输出应该包含文章摘要
   */
  it('渲染的博客文章卡片应包含摘要', () => {
    fc.assert(
      fc.property(
        blogPostArbitrary,
        (post) => {
          const { container } = render(<BlogPostCard post={post} />);
          
          // 验证：摘要应该在渲染输出中
          expect(container.textContent).toContain(post.description);
          
          // 清理
          container.remove();
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 7.3: 渲染的博客文章卡片包含发布日期
   * 
   * 对于任意博客文章，渲染后的输出应该包含格式化的发布日期
   */
  it('渲染的博客文章卡片应包含发布日期', () => {
    fc.assert(
      fc.property(
        blogPostArbitrary,
        (post) => {
          const { container } = render(<BlogPostCard post={post} />);
          
          // 解析日期以验证年份存在于输出中
          const date = new Date(post.date);
          const year = date.getFullYear().toString();
          
          // 验证：日期的年份应该在渲染输出中
          expect(container.textContent).toContain(year);
          
          // 验证：日历图标存在（表示日期字段存在）
          expect(screen.getByTestId('calendar-icon')).toBeInTheDocument();
          
          // 清理
          container.remove();
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 7.4: 渲染的博客文章卡片包含标签
   * 
   * 对于任意博客文章，渲染后的输出应该包含所有标签
   */
  it('渲染的博客文章卡片应包含所有标签', () => {
    fc.assert(
      fc.property(
        blogPostArbitrary,
        (post) => {
          const { container } = render(<BlogPostCard post={post} />);
          
          // 验证：每个标签都应该在渲染输出中
          post.tags.forEach(tag => {
            expect(container.textContent).toContain(tag);
          });
          
          // 清理
          container.remove();
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 7.5: 所有四个必需字段同时存在
   * 
   * 对于任意博客文章，渲染后的输出应该同时包含标题、摘要、日期和标签
   */
  it('渲染的博客文章卡片应同时包含标题、摘要、日期和标签', () => {
    fc.assert(
      fc.property(
        blogPostArbitrary,
        (post) => {
          const { container } = render(<BlogPostCard post={post} />);
          const textContent = container.textContent || '';
          
          // 验证：标题存在
          const hasTitle = textContent.includes(post.title);
          
          // 验证：摘要存在
          const hasDescription = textContent.includes(post.description);
          
          // 验证：日期存在（检查年份）
          const date = new Date(post.date);
          const hasDate = textContent.includes(date.getFullYear().toString());
          
          // 验证：所有标签存在
          const hasTags = post.tags.every(tag => textContent.includes(tag));
          
          // 所有四个字段都必须存在
          expect(hasTitle).toBe(true);
          expect(hasDescription).toBe(true);
          expect(hasDate).toBe(true);
          expect(hasTags).toBe(true);
          
          // 清理
          container.remove();
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});

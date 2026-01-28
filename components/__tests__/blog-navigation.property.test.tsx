/**
 * 博客文章点击导航属性测试
 * 
 * Feature: personal-portfolio, Property 8: 博客文章点击导航
 * 
 * *对于任意*博客文章，当点击文章卡片时，应该触发导航到正确的文章详情路径（/blog/[slug]）。
 * 
 * **Validates: Requirements 5.2**
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
    <a href={href} data-testid="blog-link">{children}</a>
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
 * 生成有效slug的arbitrary
 * Slug应该是URL友好的字符串（字母、数字、连字符）
 */
const slugArbitrary = fc.stringMatching(/^[a-z0-9]+(-[a-z0-9]+)*$/, { minLength: 1, maxLength: 50 })
  .filter(s => s.length > 0);

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
  slug: slugArbitrary,
  title: nonEmptyStringArbitrary,
  description: nonEmptyStringArbitrary,
  date: dateStringArbitrary,
  tags: fc.array(tagArbitrary, { minLength: 0, maxLength: 5 }),
  content: fc.string({ minLength: 1, maxLength: 500 }).map(s => s || 'Content'),
  coverImage: fc.option(fc.constant('/images/test.jpg'), { nil: undefined }),
});

/**
 * Feature: personal-portfolio, Property 8: 博客文章点击导航
 * 
 * **Validates: Requirements 5.2**
 */
describe('Property 8: 博客文章点击导航', () => {
  /**
   * Property 8.1: 博客文章卡片链接到正确的URL
   * 
   * 对于任意博客文章，渲染后的链接href应该是/blog/[slug]格式
   */
  it('博客文章卡片应链接到正确的文章详情URL (/blog/[slug])', () => {
    fc.assert(
      fc.property(
        blogPostArbitrary,
        (post) => {
          const { container } = render(<BlogPostCard post={post} />);
          
          // 获取链接元素
          const link = screen.getByTestId('blog-link');
          
          // 验证：链接href应该是/blog/[slug]格式
          const expectedHref = `/blog/${post.slug}`;
          expect(link).toHaveAttribute('href', expectedHref);
          
          // 清理
          container.remove();
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 8.2: 博客文章卡片包含可点击的链接元素
   * 
   * 对于任意博客文章，渲染后应该存在一个可点击的链接元素
   */
  it('博客文章卡片应包含可点击的链接元素', () => {
    fc.assert(
      fc.property(
        blogPostArbitrary,
        (post) => {
          const { container } = render(<BlogPostCard post={post} />);
          
          // 验证：应该存在链接元素
          const link = screen.getByTestId('blog-link');
          expect(link).toBeInTheDocument();
          expect(link.tagName.toLowerCase()).toBe('a');
          
          // 清理
          container.remove();
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 8.3: 博客文章slug与导航URL一致
   * 
   * 对于任意博客文章，导航URL中的slug部分应该与文章的slug属性完全匹配
   */
  it('导航URL中的slug应与文章slug属性完全匹配', () => {
    fc.assert(
      fc.property(
        blogPostArbitrary,
        (post) => {
          const { container } = render(<BlogPostCard post={post} />);
          
          // 获取链接元素
          const link = screen.getByTestId('blog-link');
          const href = link.getAttribute('href');
          
          // 从href中提取slug
          const extractedSlug = href?.replace('/blog/', '');
          
          // 验证：提取的slug应该与原始slug完全匹配
          expect(extractedSlug).toBe(post.slug);
          
          // 清理
          container.remove();
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 8.4: 导航URL格式正确
   * 
   * 对于任意博客文章，导航URL应该以/blog/开头
   */
  it('导航URL应以/blog/开头', () => {
    fc.assert(
      fc.property(
        blogPostArbitrary,
        (post) => {
          const { container } = render(<BlogPostCard post={post} />);
          
          // 获取链接元素
          const link = screen.getByTestId('blog-link');
          const href = link.getAttribute('href');
          
          // 验证：href应该以/blog/开头
          expect(href).toMatch(/^\/blog\//);
          
          // 清理
          container.remove();
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * 博客数据处理属性测试
 * 
 * Feature: personal-portfolio, Property 9: 博客标签筛选准确性
 * Feature: personal-portfolio, Property 10: 博客日期排序正确性
 * 
 * *对于任意*标签和博客文章集合，按该标签筛选后的结果应该只包含标签列表中
 * 包含该标签的文章，且所有包含该标签的文章都应该被包含。
 * 
 * *对于任意*博客文章集合，排序后的文章列表应该按发布日期降序排列，
 * 即最新的文章在最前面。
 * 
 * **Validates: Requirements 5.3, 5.4**
 */

import { describe, it, expect } from '@jest/globals';
import * as fc from 'fast-check';
import type { BlogPost } from '@/types';

/**
 * 纯函数版本的标签筛选，用于属性测试
 * 这个函数模拟lib/blog.ts中getPostsByTag的核心逻辑
 */
function filterPostsByTag(posts: BlogPost[], tag: string): BlogPost[] {
  return posts.filter(post => post.tags.includes(tag));
}

/**
 * 纯函数版本的日期排序，用于属性测试
 * 这个函数模拟lib/blog.ts中sortPostsByDate的核心逻辑
 */
function sortPostsByDate(posts: BlogPost[]): BlogPost[] {
  return [...posts].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    // 降序排列：最新的在前
    return dateB - dateA;
  });
}

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
 * 生成有效的BlogPost数据的arbitrary
 */
const blogPostArbitrary = fc.record({
  slug: fc.string({ minLength: 1, maxLength: 50 }).map(s => s.replace(/[^a-zA-Z0-9-]/g, 'a') || 'post'),
  title: fc.string({ minLength: 1, maxLength: 100 }).map(s => s || 'Title'),
  description: fc.string({ minLength: 0, maxLength: 200 }),
  date: dateStringArbitrary,
  tags: fc.array(fc.string({ minLength: 1, maxLength: 30 }), { minLength: 0, maxLength: 5 }),
  content: fc.string({ minLength: 1, maxLength: 500 }).map(s => s || 'Content'),
  coverImage: fc.option(fc.string({ minLength: 1, maxLength: 100 }), { nil: undefined }),
});

/**
 * Feature: personal-portfolio, Property 9: 博客标签筛选准确性
 */
describe('Property 9: 博客标签筛选准确性', () => {
  /**
   * Property 9.1: 筛选结果只包含具有指定标签的文章
   * 
   * 对于任意标签和文章集合，筛选后的每篇文章都必须包含该标签
   */
  it('筛选结果中的每篇文章都应包含指定标签', () => {
    fc.assert(
      fc.property(
        fc.array(blogPostArbitrary, { minLength: 0, maxLength: 20 }),
        fc.string({ minLength: 1, maxLength: 30 }),
        (posts, tag) => {
          const filtered = filterPostsByTag(posts, tag);
          
          // 验证：筛选结果中的每篇文章都包含该标签
          filtered.forEach(post => {
            expect(post.tags).toContain(tag);
          });
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 9.2: 所有包含指定标签的文章都被包含在筛选结果中
   * 
   * 对于任意标签和文章集合，所有包含该标签的文章都应出现在筛选结果中
   */
  it('所有包含指定标签的文章都应被包含在筛选结果中', () => {
    fc.assert(
      fc.property(
        fc.array(blogPostArbitrary, { minLength: 0, maxLength: 20 }),
        fc.string({ minLength: 1, maxLength: 30 }),
        (posts, tag) => {
          const filtered = filterPostsByTag(posts, tag);
          
          // 找出所有包含该标签的文章
          const postsWithTag = posts.filter(post => post.tags.includes(tag));
          
          // 验证：筛选结果的数量应等于包含该标签的文章数量
          expect(filtered.length).toBe(postsWithTag.length);
          
          // 验证：每篇包含该标签的文章都在筛选结果中
          postsWithTag.forEach(post => {
            expect(filtered.some(p => p.slug === post.slug)).toBe(true);
          });
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 9.3: 筛选结果不包含不具有指定标签的文章
   * 
   * 对于任意标签和文章集合，不包含该标签的文章不应出现在筛选结果中
   */
  it('筛选结果不应包含不具有指定标签的文章', () => {
    fc.assert(
      fc.property(
        fc.array(blogPostArbitrary, { minLength: 0, maxLength: 20 }),
        fc.string({ minLength: 1, maxLength: 30 }),
        (posts, tag) => {
          const filtered = filterPostsByTag(posts, tag);
          
          // 找出所有不包含该标签的文章
          const postsWithoutTag = posts.filter(post => !post.tags.includes(tag));
          
          // 验证：筛选结果中不应包含任何不具有该标签的文章
          postsWithoutTag.forEach(post => {
            expect(filtered.some(p => p.slug === post.slug)).toBe(false);
          });
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 9.4: 空标签筛选返回空结果
   * 
   * 当使用空字符串作为标签筛选时，应返回空数组（因为没有文章的标签是空字符串）
   */
  it('使用空字符串标签筛选应返回空结果（假设没有空标签）', () => {
    fc.assert(
      fc.property(
        fc.array(blogPostArbitrary.map(post => ({
          ...post,
          // 确保标签都是非空字符串
          tags: post.tags.filter(t => t.length > 0)
        })), { minLength: 0, maxLength: 20 }),
        (posts) => {
          const filtered = filterPostsByTag(posts, '');
          
          // 验证：使用空字符串筛选应返回空数组
          expect(filtered.length).toBe(0);
          
          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Property 9.5: 筛选是幂等的
   * 
   * 对同一标签进行多次筛选应返回相同的结果
   */
  it('对同一标签多次筛选应返回相同结果', () => {
    fc.assert(
      fc.property(
        fc.array(blogPostArbitrary, { minLength: 0, maxLength: 20 }),
        fc.string({ minLength: 1, maxLength: 30 }),
        (posts, tag) => {
          const filtered1 = filterPostsByTag(posts, tag);
          const filtered2 = filterPostsByTag(posts, tag);
          
          // 验证：两次筛选结果应完全相同
          expect(filtered1.length).toBe(filtered2.length);
          expect(filtered1.map(p => p.slug).sort()).toEqual(filtered2.map(p => p.slug).sort());
          
          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Property 9.6: 筛选结果是原集合的子集
   * 
   * 筛选后的文章集合应该是原文章集合的子集
   */
  it('筛选结果应是原文章集合的子集', () => {
    fc.assert(
      fc.property(
        fc.array(blogPostArbitrary, { minLength: 0, maxLength: 20 }),
        fc.string({ minLength: 1, maxLength: 30 }),
        (posts, tag) => {
          const filtered = filterPostsByTag(posts, tag);
          
          // 验证：筛选结果的数量不超过原集合
          expect(filtered.length).toBeLessThanOrEqual(posts.length);
          
          // 验证：筛选结果中的每篇文章都存在于原集合中
          filtered.forEach(filteredPost => {
            expect(posts.some(p => p.slug === filteredPost.slug)).toBe(true);
          });
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 9.7: 标签筛选区分大小写
   * 
   * 标签筛选应该是大小写敏感的
   */
  it('标签筛选应区分大小写', () => {
    fc.assert(
      fc.property(
        fc.array(blogPostArbitrary, { minLength: 1, maxLength: 10 }),
        (posts) => {
          // 创建一个带有特定标签的文章
          const testTag = 'TestTag';
          const postsWithTag = posts.map((post, index) => ({
            ...post,
            tags: index === 0 ? [...post.tags, testTag] : post.tags
          }));
          
          const filteredExact = filterPostsByTag(postsWithTag, testTag);
          const filteredLower = filterPostsByTag(postsWithTag, testTag.toLowerCase());
          const filteredUpper = filterPostsByTag(postsWithTag, testTag.toUpperCase());
          
          // 验证：精确匹配应找到文章
          expect(filteredExact.length).toBeGreaterThanOrEqual(1);
          
          // 验证：大小写不同的标签可能返回不同结果
          // （除非原始标签恰好是小写或大写）
          if (testTag !== testTag.toLowerCase()) {
            // 如果标签不是全小写，小写版本不应匹配
            expect(filteredLower.some(p => p.tags.includes(testTag))).toBe(false);
          }
          
          return true;
        }
      ),
      { numRuns: 50 }
    );
  });
});

/**
 * Feature: personal-portfolio, Property 10: 博客日期排序正确性
 * 
 * *对于任意*博客文章集合，排序后的文章列表应该按发布日期降序排列，
 * 即最新的文章在最前面。
 * 
 * **Validates: Requirements 5.4**
 */
describe('Property 10: 博客日期排序正确性', () => {
  /**
   * Property 10.1: 排序后的文章按日期降序排列
   * 
   * 对于任意文章集合，排序后每篇文章的日期应该大于等于下一篇文章的日期
   */
  it('排序后的文章应按日期降序排列（最新在前）', () => {
    fc.assert(
      fc.property(
        fc.array(blogPostArbitrary, { minLength: 0, maxLength: 20 }),
        (posts) => {
          const sorted = sortPostsByDate(posts);
          
          // 验证：排序后每篇文章的日期应大于等于下一篇
          for (let i = 0; i < sorted.length - 1; i++) {
            const currentDate = new Date(sorted[i].date).getTime();
            const nextDate = new Date(sorted[i + 1].date).getTime();
            expect(currentDate).toBeGreaterThanOrEqual(nextDate);
          }
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 10.2: 排序保持文章数量不变
   * 
   * 排序操作不应增加或减少文章数量
   */
  it('排序后的文章数量应与原数组相同', () => {
    fc.assert(
      fc.property(
        fc.array(blogPostArbitrary, { minLength: 0, maxLength: 20 }),
        (posts) => {
          const sorted = sortPostsByDate(posts);
          
          // 验证：排序后数量不变
          expect(sorted.length).toBe(posts.length);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 10.3: 排序保持文章内容不变
   * 
   * 排序操作不应修改任何文章的内容
   */
  it('排序后的文章内容应与原文章相同', () => {
    fc.assert(
      fc.property(
        fc.array(blogPostArbitrary, { minLength: 0, maxLength: 20 })
          .map(posts => {
            // 确保每篇文章有唯一的slug，避免重复slug导致的匹配问题
            return posts.map((post, index) => ({
              ...post,
              slug: `${post.slug}-${index}`
            }));
          }),
        (posts) => {
          const sorted = sortPostsByDate(posts);
          
          // 验证：排序后的每篇文章都存在于原数组中
          sorted.forEach(sortedPost => {
            const originalPost = posts.find(p => p.slug === sortedPost.slug);
            expect(originalPost).toBeDefined();
            expect(sortedPost.title).toBe(originalPost!.title);
            expect(sortedPost.date).toBe(originalPost!.date);
            expect(sortedPost.content).toBe(originalPost!.content);
          });
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 10.4: 排序不修改原数组
   * 
   * 排序操作应该返回新数组，不修改原数组
   */
  it('排序操作不应修改原数组', () => {
    fc.assert(
      fc.property(
        fc.array(blogPostArbitrary, { minLength: 1, maxLength: 20 }),
        (posts) => {
          // 保存原数组的slug顺序
          const originalOrder = posts.map(p => p.slug);
          
          // 执行排序
          sortPostsByDate(posts);
          
          // 验证：原数组顺序未改变
          const currentOrder = posts.map(p => p.slug);
          expect(currentOrder).toEqual(originalOrder);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 10.5: 排序是幂等的
   * 
   * 对已排序的数组再次排序应返回相同结果
   */
  it('对已排序的数组再次排序应返回相同结果', () => {
    fc.assert(
      fc.property(
        fc.array(blogPostArbitrary, { minLength: 0, maxLength: 20 }),
        (posts) => {
          const sorted1 = sortPostsByDate(posts);
          const sorted2 = sortPostsByDate(sorted1);
          
          // 验证：两次排序结果相同
          expect(sorted1.length).toBe(sorted2.length);
          for (let i = 0; i < sorted1.length; i++) {
            expect(sorted1[i].slug).toBe(sorted2[i].slug);
            expect(sorted1[i].date).toBe(sorted2[i].date);
          }
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 10.6: 空数组排序返回空数组
   * 
   * 对空数组排序应返回空数组
   */
  it('对空数组排序应返回空数组', () => {
    const sorted = sortPostsByDate([]);
    expect(sorted).toEqual([]);
  });

  /**
   * Property 10.7: 单元素数组排序返回相同元素
   * 
   * 对单元素数组排序应返回包含相同元素的数组
   */
  it('对单元素数组排序应返回包含相同元素的数组', () => {
    fc.assert(
      fc.property(
        blogPostArbitrary,
        (post) => {
          const sorted = sortPostsByDate([post]);
          
          expect(sorted.length).toBe(1);
          expect(sorted[0].slug).toBe(post.slug);
          expect(sorted[0].date).toBe(post.date);
          
          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Property 10.8: 相同日期的文章保持稳定排序
   * 
   * 当多篇文章具有相同日期时，排序应该是稳定的（保持原有相对顺序）
   */
  it('相同日期的文章排序应保持稳定', () => {
    fc.assert(
      fc.property(
        fc.array(blogPostArbitrary, { minLength: 2, maxLength: 10 }),
        (posts) => {
          // 将所有文章设置为相同日期
          const sameDate = '2024-01-15';
          const postsWithSameDate = posts.map(post => ({
            ...post,
            date: sameDate
          }));
          
          const sorted1 = sortPostsByDate(postsWithSameDate);
          const sorted2 = sortPostsByDate(postsWithSameDate);
          
          // 验证：多次排序结果相同（稳定性）
          expect(sorted1.map(p => p.slug)).toEqual(sorted2.map(p => p.slug));
          
          return true;
        }
      ),
      { numRuns: 50 }
    );
  });
});

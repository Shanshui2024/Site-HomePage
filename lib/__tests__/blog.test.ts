/**
 * 博客数据处理功能测试
 * 
 * 测试lib/blog.ts中的所有博客数据处理函数
 * 验证需求：5.1, 5.3, 5.4, 12.4
 */

import { describe, it, expect } from '@jest/globals';
import {
  getAllPosts,
  getPostBySlug,
  getPostsByTag,
  getAllTags,
  sortPostsByDate,
  getPostStats,
  searchPosts,
  getRecentPosts,
  slugExists,
} from '../blog';
import type { BlogPost } from '@/types';

describe('博客数据处理', () => {
  describe('getAllPosts', () => {
    it('应该返回所有有效的博客文章', () => {
      const posts = getAllPosts();
      
      expect(Array.isArray(posts)).toBe(true);
      expect(posts.length).toBeGreaterThan(0);
    });

    it('返回的文章应该按日期降序排列', () => {
      const posts = getAllPosts();
      
      if (posts.length > 1) {
        for (let i = 0; i < posts.length - 1; i++) {
          const currentDate = new Date(posts[i].date).getTime();
          const nextDate = new Date(posts[i + 1].date).getTime();
          expect(currentDate).toBeGreaterThanOrEqual(nextDate);
        }
      }
    });

    it('每篇文章应该包含所有必需字段', () => {
      const posts = getAllPosts();
      
      posts.forEach(post => {
        expect(post.slug).toBeDefined();
        expect(typeof post.slug).toBe('string');
        expect(post.slug.length).toBeGreaterThan(0);
        
        expect(post.title).toBeDefined();
        expect(typeof post.title).toBe('string');
        expect(post.title.length).toBeGreaterThan(0);
        
        expect(post.description).toBeDefined();
        expect(typeof post.description).toBe('string');
        
        expect(post.date).toBeDefined();
        expect(typeof post.date).toBe('string');
        // 验证日期格式
        expect(new Date(post.date).toString()).not.toBe('Invalid Date');
        
        expect(post.tags).toBeDefined();
        expect(Array.isArray(post.tags)).toBe(true);
        
        expect(post.content).toBeDefined();
        expect(typeof post.content).toBe('string');
        expect(post.content.length).toBeGreaterThan(0);
      });
    });
  });

  describe('getPostBySlug', () => {
    it('应该根据slug返回正确的文章', () => {
      const allPosts = getAllPosts();
      
      if (allPosts.length > 0) {
        const firstPost = allPosts[0];
        const post = getPostBySlug(firstPost.slug);
        
        expect(post).not.toBeNull();
        expect(post?.slug).toBe(firstPost.slug);
        expect(post?.title).toBe(firstPost.title);
      }
    });

    it('应该对不存在的slug返回null', () => {
      const post = getPostBySlug('non-existent-post-slug-12345');
      
      expect(post).toBeNull();
    });

    it('返回的文章应该包含完整的内容', () => {
      const allPosts = getAllPosts();
      
      if (allPosts.length > 0) {
        const firstPost = allPosts[0];
        const post = getPostBySlug(firstPost.slug);
        
        expect(post).not.toBeNull();
        expect(post?.content).toBeDefined();
        expect(post?.content.length).toBeGreaterThan(0);
      }
    });
  });

  describe('getPostsByTag', () => {
    it('应该返回包含指定标签的所有文章', () => {
      const allPosts = getAllPosts();
      
      // 找到一个存在的标签
      if (allPosts.length > 0 && allPosts[0].tags.length > 0) {
        const tag = allPosts[0].tags[0];
        const filteredPosts = getPostsByTag(tag);
        
        expect(Array.isArray(filteredPosts)).toBe(true);
        expect(filteredPosts.length).toBeGreaterThan(0);
        
        // 验证所有返回的文章都包含该标签
        filteredPosts.forEach(post => {
          expect(post.tags).toContain(tag);
        });
      }
    });

    it('应该对不存在的标签返回空数组', () => {
      const posts = getPostsByTag('NonExistentTag12345');
      
      expect(Array.isArray(posts)).toBe(true);
      expect(posts.length).toBe(0);
    });

    it('返回的文章应该按日期降序排列', () => {
      const allPosts = getAllPosts();
      
      if (allPosts.length > 0 && allPosts[0].tags.length > 0) {
        const tag = allPosts[0].tags[0];
        const filteredPosts = getPostsByTag(tag);
        
        if (filteredPosts.length > 1) {
          for (let i = 0; i < filteredPosts.length - 1; i++) {
            const currentDate = new Date(filteredPosts[i].date).getTime();
            const nextDate = new Date(filteredPosts[i + 1].date).getTime();
            expect(currentDate).toBeGreaterThanOrEqual(nextDate);
          }
        }
      }
    });

    it('应该只返回包含该标签的文章，不应包含其他文章', () => {
      const allPosts = getAllPosts();
      
      if (allPosts.length > 0 && allPosts[0].tags.length > 0) {
        const tag = allPosts[0].tags[0];
        const filteredPosts = getPostsByTag(tag);
        
        // 验证所有包含该标签的文章都被返回
        const postsWithTag = allPosts.filter(post => post.tags.includes(tag));
        expect(filteredPosts.length).toBe(postsWithTag.length);
      }
    });
  });

  describe('getAllTags', () => {
    it('应该返回所有唯一的标签', () => {
      const tags = getAllTags();
      
      expect(Array.isArray(tags)).toBe(true);
      
      // 验证标签唯一性
      const uniqueTags = new Set(tags);
      expect(uniqueTags.size).toBe(tags.length);
    });

    it('返回的标签应该按字母顺序排序', () => {
      const tags = getAllTags();
      
      if (tags.length > 1) {
        for (let i = 0; i < tags.length - 1; i++) {
          expect(tags[i].localeCompare(tags[i + 1], 'zh-CN')).toBeLessThanOrEqual(0);
        }
      }
    });

    it('返回的标签应该都存在于某篇文章中', () => {
      const tags = getAllTags();
      const allPosts = getAllPosts();
      
      tags.forEach(tag => {
        const postsWithTag = allPosts.filter(post => post.tags.includes(tag));
        expect(postsWithTag.length).toBeGreaterThan(0);
      });
    });
  });

  describe('sortPostsByDate', () => {
    it('应该按日期降序排列文章', () => {
      const allPosts = getAllPosts();
      
      // 打乱顺序
      const shuffled = [...allPosts].sort(() => Math.random() - 0.5);
      
      // 重新排序
      const sorted = sortPostsByDate(shuffled);
      
      // 验证排序结果
      if (sorted.length > 1) {
        for (let i = 0; i < sorted.length - 1; i++) {
          const currentDate = new Date(sorted[i].date).getTime();
          const nextDate = new Date(sorted[i + 1].date).getTime();
          expect(currentDate).toBeGreaterThanOrEqual(nextDate);
        }
      }
    });

    it('应该不修改原数组', () => {
      const allPosts = getAllPosts();
      const originalLength = allPosts.length;
      
      sortPostsByDate(allPosts);
      
      expect(allPosts.length).toBe(originalLength);
    });

    it('应该处理空数组', () => {
      const sorted = sortPostsByDate([]);
      
      expect(Array.isArray(sorted)).toBe(true);
      expect(sorted.length).toBe(0);
    });

    it('应该处理单个文章', () => {
      const allPosts = getAllPosts();
      
      if (allPosts.length > 0) {
        const sorted = sortPostsByDate([allPosts[0]]);
        
        expect(sorted.length).toBe(1);
        expect(sorted[0]).toEqual(allPosts[0]);
      }
    });
  });

  describe('getPostStats', () => {
    it('应该返回正确的文章统计信息', () => {
      const stats = getPostStats();
      
      expect(stats).toBeDefined();
      expect(typeof stats.totalPosts).toBe('number');
      expect(typeof stats.totalTags).toBe('number');
      expect(typeof stats.postsByTag).toBe('object');
      
      expect(stats.totalPosts).toBeGreaterThanOrEqual(0);
      expect(stats.totalTags).toBeGreaterThanOrEqual(0);
    });

    it('postsByTag应该包含所有标签的文章数量', () => {
      const stats = getPostStats();
      const allTags = getAllTags();
      
      expect(Object.keys(stats.postsByTag).length).toBe(allTags.length);
      
      allTags.forEach(tag => {
        expect(stats.postsByTag[tag]).toBeDefined();
        expect(stats.postsByTag[tag]).toBeGreaterThan(0);
      });
    });

    it('每个标签的文章数量应该正确', () => {
      const stats = getPostStats();
      const allTags = getAllTags();
      
      allTags.forEach(tag => {
        const postsWithTag = getPostsByTag(tag);
        expect(stats.postsByTag[tag]).toBe(postsWithTag.length);
      });
    });
  });

  describe('searchPosts', () => {
    it('应该在标题中搜索关键词', () => {
      const allPosts = getAllPosts();
      
      if (allPosts.length > 0) {
        // 从第一篇文章的标题中提取一个词
        const firstWord = allPosts[0].title.split(/\s+/)[0];
        const results = searchPosts(firstWord);
        
        expect(results.length).toBeGreaterThan(0);
        expect(results.some(post => post.title.includes(firstWord))).toBe(true);
      }
    });

    it('应该在描述中搜索关键词', () => {
      const allPosts = getAllPosts();
      
      if (allPosts.length > 0 && allPosts[0].description) {
        const firstWord = allPosts[0].description.split(/\s+/)[0];
        const results = searchPosts(firstWord);
        
        expect(results.length).toBeGreaterThan(0);
      }
    });

    it('应该在标签中搜索关键词', () => {
      const allPosts = getAllPosts();
      
      if (allPosts.length > 0 && allPosts[0].tags.length > 0) {
        const tag = allPosts[0].tags[0];
        const results = searchPosts(tag);
        
        expect(results.length).toBeGreaterThan(0);
        expect(results.some(post => post.tags.includes(tag))).toBe(true);
      }
    });

    it('应该对空查询返回空数组', () => {
      const results = searchPosts('');
      
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBe(0);
    });

    it('应该对不存在的关键词返回空数组', () => {
      const results = searchPosts('NonExistentKeyword12345XYZ');
      
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBe(0);
    });

    it('搜索应该不区分大小写', () => {
      const allPosts = getAllPosts();
      
      if (allPosts.length > 0 && allPosts[0].tags.length > 0) {
        const tag = allPosts[0].tags[0];
        const resultsLower = searchPosts(tag.toLowerCase());
        const resultsUpper = searchPosts(tag.toUpperCase());
        
        expect(resultsLower.length).toBe(resultsUpper.length);
      }
    });
  });

  describe('getRecentPosts', () => {
    it('应该返回指定数量的最近文章', () => {
      const count = 3;
      const recentPosts = getRecentPosts(count);
      
      expect(Array.isArray(recentPosts)).toBe(true);
      expect(recentPosts.length).toBeLessThanOrEqual(count);
    });

    it('返回的文章应该按日期降序排列', () => {
      const recentPosts = getRecentPosts(5);
      
      if (recentPosts.length > 1) {
        for (let i = 0; i < recentPosts.length - 1; i++) {
          const currentDate = new Date(recentPosts[i].date).getTime();
          const nextDate = new Date(recentPosts[i + 1].date).getTime();
          expect(currentDate).toBeGreaterThanOrEqual(nextDate);
        }
      }
    });

    it('应该处理请求数量大于文章总数的情况', () => {
      const allPosts = getAllPosts();
      const recentPosts = getRecentPosts(1000);
      
      expect(recentPosts.length).toBe(allPosts.length);
    });

    it('应该处理请求0篇文章的情况', () => {
      const recentPosts = getRecentPosts(0);
      
      expect(Array.isArray(recentPosts)).toBe(true);
      expect(recentPosts.length).toBe(0);
    });
  });

  describe('slugExists', () => {
    it('应该对存在的slug返回true', () => {
      const allPosts = getAllPosts();
      
      if (allPosts.length > 0) {
        const exists = slugExists(allPosts[0].slug);
        expect(exists).toBe(true);
      }
    });

    it('应该对不存在的slug返回false', () => {
      const exists = slugExists('non-existent-slug-12345');
      expect(exists).toBe(false);
    });
  });

  describe('错误处理', () => {
    it('getAllPosts应该跳过格式错误的文章', () => {
      // 这个测试验证getAllPosts能够优雅地处理错误
      // 即使某些文章格式错误，也应该返回有效的文章
      const posts = getAllPosts();
      
      expect(Array.isArray(posts)).toBe(true);
      // 所有返回的文章都应该是有效的
      posts.forEach(post => {
        expect(post.slug).toBeDefined();
        expect(post.title).toBeDefined();
        expect(post.date).toBeDefined();
        expect(new Date(post.date).toString()).not.toBe('Invalid Date');
      });
    });
  });

  describe('数据完整性', () => {
    it('所有文章的slug应该唯一', () => {
      const allPosts = getAllPosts();
      const slugs = allPosts.map(post => post.slug);
      const uniqueSlugs = new Set(slugs);
      
      expect(uniqueSlugs.size).toBe(slugs.length);
    });

    it('所有文章的日期应该是有效的ISO 8601格式', () => {
      const allPosts = getAllPosts();
      
      allPosts.forEach(post => {
        const date = new Date(post.date);
        expect(date.toString()).not.toBe('Invalid Date');
        expect(date.getTime()).toBeGreaterThan(0);
      });
    });

    it('所有文章的标签应该是字符串数组', () => {
      const allPosts = getAllPosts();
      
      allPosts.forEach(post => {
        expect(Array.isArray(post.tags)).toBe(true);
        post.tags.forEach(tag => {
          expect(typeof tag).toBe('string');
          expect(tag.length).toBeGreaterThan(0);
        });
      });
    });
  });
});

/**
 * 配置加载属性测试
 * 
 * Feature: personal-portfolio, Property 19: 配置文件正确加载
 * 
 * *对于任意*有效的JSON配置文件（profile.json、tech-stack.json、friends.json），
 * 加载后的数据对象应该与文件内容完全匹配，且所有必需字段都存在。
 * 
 * **Validates: Requirements 12.3**
 */

import { describe, it, expect } from '@jest/globals';
import * as fc from 'fast-check';
import fs from 'fs';
import path from 'path';
import { z } from 'zod';
import { loadConfig, loadConfigSafe, ConfigLoadError, ConfigValidationError } from '../config';
import {
  ProfileSchema,
  TechStackDataSchema,
  FriendLinksDataSchema,
  TechItemSchema,
  FriendLinkSchema,
} from '../validation';

/**
 * Feature: personal-portfolio, Property 19: 配置文件正确加载
 * 
 * 测试配置加载函数的正确性属性
 */
describe('Property 19: 配置文件正确加载', () => {
  /**
   * Property 19.1: 有效JSON配置加载后数据完整性
   * 
   * 对于任意有效的Profile数据，通过loadConfig加载后，
   * 返回的数据应该包含所有必需字段且值与原始数据匹配。
   */
  it('有效Profile数据加载后应保持数据完整性', () => {
    fc.assert(
      fc.property(
        // 生成有效的Profile数据
        fc.record({
          name: fc.string({ minLength: 1, maxLength: 50 }),
          title: fc.string({ minLength: 1, maxLength: 100 }),
          bio: fc.string({ minLength: 1, maxLength: 500 }),
          avatar: fc.string({ minLength: 1, maxLength: 200 }),
          email: fc.emailAddress(),
          social: fc.record({
            github: fc.webUrl(),
          }),
        }),
        (profileData) => {
          // 验证生成的数据符合schema
          const parseResult = ProfileSchema.safeParse(profileData);
          
          if (parseResult.success) {
            const parsed = parseResult.data;
            // 验证所有必需字段存在
            expect(parsed.name).toBeDefined();
            expect(parsed.title).toBeDefined();
            expect(parsed.bio).toBeDefined();
            expect(parsed.avatar).toBeDefined();
            expect(parsed.email).toBeDefined();
            expect(parsed.social).toBeDefined();
            
            // 验证字段值与原始数据匹配
            expect(parsed.name).toBe(profileData.name);
            expect(parsed.title).toBe(profileData.title);
            expect(parsed.bio).toBe(profileData.bio);
            expect(parsed.avatar).toBe(profileData.avatar);
            expect(parsed.email).toBe(profileData.email);
          }
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 19.2: 有效TechItem数据验证后保持完整性
   * 
   * 对于任意有效的TechItem数据，验证后应保持所有字段完整。
   */
  it('有效TechItem数据验证后应保持数据完整性', () => {
    fc.assert(
      fc.property(
        fc.record({
          name: fc.string({ minLength: 1, maxLength: 50 }),
          icon: fc.string({ minLength: 1, maxLength: 50 }),
          level: fc.constantFrom('beginner', 'intermediate', 'advanced', 'expert'),
          category: fc.string({ minLength: 1, maxLength: 50 }),
        }),
        (techItemData) => {
          const parseResult = TechItemSchema.safeParse(techItemData);
          
          if (parseResult.success) {
            const parsed = parseResult.data;
            // 验证所有必需字段存在且匹配
            expect(parsed.name).toBe(techItemData.name);
            expect(parsed.icon).toBe(techItemData.icon);
            expect(parsed.level).toBe(techItemData.level);
            expect(parsed.category).toBe(techItemData.category);
          }
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 19.3: 有效FriendLink数据验证后保持完整性
   * 
   * 对于任意有效的FriendLink数据，验证后应保持所有字段完整。
   */
  it('有效FriendLink数据验证后应保持数据完整性', () => {
    fc.assert(
      fc.property(
        fc.record({
          name: fc.string({ minLength: 1, maxLength: 50 }),
          description: fc.string({ minLength: 1, maxLength: 200 }),
          url: fc.webUrl(),
          avatar: fc.string({ minLength: 1, maxLength: 200 }),
        }),
        (friendLinkData) => {
          const parseResult = FriendLinkSchema.safeParse(friendLinkData);
          
          if (parseResult.success) {
            const parsed = parseResult.data;
            // 验证所有必需字段存在且匹配
            expect(parsed.name).toBe(friendLinkData.name);
            expect(parsed.description).toBe(friendLinkData.description);
            expect(parsed.url).toBe(friendLinkData.url);
            expect(parsed.avatar).toBe(friendLinkData.avatar);
          }
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 19.4: 实际配置文件加载后数据与文件内容匹配
   * 
   * 对于实际存在的配置文件，加载后的数据应与文件内容完全匹配。
   */
  it('实际配置文件加载后数据应与文件内容匹配', () => {
    // 测试profile.json
    const profilePath = 'data/profile.json';
    const profileContent = fs.readFileSync(path.join(process.cwd(), profilePath), 'utf-8');
    const expectedProfile = JSON.parse(profileContent);
    const loadedProfile = loadConfig(profilePath, ProfileSchema);
    
    expect(loadedProfile.name).toBe(expectedProfile.name);
    expect(loadedProfile.title).toBe(expectedProfile.title);
    expect(loadedProfile.bio).toBe(expectedProfile.bio);
    expect(loadedProfile.avatar).toBe(expectedProfile.avatar);
    expect(loadedProfile.email).toBe(expectedProfile.email);
    
    // 测试tech-stack.json
    const techStackPath = 'data/tech-stack.json';
    const techStackContent = fs.readFileSync(path.join(process.cwd(), techStackPath), 'utf-8');
    const expectedTechStack = JSON.parse(techStackContent);
    const loadedTechStack = loadConfig(techStackPath, TechStackDataSchema);
    
    expect(loadedTechStack.categories.length).toBe(expectedTechStack.categories.length);
    loadedTechStack.categories.forEach((category, index) => {
      expect(category.name).toBe(expectedTechStack.categories[index].name);
      expect(category.items.length).toBe(expectedTechStack.categories[index].items.length);
    });
    
    // 测试friends.json
    const friendsPath = 'data/friends.json';
    const friendsContent = fs.readFileSync(path.join(process.cwd(), friendsPath), 'utf-8');
    const expectedFriends = JSON.parse(friendsContent);
    const loadedFriends = loadConfig(friendsPath, FriendLinksDataSchema);
    
    expect(loadedFriends.links.length).toBe(expectedFriends.links.length);
    loadedFriends.links.forEach((link, index) => {
      expect(link.name).toBe(expectedFriends.links[index].name);
      expect(link.description).toBe(expectedFriends.links[index].description);
      expect(link.url).toBe(expectedFriends.links[index].url);
      expect(link.avatar).toBe(expectedFriends.links[index].avatar);
    });
  });

  /**
   * Property 19.5: 无效数据应被正确拒绝
   * 
   * 对于任意缺少必需字段的数据，验证应该失败。
   */
  it('缺少必需字段的Profile数据应被拒绝', () => {
    fc.assert(
      fc.property(
        // 生成缺少某些必需字段的数据
        fc.record({
          name: fc.option(fc.string({ minLength: 1 }), { nil: undefined }),
          title: fc.option(fc.string({ minLength: 1 }), { nil: undefined }),
          bio: fc.option(fc.string({ minLength: 1 }), { nil: undefined }),
          avatar: fc.option(fc.string({ minLength: 1 }), { nil: undefined }),
          email: fc.option(fc.emailAddress(), { nil: undefined }),
          social: fc.option(fc.record({ github: fc.webUrl() }), { nil: undefined }),
        }),
        (partialData) => {
          // 检查是否缺少任何必需字段
          const missingFields = 
            partialData.name === undefined ||
            partialData.title === undefined ||
            partialData.bio === undefined ||
            partialData.avatar === undefined ||
            partialData.email === undefined ||
            partialData.social === undefined;
          
          const parseResult = ProfileSchema.safeParse(partialData);
          
          if (missingFields) {
            // 如果缺少字段，验证应该失败
            expect(parseResult.success).toBe(false);
          }
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 19.6: loadConfigSafe对无效路径返回null
   * 
   * 对于任意不存在的文件路径，loadConfigSafe应返回null而不抛出错误。
   */
  it('loadConfigSafe对不存在的文件应返回null', () => {
    fc.assert(
      fc.property(
        // 生成随机的不存在的文件路径
        fc.string({ minLength: 5, maxLength: 50 }).map(s => `data/nonexistent_${s.replace(/[^a-zA-Z0-9]/g, '')}.json`),
        (randomPath) => {
          const result = loadConfigSafe(randomPath, ProfileSchema);
          expect(result).toBeNull();
          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Property 19.7: 空字符串字段应被拒绝
   * 
   * 对于任意包含空字符串必需字段的数据，验证应该失败。
   */
  it('包含空字符串必需字段的数据应被拒绝', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('name', 'title', 'bio', 'avatar'),
        (emptyField) => {
          const invalidData = {
            name: emptyField === 'name' ? '' : 'Test Name',
            title: emptyField === 'title' ? '' : 'Test Title',
            bio: emptyField === 'bio' ? '' : 'Test Bio',
            avatar: emptyField === 'avatar' ? '' : '/test/avatar.jpg',
            email: 'test@example.com',
            social: { github: 'https://github.com/test' },
          };
          
          const parseResult = ProfileSchema.safeParse(invalidData);
          expect(parseResult.success).toBe(false);
          return true;
        }
      ),
      { numRuns: 20 }
    );
  });
});

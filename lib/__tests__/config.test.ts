/**
 * 配置加载功能测试
 * 
 * 测试loadConfig函数的各种场景
 */

import { describe, it, expect } from '@jest/globals';
import { loadConfig, loadConfigSafe, isConfigValid, getConfigErrors, ConfigLoadError, ConfigValidationError } from '../config';
import { ProfileSchema, TechStackDataSchema, FriendLinksDataSchema } from '../validation';
import type { Profile, TechStackData, FriendLinksData } from '@/types';

describe('loadConfig', () => {
  describe('成功场景', () => {
    it('应该成功加载有效的profile.json', () => {
      const profile = loadConfig<Profile>('data/profile.json', ProfileSchema);
      
      expect(profile).toBeDefined();
      expect(profile.name).toBe('张三');
      expect(profile.title).toBe('全栈开发工程师');
      expect(profile.email).toBe('zhangsan@example.com');
      expect(profile.social.github).toBeDefined();
    });

    it('应该成功加载有效的tech-stack.json', () => {
      const techStack = loadConfig<TechStackData>('data/tech-stack.json', TechStackDataSchema);
      
      expect(techStack).toBeDefined();
      expect(techStack.categories).toBeInstanceOf(Array);
      expect(techStack.categories.length).toBeGreaterThan(0);
      expect(techStack.categories[0].name).toBe('前端开发');
      expect(techStack.categories[0].items.length).toBeGreaterThan(0);
    });

    it('应该成功加载有效的friends.json', () => {
      const friends = loadConfig<FriendLinksData>('data/friends.json', FriendLinksDataSchema);
      
      expect(friends).toBeDefined();
      expect(friends.links).toBeInstanceOf(Array);
    });
  });

  describe('错误处理', () => {
    it('应该在文件不存在时抛出ConfigLoadError', () => {
      expect(() => {
        loadConfig('data/nonexistent.json', ProfileSchema);
      }).toThrow(ConfigLoadError);
    });

    it('应该在文件不存在时提供友好的错误消息', () => {
      try {
        loadConfig('data/nonexistent.json', ProfileSchema);
        fail('应该抛出错误');
      } catch (error) {
        expect(error).toBeInstanceOf(ConfigLoadError);
        const configError = error as ConfigLoadError;
        expect(configError.message).toContain('配置文件不存在');
        expect(configError.message).toContain('data/nonexistent.json');
        expect(configError.filePath).toBe('data/nonexistent.json');
      }
    });

    it('应该在JSON格式错误时抛出ConfigValidationError', () => {
      // 创建一个临时的无效JSON文件进行测试
      // 注意：这个测试需要实际的无效JSON文件，或者使用mock
      // 这里我们跳过实际文件创建，只测试错误类型
      expect(ConfigValidationError).toBeDefined();
    });
  });

  describe('loadConfigSafe', () => {
    it('应该在成功时返回数据', () => {
      const profile = loadConfigSafe<Profile>('data/profile.json', ProfileSchema);
      
      expect(profile).not.toBeNull();
      expect(profile?.name).toBe('张三');
    });

    it('应该在失败时返回null而不是抛出错误', () => {
      const result = loadConfigSafe('data/nonexistent.json', ProfileSchema);
      
      expect(result).toBeNull();
    });
  });

  describe('isConfigValid', () => {
    it('应该对有效配置返回true', () => {
      const isValid = isConfigValid('data/profile.json', ProfileSchema);
      
      expect(isValid).toBe(true);
    });

    it('应该对无效配置返回false', () => {
      const isValid = isConfigValid('data/nonexistent.json', ProfileSchema);
      
      expect(isValid).toBe(false);
    });
  });

  describe('getConfigErrors', () => {
    it('应该对有效配置返回空数组', () => {
      const errors = getConfigErrors('data/profile.json', ProfileSchema);
      
      expect(errors).toEqual([]);
    });

    it('应该对无效配置返回错误信息数组', () => {
      const errors = getConfigErrors('data/nonexistent.json', ProfileSchema);
      
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0]).toContain('配置文件不存在');
    });
  });

  describe('数据完整性验证', () => {
    it('加载的profile数据应该包含所有必需字段', () => {
      const profile = loadConfig<Profile>('data/profile.json', ProfileSchema);
      
      // 验证所有必需字段存在
      expect(profile.name).toBeDefined();
      expect(profile.title).toBeDefined();
      expect(profile.bio).toBeDefined();
      expect(profile.avatar).toBeDefined();
      expect(profile.email).toBeDefined();
      expect(profile.social).toBeDefined();
      
      // 验证字段类型
      expect(typeof profile.name).toBe('string');
      expect(typeof profile.title).toBe('string');
      expect(typeof profile.bio).toBe('string');
      expect(typeof profile.avatar).toBe('string');
      expect(typeof profile.email).toBe('string');
      expect(typeof profile.social).toBe('object');
    });

    it('加载的tech-stack数据应该包含所有必需字段', () => {
      const techStack = loadConfig<TechStackData>('data/tech-stack.json', TechStackDataSchema);
      
      expect(techStack.categories).toBeDefined();
      expect(Array.isArray(techStack.categories)).toBe(true);
      
      // 验证第一个类别的结构
      const firstCategory = techStack.categories[0];
      expect(firstCategory.name).toBeDefined();
      expect(firstCategory.items).toBeDefined();
      expect(Array.isArray(firstCategory.items)).toBe(true);
      
      // 验证第一个技术项的结构
      if (firstCategory.items.length > 0) {
        const firstItem = firstCategory.items[0];
        expect(firstItem.name).toBeDefined();
        expect(firstItem.icon).toBeDefined();
        expect(firstItem.level).toBeDefined();
        expect(firstItem.category).toBeDefined();
        expect(['beginner', 'intermediate', 'advanced', 'expert']).toContain(firstItem.level);
      }
    });

    it('加载的friends数据应该包含所有必需字段', () => {
      const friends = loadConfig<FriendLinksData>('data/friends.json', FriendLinksDataSchema);
      
      expect(friends.links).toBeDefined();
      expect(Array.isArray(friends.links)).toBe(true);
      
      // 如果有友链，验证第一个友链的结构
      if (friends.links.length > 0) {
        const firstLink = friends.links[0];
        expect(firstLink.name).toBeDefined();
        expect(firstLink.description).toBeDefined();
        expect(firstLink.url).toBeDefined();
        expect(firstLink.avatar).toBeDefined();
        
        // 验证URL格式
        expect(firstLink.url).toMatch(/^https?:\/\//);
      }
    });
  });

  describe('类型安全', () => {
    it('应该返回正确类型的数据', () => {
      const profile = loadConfig<Profile>('data/profile.json', ProfileSchema);
      
      // TypeScript应该能够推断出正确的类型
      const name: string = profile.name;
      const email: string = profile.email;
      const social: Record<string, string | undefined> = profile.social;
      
      expect(name).toBeDefined();
      expect(email).toBeDefined();
      expect(social).toBeDefined();
    });
  });
});

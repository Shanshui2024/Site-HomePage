/**
 * 数据验证Schema单元测试
 * 
 * 测试所有Zod schema和类型守卫函数
 * 验证需求：10.2, 12.3
 */

import {
  ProfileSchema,
  TechItemSchema,
  TechCategorySchema,
  TechStackDataSchema,
  FriendLinkSchema,
  FriendLinksDataSchema,
  EducationSchema,
  ExperienceSchema,
  TimelineEventSchema,
  AboutDataSchema,
  isProfile,
  isTechItem,
  isTechStackData,
  isFriendLink,
  isFriendLinksData,
  isAboutData,
  validateData,
  validateDataSafe,
  getValidationErrors,
} from '../validation';

describe('数据验证Schema', () => {
  describe('ProfileSchema', () => {
    it('应该验证有效的个人信息数据', () => {
      const validProfile = {
        name: '张三',
        title: '全栈开发工程师',
        bio: '热爱编程的开发者',
        avatar: '/images/avatar.jpg',
        email: 'zhangsan@example.com',
        social: {
          github: 'https://github.com/zhangsan',
          twitter: 'https://twitter.com/zhangsan',
        },
      };

      const result = ProfileSchema.safeParse(validProfile);
      expect(result.success).toBe(true);
      expect(isProfile(validProfile)).toBe(true);
    });

    it('应该拒绝无效的邮箱格式', () => {
      const invalidProfile = {
        name: '张三',
        title: '全栈开发工程师',
        bio: '热爱编程的开发者',
        avatar: '/images/avatar.jpg',
        email: 'invalid-email',
        social: { github: 'https://github.com/zhangsan' },
      };

      const result = ProfileSchema.safeParse(invalidProfile);
      expect(result.success).toBe(false);
      expect(isProfile(invalidProfile)).toBe(false);
    });

    it('应该拒绝空的社交媒体对象', () => {
      const invalidProfile = {
        name: '张三',
        title: '全栈开发工程师',
        bio: '热爱编程的开发者',
        avatar: '/images/avatar.jpg',
        email: 'zhangsan@example.com',
        social: {},
      };

      const result = ProfileSchema.safeParse(invalidProfile);
      expect(result.success).toBe(false);
    });
  });

  describe('TechItemSchema', () => {
    it('应该验证有效的技术项数据', () => {
      const validTechItem = {
        name: 'React',
        icon: 'react',
        level: 'expert' as const,
        category: '前端开发',
      };

      const result = TechItemSchema.safeParse(validTechItem);
      expect(result.success).toBe(true);
      expect(isTechItem(validTechItem)).toBe(true);
    });

    it('应该拒绝无效的熟练度级别', () => {
      const invalidTechItem = {
        name: 'React',
        icon: 'react',
        level: 'master', // 无效的级别
        category: '前端开发',
      };

      const result = TechItemSchema.safeParse(invalidTechItem);
      expect(result.success).toBe(false);
      expect(isTechItem(invalidTechItem)).toBe(false);
    });
  });

  describe('TechStackDataSchema', () => {
    it('应该验证有效的技术栈数据', () => {
      const validTechStack = {
        categories: [
          {
            name: '前端开发',
            items: [
              {
                name: 'React',
                icon: 'react',
                level: 'expert' as const,
                category: '前端开发',
              },
            ],
          },
        ],
      };

      const result = TechStackDataSchema.safeParse(validTechStack);
      expect(result.success).toBe(true);
      expect(isTechStackData(validTechStack)).toBe(true);
    });

    it('应该拒绝空的类别数组', () => {
      const invalidTechStack = {
        categories: [],
      };

      const result = TechStackDataSchema.safeParse(invalidTechStack);
      expect(result.success).toBe(false);
    });

    it('应该拒绝类别中没有技术项', () => {
      const invalidTechStack = {
        categories: [
          {
            name: '前端开发',
            items: [],
          },
        ],
      };

      const result = TechStackDataSchema.safeParse(invalidTechStack);
      expect(result.success).toBe(false);
    });
  });

  describe('FriendLinkSchema', () => {
    it('应该验证有效的友链数据', () => {
      const validFriendLink = {
        name: '小明的博客',
        description: '一个很棒的技术博客',
        url: 'https://example.com',
        avatar: '/images/friend-avatar.jpg',
      };

      const result = FriendLinkSchema.safeParse(validFriendLink);
      expect(result.success).toBe(true);
      expect(isFriendLink(validFriendLink)).toBe(true);
    });

    it('应该拒绝无效的URL格式', () => {
      const invalidFriendLink = {
        name: '小明的博客',
        description: '一个很棒的技术博客',
        url: 'not-a-url',
        avatar: '/images/friend-avatar.jpg',
      };

      const result = FriendLinkSchema.safeParse(invalidFriendLink);
      expect(result.success).toBe(false);
      expect(isFriendLink(invalidFriendLink)).toBe(false);
    });
  });

  describe('FriendLinksDataSchema', () => {
    it('应该验证有效的友链列表数据', () => {
      const validFriendLinksData = {
        links: [
          {
            name: '小明的博客',
            description: '一个很棒的技术博客',
            url: 'https://example.com',
            avatar: '/images/friend-avatar.jpg',
          },
        ],
      };

      const result = FriendLinksDataSchema.safeParse(validFriendLinksData);
      expect(result.success).toBe(true);
      expect(isFriendLinksData(validFriendLinksData)).toBe(true);
    });

    it('应该允许空的友链数组', () => {
      const validFriendLinksData = {
        links: [],
      };

      const result = FriendLinksDataSchema.safeParse(validFriendLinksData);
      expect(result.success).toBe(true);
    });
  });

  describe('AboutDataSchema', () => {
    it('应该验证有效的关于页面数据', () => {
      const validAboutData = {
        introduction: '我是一名全栈开发工程师',
        education: [
          {
            school: '某某大学',
            degree: '计算机科学学士',
            period: '2015-2019',
          },
        ],
        experience: [
          {
            company: '某某公司',
            position: '高级工程师',
            period: '2019-2024',
            description: '负责前端开发',
          },
        ],
        timeline: [
          {
            year: '2024',
            event: '加入新公司',
          },
        ],
      };

      const result = AboutDataSchema.safeParse(validAboutData);
      expect(result.success).toBe(true);
      expect(isAboutData(validAboutData)).toBe(true);
    });

    it('应该允许可选字段为空', () => {
      const validAboutData = {
        introduction: '我是一名全栈开发工程师',
      };

      const result = AboutDataSchema.safeParse(validAboutData);
      expect(result.success).toBe(true);
    });
  });

  describe('验证辅助函数', () => {
    describe('validateData', () => {
      it('应该返回验证成功的数据', () => {
        const validData = {
          name: '小明的博客',
          description: '一个很棒的技术博客',
          url: 'https://example.com',
          avatar: '/images/friend-avatar.jpg',
        };

        const result = validateData(FriendLinkSchema, validData, '友链');
        expect(result).toEqual(validData);
      });

      it('应该在验证失败时抛出错误', () => {
        const invalidData = {
          name: '小明的博客',
          description: '一个很棒的技术博客',
          url: 'not-a-url',
          avatar: '/images/friend-avatar.jpg',
        };

        expect(() => {
          validateData(FriendLinkSchema, invalidData, '友链');
        }).toThrow('友链数据验证失败');
      });
    });

    describe('validateDataSafe', () => {
      it('应该返回验证成功的数据', () => {
        const validData = {
          name: '小明的博客',
          description: '一个很棒的技术博客',
          url: 'https://example.com',
          avatar: '/images/friend-avatar.jpg',
        };

        const result = validateDataSafe(FriendLinkSchema, validData);
        expect(result).toEqual(validData);
      });

      it('应该在验证失败时返回null', () => {
        const invalidData = {
          name: '小明的博客',
          description: '一个很棒的技术博客',
          url: 'not-a-url',
          avatar: '/images/friend-avatar.jpg',
        };

        const result = validateDataSafe(FriendLinkSchema, invalidData);
        expect(result).toBeNull();
      });
    });

    describe('getValidationErrors', () => {
      it('应该返回空数组当验证成功时', () => {
        const validData = {
          name: '小明的博客',
          description: '一个很棒的技术博客',
          url: 'https://example.com',
          avatar: '/images/friend-avatar.jpg',
        };

        const errors = getValidationErrors(FriendLinkSchema, validData);
        expect(errors).toEqual([]);
      });

      it('应该返回错误信息数组当验证失败时', () => {
        const invalidData = {
          name: '',
          description: '一个很棒的技术博客',
          url: 'not-a-url',
          avatar: '/images/friend-avatar.jpg',
        };

        const errors = getValidationErrors(FriendLinkSchema, invalidData);
        expect(errors.length).toBeGreaterThan(0);
        expect(errors.some(err => err.includes('name'))).toBe(true);
        expect(errors.some(err => err.includes('url'))).toBe(true);
      });
    });
  });
});

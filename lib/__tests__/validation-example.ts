/**
 * 数据验证Schema使用示例
 * 
 * 演示如何使用validation.ts中的schema和类型守卫函数
 */

import {
  ProfileSchema,
  TechStackDataSchema,
  BlogPostSchema,
  FriendLinkSchema,
  isProfile,
  isBlogPost,
  validateData,
  validateDataSafe,
  getValidationErrors,
} from '../validation';

// ============================================================================
// 示例 1: 验证个人信息数据
// ============================================================================

const profileData = {
  name: '张三',
  title: '全栈开发工程师',
  bio: '热爱编程，专注于Web开发',
  avatar: '/images/avatar.jpg',
  email: 'zhangsan@example.com',
  social: {
    github: 'https://github.com/zhangsan',
    twitter: 'https://twitter.com/zhangsan',
  },
};

// 方法1: 使用safeParse
const profileResult = ProfileSchema.safeParse(profileData);
if (profileResult.success) {
  console.log('✓ 个人信息验证成功:', profileResult.data);
} else {
  console.log('✗ 个人信息验证失败');
}

// 方法2: 使用类型守卫
if (isProfile(profileData)) {
  console.log('✓ 个人信息类型正确');
}

// 方法3: 使用validateData（会抛出错误）
try {
  const validatedProfile = validateData(ProfileSchema, profileData, '个人信息');
  console.log('✓ 个人信息验证通过:', validatedProfile.name);
} catch (error) {
  console.error('✗ 验证失败:', error);
}

// ============================================================================
// 示例 2: 验证技术栈数据
// ============================================================================

const techStackData = {
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
        {
          name: 'TypeScript',
          icon: 'typescript',
          level: 'advanced' as const,
          category: '前端开发',
        },
      ],
    },
    {
      name: '后端开发',
      items: [
        {
          name: 'Node.js',
          icon: 'nodejs',
          level: 'intermediate' as const,
          category: '后端开发',
        },
      ],
    },
  ],
};

const techStackResult = TechStackDataSchema.safeParse(techStackData);
if (techStackResult.success) {
  console.log('✓ 技术栈数据验证成功');
  console.log(`  - 类别数量: ${techStackResult.data.categories.length}`);
}

// ============================================================================
// 示例 3: 验证博客文章数据
// ============================================================================

const blogPostData = {
  slug: 'my-first-post',
  title: '我的第一篇博客文章',
  description: '这是一篇关于TypeScript的文章',
  date: '2024-01-15T10:00:00.000Z',
  tags: ['TypeScript', 'JavaScript', 'Web开发'],
  content: '# 标题\n\n这是文章的正文内容...',
};

if (isBlogPost(blogPostData)) {
  console.log('✓ 博客文章数据类型正确');
  console.log(`  - 标题: ${blogPostData.title}`);
  console.log(`  - 标签: ${blogPostData.tags.join(', ')}`);
}

// ============================================================================
// 示例 4: 处理验证错误
// ============================================================================

const invalidFriendLink = {
  name: '',  // 空名称（无效）
  description: '一个很棒的博客',
  url: 'not-a-valid-url',  // 无效的URL
  avatar: '/images/avatar.jpg',
};

// 方法1: 使用validateDataSafe（返回null而不抛出错误）
const safeResult = validateDataSafe(FriendLinkSchema, invalidFriendLink);
if (safeResult === null) {
  console.log('✗ 友链数据验证失败（安全模式）');
}

// 方法2: 获取详细的错误信息
const errors = getValidationErrors(FriendLinkSchema, invalidFriendLink);
if (errors.length > 0) {
  console.log('✗ 友链数据验证失败，错误详情:');
  errors.forEach(error => console.log(`  - ${error}`));
}

// ============================================================================
// 示例 5: 验证部分数据（使用默认值）
// ============================================================================

const blogPostWithoutTags = {
  slug: 'second-post',
  title: '第二篇文章',
  description: '没有标签的文章',
  date: '2024-01-16T10:00:00.000Z',
  content: '文章内容...',
  // tags字段被省略，会使用默认值[]
};

const blogResult = BlogPostSchema.safeParse(blogPostWithoutTags);
if (blogResult.success) {
  console.log('✓ 博客文章验证成功（使用默认标签）');
  console.log(`  - 标签数量: ${blogResult.data.tags.length}`);
}

// ============================================================================
// 运行示例
// ============================================================================

console.log('\n=== 数据验证Schema使用示例 ===\n');
console.log('所有示例代码已准备就绪！');
console.log('取消注释上面的代码来运行具体示例。');

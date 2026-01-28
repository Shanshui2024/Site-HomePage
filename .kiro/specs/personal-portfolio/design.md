# 设计文档

## 概述

个人简介页面系统是一个基于Next.js 14的现代化单页应用（SPA），采用App Router架构。系统使用React 18作为UI库，TailwindCSS处理样式，TypeScript提供类型安全。整体架构遵循组件化设计原则，将页面、组件、数据和样式清晰分离，确保代码的可维护性和可扩展性。

系统采用静态站点生成（SSG）策略，在构建时预渲染所有页面，确保最佳性能和SEO表现。内容通过JSON配置文件和Markdown文件管理，支持无需修改代码即可更新内容。

## 架构

### 技术栈

- **框架**: Next.js 14 (App Router)
- **UI库**: React 18
- **语言**: TypeScript 5
- **样式**: TailwindCSS 3
- **动画**: Framer Motion
- **Markdown**: gray-matter + react-markdown
- **图标**: Lucide React
- **部署**: Vercel / 静态导出

### 项目结构

```
personal-portfolio/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # 根布局
│   ├── page.tsx                 # 首页
│   ├── tech-stack/              # 技术栈页面
│   │   └── page.tsx
│   ├── blog/                    # 博客页面
│   │   ├── page.tsx            # 文章列表
│   │   └── [slug]/             # 文章详情
│   │       └── page.tsx
│   ├── friends/                 # 友链页面
│   │   └── page.tsx
│   └── about/                   # 关于页面
│       └── page.tsx
├── components/                   # 可复用组件
│   ├── layout/                  # 布局组件
│   │   ├── Navigation.tsx      # 导航栏
│   │   ├── Footer.tsx          # 页脚
│   │   └── MobileMenu.tsx      # 移动端菜单
│   ├── ui/                      # UI组件
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── Badge.tsx
│   └── animations/              # 动画组件
│       ├── FadeIn.tsx
│       └── SlideIn.tsx
├── lib/                         # 工具函数
│   ├── blog.ts                 # 博客数据处理
│   ├── config.ts               # 配置加载
│   └── utils.ts                # 通用工具
├── data/                        # 数据文件
│   ├── profile.json            # 个人信息
│   ├── tech-stack.json         # 技术栈数据
│   ├── friends.json            # 友链数据
│   └── posts/                  # 博客文章（Markdown）
│       ├── post-1.md
│       └── post-2.md
├── public/                      # 静态资源
│   ├── images/
│   └── icons/
├── styles/                      # 全局样式
│   └── globals.css
├── types/                       # TypeScript类型定义
│   └── index.ts
├── tailwind.config.ts          # TailwindCSS配置
├── next.config.js              # Next.js配置
└── package.json
```

### 架构层次

1. **表现层（Presentation Layer）**
   - React组件负责UI渲染
   - 使用TailwindCSS进行样式化
   - Framer Motion提供动画效果

2. **数据层（Data Layer）**
   - JSON文件存储结构化数据
   - Markdown文件存储博客内容
   - 构建时读取并解析数据

3. **业务逻辑层（Business Logic Layer）**
   - lib目录下的工具函数处理数据转换
   - 类型定义确保数据一致性
   - 配置管理集中化

## 组件与接口

### 核心组件

#### 1. Navigation Component

导航组件提供全局导航功能，支持桌面端和移动端。

```typescript
interface NavigationProps {
  currentPath: string;
}

interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

const navItems: NavItem[] = [
  { label: '首页', href: '/' },
  { label: '技术栈', href: '/tech-stack' },
  { label: '博客', href: '/blog' },
  { label: '友链', href: '/friends' },
  { label: '关于', href: '/about' },
];
```

**功能**：
- 显示所有页面链接
- 高亮当前激活页面
- 响应式：桌面端显示完整导航，移动端显示汉堡菜单
- 平滑的页面切换动画

#### 2. Theme Manager

主题管理器通过TailwindCSS配置实现蓝色主题。

```typescript
// tailwind.config.ts
const config = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',  // 主蓝色
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
      },
    },
  },
};
```

#### 3. Blog Module

博客模块处理文章的读取、解析和展示。

```typescript
interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  content: string;
  coverImage?: string;
}

interface BlogListProps {
  posts: BlogPost[];
  selectedTag?: string;
}

// 博客数据处理函数
function getAllPosts(): BlogPost[];
function getPostBySlug(slug: string): BlogPost;
function getPostsByTag(tag: string): BlogPost[];
function getAllTags(): string[];
```

**Markdown格式**：
```markdown
---
title: "文章标题"
description: "文章摘要"
date: "2024-01-01"
tags: ["React", "Next.js"]
coverImage: "/images/cover.jpg"
---

文章内容...
```

#### 4. Tech Stack Display

技术栈展示组件以分类方式展示技术。

```typescript
interface TechItem {
  name: string;
  icon: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  category: string;
}

interface TechCategory {
  name: string;
  items: TechItem[];
}

interface TechStackData {
  categories: TechCategory[];
}
```

**数据文件示例（data/tech-stack.json）**：
```json
{
  "categories": [
    {
      "name": "前端开发",
      "items": [
        {
          "name": "React",
          "icon": "react",
          "level": "expert",
          "category": "前端开发"
        }
      ]
    }
  ]
}
```

#### 5. Friend Links Module

友链模块展示友情链接卡片。

```typescript
interface FriendLink {
  name: string;
  description: string;
  url: string;
  avatar: string;
}

interface FriendLinksProps {
  links: FriendLink[];
}
```

#### 6. Animation System

动画系统基于Framer Motion实现。

```typescript
interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
}

interface SlideInProps {
  children: React.ReactNode;
  direction?: 'left' | 'right' | 'up' | 'down';
  delay?: number;
}
```

**动画配置**：
```typescript
const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.3 }
  }
};

const slideInVariants = {
  hidden: { x: -50, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: { duration: 0.3 }
  }
};
```

### 响应式布局系统

使用TailwindCSS的响应式断点：

```typescript
const breakpoints = {
  sm: '640px',   // 移动端
  md: '768px',   // 平板端
  lg: '1024px',  // 桌面端
  xl: '1280px',  // 大屏幕
};
```

**布局策略**：
- 移动端（<768px）：单列布局，汉堡菜单
- 平板端（768px-1023px）：两列布局，简化导航
- 桌面端（≥1024px）：多列布局，完整导航

## 数据模型

### Profile Data Model

```typescript
interface Profile {
  name: string;
  title: string;
  bio: string;
  avatar: string;
  email: string;
  social: {
    github?: string;
    twitter?: string;
    linkedin?: string;
    [key: string]: string | undefined;
  };
}
```

### Tech Stack Data Model

```typescript
interface TechStackData {
  categories: Array<{
    name: string;
    items: Array<{
      name: string;
      icon: string;
      level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
      category: string;
    }>;
  }>;
}
```

### Blog Post Data Model

```typescript
interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  content: string;
  coverImage?: string;
}

interface BlogMetadata {
  title: string;
  description: string;
  date: string;
  tags: string[];
  coverImage?: string;
}
```

### Friend Link Data Model

```typescript
interface FriendLink {
  name: string;
  description: string;
  url: string;
  avatar: string;
}

interface FriendLinksData {
  links: FriendLink[];
}
```

### About Data Model

```typescript
interface AboutData {
  introduction: string;
  education?: Array<{
    school: string;
    degree: string;
    period: string;
  }>;
  experience?: Array<{
    company: string;
    position: string;
    period: string;
    description: string;
  }>;
  timeline?: Array<{
    year: string;
    event: string;
  }>;
}
```

## 正确性属性

正确性属性是一种特征或行为，应该在系统的所有有效执行中保持为真——本质上是关于系统应该做什么的形式化陈述。属性充当人类可读规范和机器可验证正确性保证之间的桥梁。


### 属性反思

在编写正确性属性之前，让我审查所有可测试的验收标准，识别逻辑冗余：

**可测试属性列表**：
1. 导航激活状态（1.2）
2. 响应式导航（1.5）
3. 颜色对比度（2.4）
4. 技术栈分类展示（4.1）
5. 技术栈悬停显示（4.2）
6. 技术栈图标展示（4.3）
7. 博客文章字段完整性（5.1）
8. 博客文章导航（5.2）
9. 博客标签筛选（5.3）
10. 博客日期排序（5.4）
11. 友链新标签打开（6.2）
12. 友链字段完整性（6.3）
13. Markdown渲染（7.4）
14. 响应式断点（8.1）
15. 移动端内容隐藏（8.3）
16. 触摸目标尺寸（8.4）
17. 动画时长限制（9.4）
18. 减少动画偏好（9.5）
19. 配置文件加载（12.3）
20. Markdown解析（12.4）

**冗余分析**：
- **Markdown相关（7.4和12.4）**：这两个属性都涉及Markdown处理。12.4（Markdown解析）是更底层的功能，7.4（Markdown渲染）依赖于12.4。我们可以将它们合并为一个往返属性，测试Markdown解析和渲染的完整性。
- **响应式相关（1.5、8.1、8.3）**：这些都是关于响应式行为的。1.5测试导航的响应式变化，8.1测试断点支持，8.3测试移动端内容隐藏。这些是不同层面的测试，应该保留，但可以在实现时合并到一个综合的响应式测试套件中。
- **字段完整性（5.1和6.3）**：这两个属性都测试渲染后的数据完整性。它们针对不同的数据类型（博客文章和友链），应该保留为独立属性。

**结论**：大多数属性提供独特的验证价值。唯一的合并是Markdown相关的属性（7.4和12.4）可以合并为一个往返属性。

### 正确性属性

#### 属性 1：导航激活状态一致性

*对于任意*页面路径，当用户访问该页面时，导航组件中对应的链接应该被标记为激活状态，且只有一个链接处于激活状态。

**验证需求：1.2**

#### 属性 2：响应式导航适配

*对于任意*视口宽度，当宽度小于768px时，导航组件应该渲染为汉堡菜单；当宽度大于等于768px时，应该渲染为完整导航栏。

**验证需求：1.5**

#### 属性 3：颜色对比度符合WCAG标准

*对于任意*主题配置中的文字和背景颜色组合，对比度应该满足WCAG AA标准（至少4.5:1用于正常文本，3:1用于大文本）。

**验证需求：2.4**

#### 属性 4：技术栈分类展示

*对于任意*技术栈数据集，渲染后的输出应该按类别分组，每个类别下包含该类别的所有技术项，且不同类别的技术项不应混合。

**验证需求：4.1**

#### 属性 5：技术栈悬停信息显示

*对于任意*技术项，当触发悬停事件时，应该显示包含技术名称和熟练度级别的信息。

**验证需求：4.2**

#### 属性 6：技术栈图标展示

*对于任意*技术项，渲染后的输出应该包含图标元素（img或svg标签）。

**验证需求：4.3**

#### 属性 7：博客文章字段完整性

*对于任意*博客文章列表，每篇文章的渲染输出应该包含标题、摘要、发布日期和标签这四个必需字段。

**验证需求：5.1**

#### 属性 8：博客文章点击导航

*对于任意*博客文章，当点击文章卡片时，应该触发导航到正确的文章详情路径（/blog/[slug]）。

**验证需求：5.2**

#### 属性 9：博客标签筛选准确性

*对于任意*标签和博客文章集合，按该标签筛选后的结果应该只包含标签列表中包含该标签的文章，且所有包含该标签的文章都应该被包含。

**验证需求：5.3**

#### 属性 10：博客日期排序正确性

*对于任意*博客文章集合，排序后的文章列表应该按发布日期降序排列，即最新的文章在最前面。

**验证需求：5.4**

#### 属性 11：友链新标签打开

*对于任意*友情链接，渲染后的链接元素应该包含target="_blank"和rel="noopener noreferrer"属性，确保在新标签页安全打开。

**验证需求：6.2**

#### 属性 12：友链字段完整性

*对于任意*友情链接列表，每个友链的渲染输出应该包含名称、描述和头像这三个必需字段。

**验证需求：6.3**

#### 属性 13：Markdown往返一致性

*对于任意*有效的Markdown内容，解析为AST然后渲染为HTML，再从HTML提取文本内容，应该保留原始Markdown的语义结构（标题、列表、链接等）。

**验证需求：7.4, 12.4**

#### 属性 14：响应式断点正确应用

*对于任意*视口宽度，当宽度小于768px时应用移动端样式，768px-1023px时应用平板端样式，大于等于1024px时应用桌面端样式。

**验证需求：8.1**

#### 属性 15：移动端非关键内容隐藏

*对于任意*标记为"非关键"的内容元素，在移动端视口（<768px）下应该被隐藏（display: none或visibility: hidden）。

**验证需求：8.3**

#### 属性 16：触摸目标最小尺寸

*对于任意*可交互元素（按钮、链接），其渲染后的尺寸应该至少为44x44像素，确保触摸屏上易于点击。

**验证需求：8.4**

#### 属性 17：动画时长限制

*对于任意*动画配置对象，其duration属性值应该不超过300毫秒。

**验证需求：9.4**

#### 属性 18：减少动画偏好支持

*对于任意*动画组件，当系统的prefers-reduced-motion设置为reduce时，动画应该被禁用或简化为即时过渡。

**验证需求：9.5**

#### 属性 19：配置文件正确加载

*对于任意*有效的JSON配置文件（profile.json、tech-stack.json、friends.json），加载后的数据对象应该与文件内容完全匹配，且所有必需字段都存在。

**验证需求：12.3**

## 错误处理

### 数据加载错误

**场景**：配置文件缺失或格式错误

**处理策略**：
- 在构建时验证所有配置文件的存在性和格式
- 使用TypeScript类型守卫验证数据结构
- 提供默认值或友好的错误消息
- 构建失败时显示清晰的错误信息

```typescript
function loadConfig<T>(path: string, schema: z.ZodSchema<T>): T {
  try {
    const content = fs.readFileSync(path, 'utf-8');
    const data = JSON.parse(content);
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`配置文件 ${path} 格式错误: ${error.message}`);
    }
    throw new Error(`无法加载配置文件 ${path}: ${error.message}`);
  }
}
```

### Markdown解析错误

**场景**：博客文章Markdown格式错误或frontmatter缺失

**处理策略**：
- 使用gray-matter验证frontmatter格式
- 捕获解析错误并提供详细的错误位置
- 跳过格式错误的文章，记录警告
- 在开发环境显示错误详情

```typescript
function parseMarkdownPost(filePath: string): BlogPost | null {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const { data, content: markdown } = matter(content);
    
    // 验证必需字段
    if (!data.title || !data.date) {
      console.warn(`文章 ${filePath} 缺少必需字段`);
      return null;
    }
    
    return {
      slug: path.basename(filePath, '.md'),
      title: data.title,
      description: data.description || '',
      date: data.date,
      tags: data.tags || [],
      content: markdown,
    };
  } catch (error) {
    console.error(`解析文章 ${filePath} 失败:`, error);
    return null;
  }
}
```

### 图片加载失败

**场景**：图片文件不存在或加载失败

**处理策略**：
- 使用Next.js Image组件的onError回调
- 提供占位图片或默认头像
- 优雅降级，不影响页面其他功能

```typescript
<Image
  src={avatar}
  alt={name}
  onError={(e) => {
    e.currentTarget.src = '/images/default-avatar.png';
  }}
/>
```

### 路由错误

**场景**：访问不存在的博客文章或页面

**处理策略**：
- 使用Next.js的404页面
- 提供返回首页或博客列表的链接
- 显示友好的错误消息

```typescript
// app/blog/[slug]/page.tsx
export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// 不存在的slug会自动显示404页面
```

### 响应式布局失败

**场景**：某些浏览器不支持CSS特性

**处理策略**：
- 使用渐进增强策略
- 提供基础布局作为后备
- 使用@supports检测CSS特性支持

```css
/* 基础布局 */
.grid {
  display: block;
}

/* 现代浏览器 */
@supports (display: grid) {
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  }
}
```

## 测试策略

### 双重测试方法

本项目采用单元测试和基于属性的测试相结合的方法，确保全面的代码覆盖和正确性验证。

**单元测试**：
- 验证特定示例和边缘情况
- 测试组件的渲染输出
- 测试错误条件和异常处理
- 使用Jest和React Testing Library

**基于属性的测试**：
- 验证跨所有输入的通用属性
- 使用fast-check库生成随机测试数据
- 每个属性测试运行至少100次迭代
- 测试标签格式：**Feature: personal-portfolio, Property {number}: {property_text}**

### 测试工具配置

```typescript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
};

// fast-check配置
import fc from 'fast-check';

const testConfig = {
  numRuns: 100, // 每个属性测试运行100次
  verbose: true,
};
```

### 测试覆盖目标

- **组件测试**：所有可复用组件应有单元测试
- **数据处理测试**：所有lib函数应有单元测试和属性测试
- **集成测试**：关键用户流程应有端到端测试
- **属性测试**：所有正确性属性应有对应的属性测试

### 示例测试

#### 单元测试示例

```typescript
// components/layout/Navigation.test.tsx
import { render, screen } from '@testing-library/react';
import Navigation from './Navigation';

describe('Navigation', () => {
  it('应该高亮当前页面', () => {
    render(<Navigation currentPath="/blog" />);
    const blogLink = screen.getByText('博客');
    expect(blogLink).toHaveClass('active');
  });

  it('应该在移动端显示汉堡菜单', () => {
    global.innerWidth = 500;
    render(<Navigation currentPath="/" />);
    expect(screen.getByLabelText('菜单')).toBeInTheDocument();
  });
});
```

#### 属性测试示例

```typescript
// lib/blog.test.ts
import fc from 'fast-check';
import { sortPostsByDate, filterPostsByTag } from './blog';

/**
 * Feature: personal-portfolio, Property 10: 博客日期排序正确性
 */
describe('博客日期排序', () => {
  it('应该按日期降序排列文章', () => {
    fc.assert(
      fc.property(
        fc.array(fc.record({
          slug: fc.string(),
          title: fc.string(),
          date: fc.date().map(d => d.toISOString()),
          tags: fc.array(fc.string()),
        })),
        (posts) => {
          const sorted = sortPostsByDate(posts);
          for (let i = 0; i < sorted.length - 1; i++) {
            expect(new Date(sorted[i].date).getTime())
              .toBeGreaterThanOrEqual(new Date(sorted[i + 1].date).getTime());
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Feature: personal-portfolio, Property 9: 博客标签筛选准确性
 */
describe('博客标签筛选', () => {
  it('应该只返回包含指定标签的文章', () => {
    fc.assert(
      fc.property(
        fc.array(fc.record({
          slug: fc.string(),
          title: fc.string(),
          tags: fc.array(fc.string()),
        })),
        fc.string(),
        (posts, tag) => {
          const filtered = filterPostsByTag(posts, tag);
          filtered.forEach(post => {
            expect(post.tags).toContain(tag);
          });
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

### 持续集成

- 在GitHub Actions中运行所有测试
- 构建前必须通过所有测试
- 代码覆盖率报告集成到PR中
- 属性测试失败时显示反例

```yaml
# .github/workflows/test.yml
name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm test -- --coverage
      - run: npm run build
```

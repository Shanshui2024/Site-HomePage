# 个人简介网站 | Personal Portfolio

一个现代化的个人简介网站，采用蓝色主题配色方案，提供沉浸式的交互体验。使用 Next.js 14、React 18、TypeScript 和 TailwindCSS 构建。

## ✨ 特性

- 🎨 **现代化设计** - 蓝色主题配色，扁平化简约风格
- 📱 **完全响应式** - 支持桌面端、平板端和移动端
- ⚡ **性能优化** - 图片懒加载、CDN 缓存、AVIF/WebP 格式
- 🎭 **流畅动画** - 基于 Framer Motion 的交互动效
- 📝 **博客系统** - 支持 Markdown 格式的文章
- 🔍 **SEO 优化** - 完整的元数据、sitemap 和结构化数据
- 🔧 **类型安全** - 使用 TypeScript 和 Zod 验证
- ♿ **可访问性** - 符合 WCAG AA 标准
- 🧪 **测试覆盖** - 单元测试和属性测试
- 📱 **PWA 支持** - 支持离线访问和添加到主屏幕

## 🛠️ 技术栈

- **框架**: Next.js 14 (App Router)
- **UI 库**: React 18
- **语言**: TypeScript 5
- **样式**: TailwindCSS 3
- **动画**: Framer Motion
- **Markdown**: gray-matter + react-markdown
- **图标**: Lucide React
- **验证**: Zod
- **测试**: Jest + React Testing Library

## 📁 项目结构

```
personal-portfolio/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # 根布局
│   ├── page.tsx                 # 首页
│   ├── manifest.ts              # PWA 配置
│   ├── sitemap.ts               # 网站地图
│   ├── robots.ts                # robots.txt
│   ├── tech-stack/              # 技术栈页面
│   ├── blog/                    # 博客页面
│   ├── friends/                 # 友链页面
│   └── about/                   # 关于页面
├── components/                   # 可复用组件
│   ├── layout/                  # 布局组件（导航、页脚）
│   ├── ui/                      # UI 组件（按钮、卡片、徽章）
│   ├── animations/              # 动画组件（FadeIn、SlideIn）
│   └── icons/                   # 自定义图标（B站、QQ）
├── lib/                         # 工具函数
│   ├── blog.ts                 # 博客数据处理
│   ├── config.ts               # 配置加载
│   ├── validation.ts           # 数据验证
│   └── utils.ts                # 通用工具（随机排序等）
├── data/                        # 数据文件
│   ├── profile.json            # 个人信息（统一管理社交链接）
│   ├── tech-stack.json         # 技术栈数据
│   ├── friends.json            # 友链数据
│   ├── about.json              # 关于页面数据
│   └── posts/                  # 博客文章（Markdown）
├── types/                       # TypeScript 类型定义
├── public/                      # 静态资源
│   └── images/                 # 图片资源
├── scripts/                     # 工具脚本
│   ├── validate-data.ts        # 数据验证脚本
│   └── check-performance.js    # 性能检查脚本
└── __tests__/                   # 测试文件
```

## 🚀 快速开始

### 前置要求

- Node.js 18+ 
- npm 或 yarn

### 安装步骤

1. **克隆仓库**
```bash
git clone <repository-url>
cd personal-portfolio
```

2. **安装依赖**
```bash
npm install
```

3. **配置环境变量**
```bash
# 创建 .env.local 文件
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

4. **运行开发服务器**
```bash
npm run dev
```

5. **打开浏览器**
访问 [http://localhost:3000](http://localhost:3000)

## 📝 内容管理

### 环境变量配置（.env.local）

**所有配置现在统一在 `.env.local` 文件中管理**，包括网站信息、个人信息、社交链接等：

```bash
# ==========================================
# 网站基础信息
# ==========================================
NEXT_PUBLIC_SITE_URL=https://shanshui.site
NEXT_PUBLIC_SITE_NAME=Shanshui-山重水复
NEXT_PUBLIC_SITE_TITLE=个人简介 | Shanshui-山重水复
NEXT_PUBLIC_SITE_DESCRIPTION=Hello hello? 这里是山水的小站欸~
NEXT_PUBLIC_SITE_KEYWORDS=个人简介,技术博客,前端开发,山水,Web开发

# ==========================================
# 个人信息配置
# ==========================================
NEXT_PUBLIC_PROFILE_NAME=Shanshui-山水
NEXT_PUBLIC_PROFILE_TITLE=Python 初学者
NEXT_PUBLIC_PROFILE_BIO=热爱编程，专注于Python...
NEXT_PUBLIC_PROFILE_AVATAR=/images/avatar.jpg
NEXT_PUBLIC_PROFILE_EMAIL=3381734705@qq.com

# 社交链接
NEXT_PUBLIC_GITHUB_URL=https://github.com/Shanshui2024
NEXT_PUBLIC_BILIBILI_URL=https://space.bilibili.com/1774428726
NEXT_PUBLIC_QQ_URL=https://qm.qq.com/q/your-qq-link

# 可选的社交链接
# NEXT_PUBLIC_TWITTER_URL=https://twitter.com/yourusername
# NEXT_PUBLIC_LINKEDIN_URL=https://linkedin.com/in/yourusername

# ==========================================
# SEO 和主题配置
# ==========================================
NEXT_PUBLIC_OG_IMAGE=/images/og-image.jpg
NEXT_PUBLIC_THEME_COLOR=#2563eb
# ... 更多配置见 .env.example
```

**说明**：
- ✅ 修改 `.env.local` 后需要重启开发服务器
- ✅ 所有配置自动应用到首页、页脚、关于页面、SEO 等
- ✅ 参考 `.env.example` 查看所有可配置项
- ✅ 不再需要 `data/profile.json`（已废弃）

### 1. 更新个人信息和社交链接

直接编辑 `.env.local` 文件：

```bash
# 修改个人信息
NEXT_PUBLIC_PROFILE_NAME=你的名字
NEXT_PUBLIC_PROFILE_TITLE=你的职位
NEXT_PUBLIC_PROFILE_BIO=个人简介
NEXT_PUBLIC_PROFILE_EMAIL=your@email.com

# 修改社交链接
NEXT_PUBLIC_GITHUB_URL=https://github.com/yourusername
NEXT_PUBLIC_BILIBILI_URL=https://space.bilibili.com/your-uid
NEXT_PUBLIC_QQ_URL=https://qm.qq.com/q/your-qq-link
```

**支持的社交平台**：
- GitHub (`NEXT_PUBLIC_GITHUB_URL`)
- 哔哩哔哩 (`NEXT_PUBLIC_BILIBILI_URL`)
- QQ (`NEXT_PUBLIC_QQ_URL`)
- Twitter (`NEXT_PUBLIC_TWITTER_URL`)
- LinkedIn (`NEXT_PUBLIC_LINKEDIN_URL`)

**修改后**：
```bash
# 重启开发服务器
npm run dev
```

### 2. 添加博客文章

在 `data/posts/` 目录下创建新的 Markdown 文件：

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

### 3. 更新技术栈

编辑 `data/tech-stack.json` 文件：

```json
{
  "categories": [
    {
      "name": "前端开发",
      "technologies": [
        {
          "name": "React",
          "icon": "⚛️",
          "description": "用于构建用户界面的 JavaScript 库"
        }
      ]
    }
  ]
}
```

### 4. 管理友情链接

编辑 `data/friends.json` 文件：

```json
{
  "links": [
    {
      "name": "网站名称",
      "description": "网站描述",
      "url": "https://example.com",
      "avatar": "https://example.com/avatar.jpg"
    }
  ]
}
```

**友链特性**：
- 自动随机排序（每次访问顺序不同）
- 头像加载失败时显示默认图标
- 懒加载优化性能

### 5. 添加自定义社交图标

如果需要添加新的社交平台：

1. 创建图标组件（参考 `components/icons/BilibiliIcon.tsx`）
2. 在 `app/page.tsx` 和 `components/layout/Footer.tsx` 的图标映射中添加
3. 在 `profile.json` 中添加链接

## 🧪 开发命令

```bash
# 开发
npm run dev          # 启动开发服务器

# 构建
npm run build        # 构建生产版本
npm run start        # 启动生产服务器

# 代码质量
npm run lint         # 运行 ESLint
npm run test         # 运行测试
npm run test:watch   # 监听模式运行测试

# 工具
npm run validate     # 验证数据文件格式
npm run perf         # 性能检查
```

## ⚡ 性能优化

### 已实施的优化

#### 1. 图片优化
- ✅ 支持 AVIF 和 WebP 格式（减少 30-50% 大小）
- ✅ 图片缓存 24 小时
- ✅ 首页头像优先加载
- ✅ 友链头像懒加载
- ✅ 精确的 sizes 属性
- ✅ 错误处理和默认图标

#### 2. 代码优化
- ✅ SWC 压缩（更快的构建）
- ✅ Gzip 压缩
- ✅ 包导入优化（lucide-react, framer-motion）
- ✅ 生产环境移除 console.log
- ✅ Tree shaking

#### 3. 缓存策略
- ✅ 静态资源长期缓存
- ✅ 图片 CDN 优化
- ✅ ETag 支持

#### 4. PWA 支持
- ✅ 支持添加到主屏幕
- ✅ 离线访问
- ✅ 主题色配置

### 性能检查

运行性能检查脚本：
```bash
npm run perf
```

会自动检查：
- 图片大小（建议 < 1MB）
- 依赖包大小
- Next.js 配置
- 环境变量

### 优化建议

#### 1. 压缩图片（重要！）

**在线工具**：
- https://tinypng.com/
- https://squoosh.app/

**命令行工具**：
```bash
npm install -g sharp-cli
sharp -i public/images/*.{jpg,png} -o public/images --webp
```

#### 2. 使用 CDN

推荐部署平台（自动 CDN）：
- Vercel（推荐）
- Netlify
- Cloudflare Pages

#### 3. 静态导出

如果内容不经常变化：

```javascript
// next.config.js
module.exports = {
  output: 'export',
};
```

然后运行：
```bash
npm run build
```

### 性能测试工具

- **Google PageSpeed Insights**: https://pagespeed.web.dev/
- **GTmetrix**: https://gtmetrix.com/
- **WebPageTest**: https://www.webpagetest.org/
- **Chrome DevTools Lighthouse**: F12 → Lighthouse

### 预期性能指标

- **Lighthouse 性能分数**: 90+
- **首次内容绘制 (FCP)**: < 1.5s
- **最大内容绘制 (LCP)**: < 2.5s
- **累积布局偏移 (CLS)**: < 0.1
- **首次输入延迟 (FID)**: < 100ms

## 🚢 部署

### Vercel 部署（推荐）

1. 将代码推送到 GitHub
2. 在 [Vercel](https://vercel.com) 导入项目
3. 配置环境变量：
   - `NEXT_PUBLIC_SITE_URL`: 你的域名
4. 点击部署

**优势**：
- 自动 CDN 加速
- 自动 HTTPS
- 零配置
- 免费额度充足

### Netlify 部署

1. 连接 GitHub 仓库
2. 构建命令：`npm run build`
3. 发布目录：`.next`
4. 配置环境变量

### 静态导出部署

适用于 GitHub Pages、Cloudflare Pages 等：

1. 修改 `next.config.js`：
```javascript
module.exports = {
  output: 'export',
  images: {
    unoptimized: true, // 静态导出需要
  },
};
```

2. 构建：
```bash
npm run build
```

3. 部署 `out/` 目录

## 🎨 自定义主题

### 颜色配置

在 `tailwind.config.ts` 中修改：

```typescript
colors: {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    // ...
    600: '#2563eb',  // 主色调
    // ...
  },
}
```

### 字体配置

在 `app/layout.tsx` 中配置 Next.js 字体优化：

```typescript
import { Inter } from 'next/font/google';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
});
```

### 动画配置

在 `components/animations/` 中自定义动画组件。

## 🔧 故障排除

### 图片加载失败

1. 检查 `next.config.js` 中的 `remotePatterns` 配置
2. 确保图片 URL 可访问
3. 友链头像会自动显示默认图标

### 构建错误

```bash
# 清理缓存
rm -rf .next
npm run build
```

### 类型错误

```bash
# 重新生成类型
npm run build
```

### 性能问题

```bash
# 运行性能检查
npm run perf

# 检查图片大小
ls -lh public/images/
```

## 📚 相关文档

- [Next.js 文档](https://nextjs.org/docs)
- [React 文档](https://react.dev)
- [TailwindCSS 文档](https://tailwindcss.com/docs)
- [Framer Motion 文档](https://www.framer.com/motion/)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

### 开发流程

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

MIT License

## 📧 联系方式

- Email: 3381734705@qq.com
- GitHub: [@Shanshui2024](https://github.com/Shanshui2024)
- 哔哩哔哩: [山水的空间](https://space.bilibili.com/1774428726)

---

使用 ❤️ 和 Next.js 构建 | 性能优化 ⚡ | PWA 支持 📱

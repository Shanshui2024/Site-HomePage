/**
 * 博客数据处理工具
 * 
 * 本文件提供博客文章的读取、解析、筛选和排序功能
 * 验证需求：5.1, 5.3, 5.4, 12.4
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { BlogPost, BlogMetadata } from '@/types';
import { BlogMetadataSchema } from './validation';

/**
 * 博客文章目录路径
 */
const POSTS_DIRECTORY = path.join(process.cwd(), 'data/posts');

/**
 * 博客解析错误类
 */
export class BlogParseError extends Error {
  constructor(
    message: string,
    public readonly filePath: string,
    public readonly cause?: Error
  ) {
    super(message);
    this.name = 'BlogParseError';
  }
}

/**
 * 从文件名生成slug
 * 移除.md扩展名，确保slug格式正确
 * 
 * @param filename - 文件名
 * @returns slug
 */
function generateSlug(filename: string): string {
  return filename.replace(/\.md$/, '');
}

/**
 * 解析单个Markdown文章文件
 * 
 * @param filePath - 文章文件的完整路径
 * @returns 解析后的博客文章对象，如果解析失败返回null
 */
function parseMarkdownPost(filePath: string): BlogPost | null {
  try {
    // 读取文件内容
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    
    // 使用gray-matter解析frontmatter
    const { data, content } = matter(fileContent);
    
    // 验证必需字段
    if (!data.title || !data.date) {
      console.warn(
        `[博客解析警告] 文章 ${path.basename(filePath)} 缺少必需字段 (title 或 date)，已跳过`
      );
      return null;
    }
    
    // 验证日期格式
    const parsedDate = new Date(data.date);
    if (isNaN(parsedDate.getTime())) {
      console.warn(
        `[博客解析警告] 文章 ${path.basename(filePath)} 的日期格式不正确: ${data.date}，已跳过`
      );
      return null;
    }
    
    // 构建博客文章对象
    const slug = generateSlug(path.basename(filePath));
    
    // 验证frontmatter数据
    const metadata: BlogMetadata = {
      title: data.title,
      description: data.description || '',
      date: data.date,
      tags: Array.isArray(data.tags) ? data.tags : [],
      coverImage: data.coverImage,
    };
    
    // 使用schema验证元数据
    const validationResult = BlogMetadataSchema.safeParse(metadata);
    if (!validationResult.success) {
      console.warn(
        `[博客解析警告] 文章 ${path.basename(filePath)} 的元数据验证失败，已跳过`
      );
      return null;
    }
    
    return {
      slug,
      ...metadata,
      content: content.trim(),
    };
  } catch (error) {
    console.error(
      `[博客解析错误] 解析文章 ${path.basename(filePath)} 失败:`,
      error instanceof Error ? error.message : String(error)
    );
    return null;
  }
}

/**
 * 获取所有博客文章
 * 读取data/posts目录下的所有Markdown文件并解析
 * 
 * @returns 所有有效的博客文章数组，按日期降序排列
 * 
 * @example
 * ```typescript
 * const posts = getAllPosts();
 * console.log(`共有 ${posts.length} 篇文章`);
 * ```
 */
export function getAllPosts(): BlogPost[] {
  try {
    // 检查文章目录是否存在
    if (!fs.existsSync(POSTS_DIRECTORY)) {
      console.warn(`[博客警告] 文章目录不存在: ${POSTS_DIRECTORY}`);
      return [];
    }
    
    // 读取目录中的所有文件
    const files = fs.readdirSync(POSTS_DIRECTORY);
    
    // 筛选出Markdown文件
    const markdownFiles = files.filter(file => file.endsWith('.md'));
    
    if (markdownFiles.length === 0) {
      console.warn(`[博客警告] 文章目录中没有找到Markdown文件`);
      return [];
    }
    
    // 解析所有文章
    const posts: BlogPost[] = [];
    for (const file of markdownFiles) {
      const filePath = path.join(POSTS_DIRECTORY, file);
      const post = parseMarkdownPost(filePath);
      
      if (post !== null) {
        posts.push(post);
      }
    }
    
    // 按日期降序排序
    return sortPostsByDate(posts);
  } catch (error) {
    console.error(
      '[博客错误] 读取文章目录失败:',
      error instanceof Error ? error.message : String(error)
    );
    return [];
  }
}

/**
 * 根据slug获取单篇文章
 * 
 * @param slug - 文章的唯一标识符
 * @returns 博客文章对象，如果未找到返回null
 * @throws {BlogParseError} 当文章存在但解析失败时
 * 
 * @example
 * ```typescript
 * const post = getPostBySlug('my-first-post');
 * if (post) {
 *   console.log(post.title);
 * }
 * ```
 */
export function getPostBySlug(slug: string): BlogPost | null {
  try {
    const filePath = path.join(POSTS_DIRECTORY, `${slug}.md`);
    
    // 检查文件是否存在
    if (!fs.existsSync(filePath)) {
      return null;
    }
    
    // 解析文章
    const post = parseMarkdownPost(filePath);
    
    if (post === null) {
      throw new BlogParseError(
        `文章 ${slug} 存在但解析失败，请检查文章格式`,
        filePath
      );
    }
    
    return post;
  } catch (error) {
    if (error instanceof BlogParseError) {
      throw error;
    }
    
    console.error(
      `[博客错误] 获取文章 ${slug} 失败:`,
      error instanceof Error ? error.message : String(error)
    );
    return null;
  }
}

/**
 * 按标签筛选文章
 * 返回所有包含指定标签的文章
 * 
 * @param tag - 要筛选的标签
 * @returns 包含该标签的所有文章数组，按日期降序排列
 * 
 * @example
 * ```typescript
 * const reactPosts = getPostsByTag('React');
 * console.log(`找到 ${reactPosts.length} 篇关于React的文章`);
 * ```
 */
export function getPostsByTag(tag: string): BlogPost[] {
  const allPosts = getAllPosts();
  
  // 筛选包含指定标签的文章
  const filteredPosts = allPosts.filter(post => 
    post.tags.includes(tag)
  );
  
  return filteredPosts;
}

/**
 * 获取所有标签
 * 从所有文章中提取唯一的标签列表
 * 
 * @returns 所有唯一标签的数组，按字母顺序排序
 * 
 * @example
 * ```typescript
 * const tags = getAllTags();
 * console.log(`共有 ${tags.length} 个标签`);
 * ```
 */
export function getAllTags(): string[] {
  const allPosts = getAllPosts();
  
  // 收集所有标签
  const tagsSet = new Set<string>();
  for (const post of allPosts) {
    for (const tag of post.tags) {
      tagsSet.add(tag);
    }
  }
  
  // 转换为数组并排序（使用localeCompare支持中文排序）
  return Array.from(tagsSet).sort((a, b) => a.localeCompare(b, 'zh-CN'));
}

/**
 * 按日期排序文章
 * 将文章按发布日期降序排列（最新的在前）
 * 
 * @param posts - 要排序的文章数组
 * @returns 排序后的文章数组
 * 
 * @example
 * ```typescript
 * const sortedPosts = sortPostsByDate(posts);
 * console.log(`最新文章: ${sortedPosts[0].title}`);
 * ```
 */
export function sortPostsByDate(posts: BlogPost[]): BlogPost[] {
  return [...posts].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    
    // 降序排列：最新的在前
    return dateB - dateA;
  });
}

/**
 * 获取文章统计信息
 * 
 * @returns 文章统计对象
 * 
 * @example
 * ```typescript
 * const stats = getPostStats();
 * console.log(`共有 ${stats.totalPosts} 篇文章，${stats.totalTags} 个标签`);
 * ```
 */
export function getPostStats(): {
  totalPosts: number;
  totalTags: number;
  postsByTag: Record<string, number>;
} {
  const allPosts = getAllPosts();
  const allTags = getAllTags();
  
  // 统计每个标签的文章数量
  const postsByTag: Record<string, number> = {};
  for (const tag of allTags) {
    postsByTag[tag] = getPostsByTag(tag).length;
  }
  
  return {
    totalPosts: allPosts.length,
    totalTags: allTags.length,
    postsByTag,
  };
}

/**
 * 搜索文章
 * 在文章标题、描述和内容中搜索关键词
 * 
 * @param query - 搜索关键词
 * @returns 匹配的文章数组
 * 
 * @example
 * ```typescript
 * const results = searchPosts('TypeScript');
 * console.log(`找到 ${results.length} 篇相关文章`);
 * ```
 */
export function searchPosts(query: string): BlogPost[] {
  if (!query || query.trim() === '') {
    return [];
  }
  
  const allPosts = getAllPosts();
  const lowerQuery = query.toLowerCase();
  
  return allPosts.filter(post => {
    const titleMatch = post.title.toLowerCase().includes(lowerQuery);
    const descriptionMatch = post.description.toLowerCase().includes(lowerQuery);
    const contentMatch = post.content.toLowerCase().includes(lowerQuery);
    const tagMatch = post.tags.some(tag => 
      tag.toLowerCase().includes(lowerQuery)
    );
    
    return titleMatch || descriptionMatch || contentMatch || tagMatch;
  });
}

/**
 * 获取最近的N篇文章
 * 
 * @param count - 要获取的文章数量
 * @returns 最近的文章数组
 * 
 * @example
 * ```typescript
 * const recentPosts = getRecentPosts(5);
 * console.log(`最近5篇文章`);
 * ```
 */
export function getRecentPosts(count: number): BlogPost[] {
  const allPosts = getAllPosts();
  return allPosts.slice(0, count);
}

/**
 * 检查slug是否存在
 * 
 * @param slug - 要检查的slug
 * @returns 如果slug存在返回true，否则返回false
 * 
 * @example
 * ```typescript
 * if (slugExists('my-post')) {
 *   console.log('文章已存在');
 * }
 * ```
 */
export function slugExists(slug: string): boolean {
  const filePath = path.join(POSTS_DIRECTORY, `${slug}.md`);
  return fs.existsSync(filePath);
}

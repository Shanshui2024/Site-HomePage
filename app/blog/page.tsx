/**
 * 博客列表页面
 * 
 * 功能：
 * - 使用getAllPosts()加载所有文章
 * - 实现标签筛选功能
 * - 按日期排序显示文章列表
 * - 空状态处理：无文章时显示友好提示
 * - 使用BlogPostCard组件
 * - 显示新博客地址通知
 * 
 * 验证需求：5.1, 5.3, 5.4, 5.5
 */

import BlogListClient from './BlogListClient';
import { getAllPosts, getAllTags } from '@/lib/blog';

export const metadata = {
  title: '博客',
  description: '分享技术心得、学习笔记和开发经验。注意：博客已迁移至 blog.shanshui.site',
};

export default function BlogPage() {
  // 加载所有文章（已按日期排序）
  const allPosts = getAllPosts();
  
  // 获取所有标签
  const allTags = getAllTags();

  return <BlogListClient allPosts={allPosts} allTags={allTags} />;
}
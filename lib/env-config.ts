/**
 * 环境变量配置加载
 * 从 .env 文件读取配置，替代 profile.json
 */

import type { Profile } from '@/types';

/**
 * 从环境变量加载个人信息配置
 */
export function loadProfileFromEnv(): Profile {
  // 解析社交链接
  const social: Record<string, string> = {};
  
  if (process.env.NEXT_PUBLIC_GITHUB_URL) {
    social.github = process.env.NEXT_PUBLIC_GITHUB_URL;
  }
  if (process.env.NEXT_PUBLIC_BILIBILI_URL) {
    social.bilibili = process.env.NEXT_PUBLIC_BILIBILI_URL;
  }
  if (process.env.NEXT_PUBLIC_QQ_URL) {
    social.qq = process.env.NEXT_PUBLIC_QQ_URL;
  }
  if (process.env.NEXT_PUBLIC_TWITTER_URL) {
    social.twitter = process.env.NEXT_PUBLIC_TWITTER_URL;
  }
  if (process.env.NEXT_PUBLIC_LINKEDIN_URL) {
    social.linkedin = process.env.NEXT_PUBLIC_LINKEDIN_URL;
  }

  return {
    name: process.env.NEXT_PUBLIC_PROFILE_NAME || 'Your Name',
    title: process.env.NEXT_PUBLIC_PROFILE_TITLE || 'Your Title',
    bio: process.env.NEXT_PUBLIC_PROFILE_BIO || 'Your bio',
    avatar: process.env.NEXT_PUBLIC_PROFILE_AVATAR || '/images/avatar.jpg',
    email: process.env.NEXT_PUBLIC_PROFILE_EMAIL || 'your@email.com',
    social,
  };
}

/**
 * 获取环境变量值，支持默认值
 */
export function getEnv(key: string, defaultValue: string = ''): string {
  return process.env[key] || defaultValue;
}

/**
 * Umami 统计分析配置
 * 
 * 环境变量：
 * - NEXT_PUBLIC_UMAMI_WEBSITE_ID: Umami 网站 ID（必需）
 * - NEXT_PUBLIC_UMAMI_SRC: Umami 跟踪脚本地址（默认: https://cloud.umami.is/script.js）
 * - NEXT_PUBLIC_UMAMI_ENABLED: 是否启用 Umami 统计（默认: false）
 */
export interface UmamiConfig {
  /** 是否启用 Umami 统计 */
  enabled: boolean;
  /** Umami 网站 ID */
  websiteId: string;
  /** Umami 跟踪脚本地址 */
  src: string;
}

/**
 * 获取 Umami 统计配置
 * 只有同时设置 enabled=true 和 websiteId 时才启用
 */
export function getUmamiConfig(): UmamiConfig {
  const enabled = process.env.NEXT_PUBLIC_UMAMI_ENABLED === 'true';
  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID || '';
  const src = process.env.NEXT_PUBLIC_UMAMI_SRC || 'https://cloud.umami.is/script.js';

  return {
    enabled: enabled && websiteId.length > 0,
    websiteId,
    src,
  };
}

/**
 * 检查必需的环境变量是否已设置
 */
export function checkRequiredEnvVars(vars: string[]): { missing: string[]; isValid: boolean } {
  const missing = vars.filter(v => !process.env[v]);
  return {
    missing,
    isValid: missing.length === 0,
  };
}

/**
 * 数据验证Schema - 使用Zod
 * 
 * 本文件定义了所有数据模型的Zod验证schema和类型守卫函数
 * 验证需求：10.2, 12.3
 */

import { z } from 'zod';
import type {
  Profile,
  TechItem,
  TechCategory,
  TechStackData,
  FriendLink,
  FriendLinksData,
  Education,
  Experience,
  TimelineEvent,
  AboutData,
} from '@/types';

// ============================================================================
// 基础Schema
// ============================================================================

/**
 * 个人信息Schema
 */
export const ProfileSchema = z.object({
  name: z.string().min(1, { message: '姓名不能为空' }),
  title: z.string().min(1, { message: '职位不能为空' }),
  bio: z.string().min(1, { message: '个人简介不能为空' }),
  avatar: z.string().min(1, { message: '头像路径不能为空' }),
  email: z.string().email({ message: '邮箱格式不正确' }),
  social: z.record(z.string(), z.string().optional()).refine(
    (data) => {
      // 确保至少有一个社交媒体链接
      return Object.values(data).some(value => value !== undefined && value !== '');
    },
    { message: '至少需要一个社交媒体链接' }
  ),
});

/**
 * 技术项Schema
 */
export const TechItemSchema = z.object({
  name: z.string().min(1, { message: '技术名称不能为空' }),
  icon: z.string().min(1, { message: '图标标识符不能为空' }),
  level: z.enum(['beginner', 'intermediate', 'advanced', 'expert'], {
    message: '熟练度级别必须是 beginner, intermediate, advanced 或 expert',
  }),
  category: z.string().min(1, { message: '类别不能为空' }),
});

/**
 * 技术栈类别Schema
 */
export const TechCategorySchema = z.object({
  name: z.string().min(1, { message: '类别名称不能为空' }),
  items: z.array(TechItemSchema).min(1, { message: '每个类别至少需要一个技术项' }),
});

/**
 * 技术栈完整数据Schema
 */
export const TechStackDataSchema = z.object({
  categories: z.array(TechCategorySchema).min(1, { message: '至少需要一个技术栈类别' }),
});

/**
 * 友情链接Schema
 */
export const FriendLinkSchema = z.object({
  name: z.string().min(1, { message: '友链名称不能为空' }),
  description: z.string().min(1, { message: '友链描述不能为空' }),
  url: z.string().url({ message: 'URL格式不正确' }),
  avatar: z.string().min(1, { message: '头像路径不能为空' }),
});

/**
 * 友链列表数据Schema
 */
export const FriendLinksDataSchema = z.object({
  links: z.array(FriendLinkSchema),
});

/**
 * 教育背景Schema
 */
export const EducationSchema = z.object({
  school: z.string().min(1, { message: '学校名称不能为空' }),
  degree: z.string().min(1, { message: '学位不能为空' }),
  period: z.string().min(1, { message: '时间段不能为空' }),
});

/**
 * 工作经历Schema
 */
export const ExperienceSchema = z.object({
  company: z.string().min(1, { message: '公司名称不能为空' }),
  position: z.string().min(1, { message: '职位不能为空' }),
  period: z.string().min(1, { message: '时间段不能为空' }),
  description: z.string().min(1, { message: '工作描述不能为空' }),
});

/**
 * 时间线事件Schema
 */
export const TimelineEventSchema = z.object({
  year: z.string().min(1, { message: '年份不能为空' }),
  event: z.string().min(1, { message: '事件描述不能为空' }),
});

/**
 * 关于页面数据Schema
 */
export const AboutDataSchema = z.object({
  introduction: z.string().min(1, { message: '个人简介不能为空' }),
  education: z.array(EducationSchema).optional(),
  experience: z.array(ExperienceSchema).optional(),
  timeline: z.array(TimelineEventSchema).optional(),
});

// ============================================================================
// 类型守卫函数
// ============================================================================

/**
 * 检查数据是否为有效的Profile
 */
export function isProfile(data: unknown): data is Profile {
  return ProfileSchema.safeParse(data).success;
}

/**
 * 检查数据是否为有效的TechItem
 */
export function isTechItem(data: unknown): data is TechItem {
  return TechItemSchema.safeParse(data).success;
}

/**
 * 检查数据是否为有效的TechCategory
 */
export function isTechCategory(data: unknown): data is TechCategory {
  return TechCategorySchema.safeParse(data).success;
}

/**
 * 检查数据是否为有效的TechStackData
 */
export function isTechStackData(data: unknown): data is TechStackData {
  return TechStackDataSchema.safeParse(data).success;
}

/**
 * 检查数据是否为有效的FriendLink
 */
export function isFriendLink(data: unknown): data is FriendLink {
  return FriendLinkSchema.safeParse(data).success;
}

/**
 * 检查数据是否为有效的FriendLinksData
 */
export function isFriendLinksData(data: unknown): data is FriendLinksData {
  return FriendLinksDataSchema.safeParse(data).success;
}

/**
 * 检查数据是否为有效的Education
 */
export function isEducation(data: unknown): data is Education {
  return EducationSchema.safeParse(data).success;
}

/**
 * 检查数据是否为有效的Experience
 */
export function isExperience(data: unknown): data is Experience {
  return ExperienceSchema.safeParse(data).success;
}

/**
 * 检查数据是否为有效的TimelineEvent
 */
export function isTimelineEvent(data: unknown): data is TimelineEvent {
  return TimelineEventSchema.safeParse(data).success;
}

/**
 * 检查数据是否为有效的AboutData
 */
export function isAboutData(data: unknown): data is AboutData {
  return AboutDataSchema.safeParse(data).success;
}

// ============================================================================
// 验证辅助函数
// ============================================================================

/**
 * 验证并解析数据，如果验证失败则抛出错误
 * @param schema Zod schema
 * @param data 要验证的数据
 * @param context 上下文信息（用于错误消息）
 * @returns 验证后的数据
 */
export function validateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  context: string
): T {
  const result = schema.safeParse(data);
  
  if (!result.success) {
    // Zod 4.x has issues property but it's not in the type definition
    const errorData = result.error as any;
    const errors = (errorData.issues || []).map((err: any) => 
      `  - ${err.path.join('.')}: ${err.message}`
    ).join('\n');
    
    throw new Error(
      `${context}数据验证失败:\n${errors}`
    );
  }
  
  return result.data;
}

/**
 * 验证并解析数据，如果验证失败则返回null
 * @param schema Zod schema
 * @param data 要验证的数据
 * @returns 验证后的数据或null
 */
export function validateDataSafe<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): T | null {
  const result = schema.safeParse(data);
  return result.success ? result.data : null;
}

/**
 * 获取验证错误信息
 * @param schema Zod schema
 * @param data 要验证的数据
 * @returns 错误信息数组，如果验证成功则返回空数组
 */
export function getValidationErrors<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): string[] {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return [];
  }
  
  // Zod 4.x has issues property but it's not in the type definition
  const errorData = result.error as any;
  return (errorData.issues || []).map((err: any) => 
    `${err.path.join('.')}: ${err.message}`
  );
}

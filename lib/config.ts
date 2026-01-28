/**
 * 配置文件加载工具
 * 
 * 本文件提供通用的配置文件加载和验证功能
 * 验证需求：12.3
 */

import fs from 'fs';
import path from 'path';
import { z } from 'zod';

/**
 * 配置加载错误类
 * 用于区分配置加载过程中的不同错误类型
 */
export class ConfigLoadError extends Error {
  constructor(
    message: string,
    public readonly filePath: string,
    public readonly cause?: Error
  ) {
    super(message);
    this.name = 'ConfigLoadError';
  }
}

/**
 * 配置验证错误类
 * 用于表示配置文件格式验证失败
 */
export class ConfigValidationError extends Error {
  constructor(
    message: string,
    public readonly filePath: string,
    public readonly validationErrors: string[]
  ) {
    super(message);
    this.name = 'ConfigValidationError';
  }
}

/**
 * 加载并验证JSON配置文件
 * 
 * @template T - 配置数据的类型
 * @param filePath - 配置文件路径（相对于项目根目录或绝对路径）
 * @param schema - Zod验证schema
 * @returns 验证后的配置数据
 * @throws {ConfigLoadError} 当文件不存在或无法读取时
 * @throws {ConfigValidationError} 当JSON格式错误或数据验证失败时
 * 
 * @example
 * ```typescript
 * import { ProfileSchema } from './validation';
 * import { loadConfig } from './config';
 * 
 * const profile = loadConfig('data/profile.json', ProfileSchema);
 * console.log(profile.name);
 * ```
 */
export function loadConfig<T>(
  filePath: string,
  schema: z.ZodSchema<T>
): T {
  // 解析文件路径（支持相对路径和绝对路径）
  const absolutePath = path.isAbsolute(filePath)
    ? filePath
    : path.join(process.cwd(), filePath);

  // 检查文件是否存在
  if (!fs.existsSync(absolutePath)) {
    throw new ConfigLoadError(
      `配置文件不存在: ${filePath}\n` +
      `请确保文件存在于正确的位置。`,
      filePath
    );
  }

  // 读取文件内容
  let fileContent: string;
  try {
    fileContent = fs.readFileSync(absolutePath, 'utf-8');
  } catch (error) {
    throw new ConfigLoadError(
      `无法读取配置文件: ${filePath}\n` +
      `错误信息: ${error instanceof Error ? error.message : String(error)}`,
      filePath,
      error instanceof Error ? error : undefined
    );
  }

  // 解析JSON
  let data: unknown;
  try {
    data = JSON.parse(fileContent);
  } catch (error) {
    throw new ConfigValidationError(
      `配置文件JSON格式错误: ${filePath}\n` +
      `错误信息: ${error instanceof Error ? error.message : String(error)}\n` +
      `请检查JSON语法是否正确（注意逗号、引号、括号等）。`,
      filePath,
      [error instanceof Error ? error.message : String(error)]
    );
  }

  // 验证数据结构
  const result = schema.safeParse(data);
  
  if (!result.success) {
    // 提取验证错误信息
    const errorData = result.error as any;
    const errors = (errorData.issues || []).map((err: any) => {
      const fieldPath = err.path.length > 0 ? err.path.join('.') : '根对象';
      return `  • ${fieldPath}: ${err.message}`;
    });

    throw new ConfigValidationError(
      `配置文件格式验证失败: ${filePath}\n` +
      `以下字段存在问题:\n${errors.join('\n')}\n` +
      `请检查配置文件是否符合预期的数据结构。`,
      filePath,
      errors
    );
  }

  return result.data;
}

/**
 * 安全地加载配置文件，失败时返回null而不是抛出错误
 * 
 * @template T - 配置数据的类型
 * @param filePath - 配置文件路径
 * @param schema - Zod验证schema
 * @returns 验证后的配置数据，失败时返回null
 * 
 * @example
 * ```typescript
 * const profile = loadConfigSafe('data/profile.json', ProfileSchema);
 * if (profile) {
 *   console.log(profile.name);
 * } else {
 *   console.log('配置加载失败');
 * }
 * ```
 */
export function loadConfigSafe<T>(
  filePath: string,
  schema: z.ZodSchema<T>
): T | null {
  try {
    return loadConfig(filePath, schema);
  } catch (error) {
    // 在开发环境下输出错误信息
    if (process.env.NODE_ENV === 'development') {
      console.error(`配置加载失败: ${filePath}`, error);
    }
    return null;
  }
}

/**
 * 批量加载多个配置文件
 * 
 * @param configs - 配置文件路径和schema的映射
 * @returns 加载结果的映射，包含成功加载的数据和失败的错误信息
 * 
 * @example
 * ```typescript
 * const results = loadMultipleConfigs({
 *   profile: { path: 'data/profile.json', schema: ProfileSchema },
 *   techStack: { path: 'data/tech-stack.json', schema: TechStackDataSchema },
 * });
 * 
 * if (results.profile.success) {
 *   console.log(results.profile.data.name);
 * } else {
 *   console.error(results.profile.error);
 * }
 * ```
 */
export function loadMultipleConfigs<T extends Record<string, any>>(
  configs: {
    [K in keyof T]: {
      path: string;
      schema: z.ZodSchema<T[K]>;
    };
  }
): {
  [K in keyof T]: 
    | { success: true; data: T[K] }
    | { success: false; error: Error };
} {
  const results = {} as any;

  for (const [key, config] of Object.entries(configs)) {
    try {
      const data = loadConfig(config.path, config.schema);
      results[key] = { success: true, data };
    } catch (error) {
      results[key] = { 
        success: false, 
        error: error instanceof Error ? error : new Error(String(error))
      };
    }
  }

  return results;
}

/**
 * 检查配置文件是否存在且有效
 * 
 * @param filePath - 配置文件路径
 * @param schema - Zod验证schema
 * @returns 配置文件是否有效
 * 
 * @example
 * ```typescript
 * if (isConfigValid('data/profile.json', ProfileSchema)) {
 *   console.log('配置文件有效');
 * }
 * ```
 */
export function isConfigValid<T>(
  filePath: string,
  schema: z.ZodSchema<T>
): boolean {
  return loadConfigSafe(filePath, schema) !== null;
}

/**
 * 获取配置文件的验证错误信息（不抛出错误）
 * 
 * @param filePath - 配置文件路径
 * @param schema - Zod验证schema
 * @returns 错误信息数组，如果配置有效则返回空数组
 * 
 * @example
 * ```typescript
 * const errors = getConfigErrors('data/profile.json', ProfileSchema);
 * if (errors.length > 0) {
 *   console.error('配置错误:', errors);
 * }
 * ```
 */
export function getConfigErrors<T>(
  filePath: string,
  schema: z.ZodSchema<T>
): string[] {
  try {
    loadConfig(filePath, schema);
    return [];
  } catch (error) {
    if (error instanceof ConfigValidationError) {
      return error.validationErrors;
    }
    if (error instanceof ConfigLoadError) {
      return [error.message];
    }
    return [error instanceof Error ? error.message : String(error)];
  }
}

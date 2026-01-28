/**
 * 配置加载使用示例
 * 
 * 本文件展示如何使用loadConfig函数加载和验证配置文件
 * 这不是测试文件，而是使用示例
 */

import { loadConfig, loadConfigSafe, loadMultipleConfigs, isConfigValid, getConfigErrors } from '../config';
import { ProfileSchema, TechStackDataSchema, FriendLinksDataSchema } from '../validation';
import type { Profile, TechStackData, FriendLinksData } from '@/types';

// ============================================================================
// 示例 1: 基本用法 - 加载单个配置文件
// ============================================================================

export function example1_basicUsage() {
  console.log('=== 示例 1: 基本用法 ===\n');
  
  try {
    // 加载个人信息配置
    const profile = loadConfig<Profile>('data/profile.json', ProfileSchema);
    
    console.log('个人信息加载成功:');
    console.log(`姓名: ${profile.name}`);
    console.log(`职位: ${profile.title}`);
    console.log(`邮箱: ${profile.email}`);
    console.log(`GitHub: ${profile.social.github}\n`);
  } catch (error) {
    console.error('加载失败:', error);
  }
}

// ============================================================================
// 示例 2: 安全加载 - 失败时不抛出错误
// ============================================================================

export function example2_safeLoading() {
  console.log('=== 示例 2: 安全加载 ===\n');
  
  // 尝试加载可能不存在的配置文件
  const profile = loadConfigSafe<Profile>('data/profile.json', ProfileSchema);
  
  if (profile) {
    console.log('配置加载成功:', profile.name);
  } else {
    console.log('配置加载失败，使用默认值');
    // 可以在这里使用默认配置
  }
  console.log();
}

// ============================================================================
// 示例 3: 批量加载多个配置文件
// ============================================================================

export function example3_multipleConfigs() {
  console.log('=== 示例 3: 批量加载 ===\n');
  
  const results = loadMultipleConfigs({
    profile: { path: 'data/profile.json', schema: ProfileSchema },
    techStack: { path: 'data/tech-stack.json', schema: TechStackDataSchema },
    friends: { path: 'data/friends.json', schema: FriendLinksDataSchema },
  });
  
  // 检查每个配置的加载结果
  if (results.profile.success) {
    console.log('✓ Profile 加载成功:', results.profile.data.name);
  } else {
    console.log('✗ Profile 加载失败:', results.profile.error.message);
  }
  
  if (results.techStack.success) {
    console.log('✓ TechStack 加载成功:', results.techStack.data.categories.length, '个类别');
  } else {
    console.log('✗ TechStack 加载失败:', results.techStack.error.message);
  }
  
  if (results.friends.success) {
    console.log('✓ Friends 加载成功:', results.friends.data.links.length, '个友链');
  } else {
    console.log('✗ Friends 加载失败:', results.friends.error.message);
  }
  console.log();
}

// ============================================================================
// 示例 4: 验证配置文件
// ============================================================================

export function example4_validation() {
  console.log('=== 示例 4: 验证配置 ===\n');
  
  // 检查配置文件是否有效
  const isValid = isConfigValid('data/profile.json', ProfileSchema);
  console.log('Profile 配置有效:', isValid);
  
  // 获取详细的验证错误信息
  const errors = getConfigErrors('data/profile.json', ProfileSchema);
  if (errors.length > 0) {
    console.log('验证错误:');
    errors.forEach(error => console.log(`  - ${error}`));
  } else {
    console.log('没有验证错误');
  }
  console.log();
}

// ============================================================================
// 示例 5: 错误处理
// ============================================================================

export function example5_errorHandling() {
  console.log('=== 示例 5: 错误处理 ===\n');
  
  try {
    // 尝试加载不存在的文件
    loadConfig('data/nonexistent.json', ProfileSchema);
  } catch (error) {
    if (error instanceof Error) {
      console.log('错误类型:', error.name);
      console.log('错误消息:', error.message);
      
      // 可以根据错误类型进行不同的处理
      if (error.name === 'ConfigLoadError') {
        console.log('这是一个文件加载错误');
      } else if (error.name === 'ConfigValidationError') {
        console.log('这是一个数据验证错误');
      }
    }
  }
  console.log();
}

// ============================================================================
// 示例 6: 在Next.js页面中使用
// ============================================================================

export function example6_nextjsUsage() {
  console.log('=== 示例 6: Next.js 使用示例 ===\n');
  
  // 在Next.js的getStaticProps或服务器组件中使用
  const exampleCode = `
// app/page.tsx (Server Component)
import { loadConfig } from '@/lib/config';
import { ProfileSchema } from '@/lib/validation';
import type { Profile } from '@/types';

export default function HomePage() {
  // 在服务器组件中直接加载配置
  const profile = loadConfig<Profile>('data/profile.json', ProfileSchema);
  
  return (
    <div>
      <h1>{profile.name}</h1>
      <p>{profile.title}</p>
      <p>{profile.bio}</p>
    </div>
  );
}

// 或者在 getStaticProps 中使用 (Pages Router)
export async function getStaticProps() {
  const profile = loadConfig<Profile>('data/profile.json', ProfileSchema);
  
  return {
    props: {
      profile,
    },
  };
}
  `;
  
  console.log(exampleCode);
}

// ============================================================================
// 运行所有示例
// ============================================================================

export function runAllExamples() {
  example1_basicUsage();
  example2_safeLoading();
  example3_multipleConfigs();
  example4_validation();
  example5_errorHandling();
  example6_nextjsUsage();
}

// 如果直接运行此文件
if (require.main === module) {
  runAllExamples();
}

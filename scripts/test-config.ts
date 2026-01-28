/**
 * 配置加载测试脚本
 * 
 * 验证配置加载功能是否正常工作
 */

import { loadConfig } from '../lib/config';
import { ProfileSchema, TechStackDataSchema, FriendLinksDataSchema } from '../lib/validation';
import type { Profile, TechStackData, FriendLinksData } from '../types';

console.log('开始测试配置加载功能...\n');

// 测试 1: 加载 profile.json
try {
  console.log('测试 1: 加载 profile.json');
  const profile = loadConfig<Profile>('data/profile.json', ProfileSchema);
  console.log('✓ 成功加载 profile.json');
  console.log(`  姓名: ${profile.name}`);
  console.log(`  职位: ${profile.title}\n`);
} catch (error) {
  console.error('✗ 加载 profile.json 失败:', error);
}

// 测试 2: 加载 tech-stack.json
try {
  console.log('测试 2: 加载 tech-stack.json');
  const techStack = loadConfig<TechStackData>('data/tech-stack.json', TechStackDataSchema);
  console.log('✓ 成功加载 tech-stack.json');
  console.log(`  类别数量: ${techStack.categories.length}`);
  console.log(`  第一个类别: ${techStack.categories[0].name}\n`);
} catch (error) {
  console.error('✗ 加载 tech-stack.json 失败:', error);
}

// 测试 3: 加载 friends.json
try {
  console.log('测试 3: 加载 friends.json');
  const friends = loadConfig<FriendLinksData>('data/friends.json', FriendLinksDataSchema);
  console.log('✓ 成功加载 friends.json');
  console.log(`  友链数量: ${friends.links.length}\n`);
} catch (error) {
  console.error('✗ 加载 friends.json 失败:', error);
}

// 测试 4: 测试错误处理
try {
  console.log('测试 4: 测试错误处理（加载不存在的文件）');
  loadConfig('data/nonexistent.json', ProfileSchema);
  console.error('✗ 应该抛出错误但没有');
} catch (error) {
  console.log('✓ 正确抛出错误');
  if (error instanceof Error) {
    console.log(`  错误类型: ${error.name}`);
  }
}

console.log('\n所有测试完成！');

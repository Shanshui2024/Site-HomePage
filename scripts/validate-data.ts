/**
 * 数据文件验证脚本
 * 验证所有示例数据文件是否符合定义的类型接口
 */

import fs from 'fs';
import path from 'path';
import {
  ProfileSchema,
  TechStackDataSchema,
  FriendLinksDataSchema,
  AboutDataSchema,
  validateData,
} from '../lib/validation';

const dataDir = path.join(process.cwd(), 'data');

console.log('🔍 开始验证数据文件...\n');

let hasErrors = false;

// 验证 profile.json
try {
  const profilePath = path.join(dataDir, 'profile.json');
  const profileData = JSON.parse(fs.readFileSync(profilePath, 'utf-8'));
  validateData(ProfileSchema, profileData, 'profile.json');
  console.log('✅ profile.json 验证通过');
} catch (error) {
  console.error('❌ profile.json 验证失败:');
  console.error(error instanceof Error ? error.message : error);
  hasErrors = true;
}

// 验证 tech-stack.json
try {
  const techStackPath = path.join(dataDir, 'tech-stack.json');
  const techStackData = JSON.parse(fs.readFileSync(techStackPath, 'utf-8'));
  validateData(TechStackDataSchema, techStackData, 'tech-stack.json');
  console.log('✅ tech-stack.json 验证通过');
} catch (error) {
  console.error('❌ tech-stack.json 验证失败:');
  console.error(error instanceof Error ? error.message : error);
  hasErrors = true;
}

// 验证 friends.json
try {
  const friendsPath = path.join(dataDir, 'friends.json');
  const friendsData = JSON.parse(fs.readFileSync(friendsPath, 'utf-8'));
  validateData(FriendLinksDataSchema, friendsData, 'friends.json');
  console.log('✅ friends.json 验证通过');
} catch (error) {
  console.error('❌ friends.json 验证失败:');
  console.error(error instanceof Error ? error.message : error);
  hasErrors = true;
}

// 验证 about.json
try {
  const aboutPath = path.join(dataDir, 'about.json');
  const aboutData = JSON.parse(fs.readFileSync(aboutPath, 'utf-8'));
  validateData(AboutDataSchema, aboutData, 'about.json');
  console.log('✅ about.json 验证通过');
} catch (error) {
  console.error('❌ about.json 验证失败:');
  console.error(error instanceof Error ? error.message : error);
  hasErrors = true;
}

// 验证 Markdown 文章
try {
  const postsDir = path.join(dataDir, 'posts');
  const postFiles = fs.readdirSync(postsDir).filter(file => file.endsWith('.md'));
  
  console.log(`\n📝 找到 ${postFiles.length} 篇文章:`);
  postFiles.forEach(file => {
    const content = fs.readFileSync(path.join(postsDir, file), 'utf-8');
    
    // 检查是否有 frontmatter
    if (!content.startsWith('---')) {
      throw new Error(`${file}: 缺少 frontmatter`);
    }
    
    // 简单验证 frontmatter 格式
    const frontmatterEnd = content.indexOf('---', 3);
    if (frontmatterEnd === -1) {
      throw new Error(`${file}: frontmatter 格式错误`);
    }
    
    console.log(`  ✅ ${file}`);
  });
} catch (error) {
  console.error('❌ Markdown 文章验证失败:');
  console.error(error instanceof Error ? error.message : error);
  hasErrors = true;
}

console.log('\n' + '='.repeat(50));
if (hasErrors) {
  console.log('❌ 数据验证失败，请修复上述错误');
  process.exit(1);
} else {
  console.log('✅ 所有数据文件验证通过！');
  process.exit(0);
}

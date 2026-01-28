#!/usr/bin/env node

/**
 * 性能检查脚本
 * 检查项目中可能影响性能的问题
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 开始性能检查...\n');

let issues = 0;
let warnings = 0;

// 1. 检查图片大小
console.log('📸 检查图片大小...');
const imagesDir = path.join(__dirname, '../public/images');
if (fs.existsSync(imagesDir)) {
  const images = fs.readdirSync(imagesDir);
  images.forEach(img => {
    const imgPath = path.join(imagesDir, img);
    const stats = fs.statSync(imgPath);
    const sizeInMB = stats.size / (1024 * 1024);
    
    if (sizeInMB > 1) {
      console.log(`  ⚠️  ${img}: ${sizeInMB.toFixed(2)}MB (建议 < 1MB)`);
      warnings++;
    } else if (sizeInMB > 0.5) {
      console.log(`  ℹ️  ${img}: ${sizeInMB.toFixed(2)}MB (可以优化)`);
    } else {
      console.log(`  ✅ ${img}: ${sizeInMB.toFixed(2)}MB`);
    }
  });
} else {
  console.log('  ℹ️  未找到 images 目录');
}

// 2. 检查 package.json 依赖大小
console.log('\n📦 检查依赖包...');
const packageJson = require('../package.json');
const deps = Object.keys(packageJson.dependencies || {});
console.log(`  总依赖数: ${deps.length}`);

const largeDeps = ['moment', 'lodash', 'jquery'];
const foundLargeDeps = deps.filter(dep => largeDeps.includes(dep));
if (foundLargeDeps.length > 0) {
  console.log(`  ⚠️  发现大型依赖: ${foundLargeDeps.join(', ')}`);
  console.log('     建议使用更轻量的替代方案');
  warnings++;
} else {
  console.log('  ✅ 未发现大型依赖');
}

// 3. 检查 Next.js 配置
console.log('\n⚙️  检查 Next.js 配置...');
const nextConfigPath = path.join(__dirname, '../next.config.js');
if (fs.existsSync(nextConfigPath)) {
  const configContent = fs.readFileSync(nextConfigPath, 'utf-8');
  
  if (configContent.includes('swcMinify')) {
    console.log('  ✅ SWC 压缩已启用');
  } else {
    console.log('  ⚠️  建议启用 SWC 压缩');
    warnings++;
  }
  
  if (configContent.includes('compress')) {
    console.log('  ✅ Gzip 压缩已启用');
  } else {
    console.log('  ⚠️  建议启用 Gzip 压缩');
    warnings++;
  }
  
  if (configContent.includes('optimizePackageImports')) {
    console.log('  ✅ 包导入优化已启用');
  } else {
    console.log('  ℹ️  可以启用包导入优化');
  }
}

// 4. 检查环境变量
console.log('\n🔐 检查环境变量...');
const envPath = path.join(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  console.log('  ✅ .env.local 文件存在');
  const envContent = fs.readFileSync(envPath, 'utf-8');
  if (envContent.includes('NEXT_PUBLIC_SITE_URL')) {
    console.log('  ✅ NEXT_PUBLIC_SITE_URL 已配置');
  } else {
    console.log('  ⚠️  建议配置 NEXT_PUBLIC_SITE_URL');
    warnings++;
  }
} else {
  console.log('  ⚠️  .env.local 文件不存在');
  warnings++;
}

// 总结
console.log('\n' + '='.repeat(50));
console.log('📊 检查结果:');
console.log(`  ❌ 问题: ${issues}`);
console.log(`  ⚠️  警告: ${warnings}`);

if (issues === 0 && warnings === 0) {
  console.log('\n🎉 太棒了！没有发现性能问题！');
} else if (issues === 0) {
  console.log('\n✅ 没有严重问题，但有一些可以优化的地方');
} else {
  console.log('\n⚠️  发现一些需要修复的问题');
}

console.log('\n💡 查看 PERFORMANCE_OPTIMIZATION.md 了解更多优化建议');
console.log('='.repeat(50) + '\n');

process.exit(issues > 0 ? 1 : 0);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // 图片优化配置
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'hixinghai.top' },
      { protocol: 'https', hostname: 'static.shanshui.site' },
      { protocol: 'https', hostname: 'xlyg.fun' },
      { protocol: 'https', hostname: 'www.dmoe.cc' },
      { protocol: 'https', hostname: 'blog.zxwmr.top' },
      { protocol: 'https', hostname: 'img.cdn.caynet.cn' },
      { protocol: 'https', hostname: 'sdjz.wiki' },
      { protocol: 'https', hostname: 'static.axtn.net' },
      { protocol: 'https', hostname: 'q1.qlogo.cn' },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 86400, // 24小时缓存
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // 编译优化
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // 实验性功能
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },

  // 压缩和优化
  compress: true,
  poweredByHeader: false,
  
  // 静态页面生成优化
  generateEtags: true,
  
  // 性能优化
  swcMinify: true,

  // 静态导出配置（可选）
  // output: 'export',
};

module.exports = nextConfig;

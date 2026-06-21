/**
 * 根据 Umami 配置动态生成 CSP 策略
 * 当启用 Umami 时，需要允许 Umami 脚本域名和 API 域名
 */
function getCSP() {
  const umamiEnabled = process.env.NEXT_PUBLIC_UMAMI_ENABLED === 'true';
  const umamiWebsiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
  const umamiSrc = process.env.NEXT_PUBLIC_UMAMI_SRC || 'https://cloud.umami.is/script.js';

  if (umamiEnabled && umamiWebsiteId) {
    // 从 src URL 中提取 Umami 主机名，用于 CSP 白名单
    const umamiHost = new URL(umamiSrc).hostname;
    return `default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://${umamiHost}; connect-src 'self' https://${umamiHost}; sandbox;`;
  }

  return "default-src 'self'; script-src 'none'; sandbox;";
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // 图片优化配置 - 使用通配符允许广泛域名优化
  images: {
    remotePatterns: [
      // 允许所有HTTPS域名的图片优化
      {
        protocol: 'https',
        hostname: '**', // 通配符允许所有子域名
      },
      // 也可以指定特定的顶级域名模式
      {
        protocol: 'https',
        hostname: '*.com',
      },
      {
        protocol: 'https',
        hostname: '*.net',
      },
      {
        protocol: 'https',
        hostname: '*.org',
      },
      {
        protocol: 'https',
        hostname: '*.cn',
      },
      {
        protocol: 'https',
        hostname: '*.top',
      },
      {
        protocol: 'https',
        hostname: '*.wiki',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 86400, // 24小时缓存
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: getCSP(),
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

  // 开发环境特殊配置
  webpack: (config) => {
    // 在开发环境中忽略SSL证书错误
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    return config;
  },
};

module.exports = nextConfig;
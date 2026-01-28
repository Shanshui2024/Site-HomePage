import { MetadataRoute } from 'next';

/**
 * 生成robots.txt
 * 
 * 配置搜索引擎爬虫规则
 * 验证需求：11.2
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://shanshui.site/';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/_next/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

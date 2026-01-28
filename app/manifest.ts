import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: process.env.NEXT_PUBLIC_SITE_NAME || 'Shanshui-山重水复 个人网站',
    short_name: process.env.NEXT_PUBLIC_SITE_SHORT_NAME || '山水小站',
    description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 'Hello hello? 这里是山水的小站欸~',
    start_url: '/',
    display: 'standalone',
    background_color: process.env.NEXT_PUBLIC_BACKGROUND_COLOR || '#ffffff',
    theme_color: process.env.NEXT_PUBLIC_THEME_COLOR || '#3b82f6',
    icons: [
      {
        src: '/images/avatar.jpg',
        sizes: 'any',
        type: 'image/jpeg',
      },
    ],
  };
}

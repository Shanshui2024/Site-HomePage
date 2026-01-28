import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Github, Twitter, Linkedin, Mail, Code, BookOpen, Users, User } from 'lucide-react';
import BilibiliIcon from '@/components/icons/BilibiliIcon';
import QQIcon from '@/components/icons/QQIcon';
import FadeIn from '@/components/animations/FadeIn';
import SlideIn from '@/components/animations/SlideIn';
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { loadProfileFromEnv } from '@/lib/env-config';

/**
 * 首页组件
 * 
 * 功能：
 * - 加载并显示个人信息（头像、姓名、职位、简介）
 * - 显示社交媒体链接
 * - 提供快速入口卡片，导航到其他页面
 * - 使用FadeIn和SlideIn动画增强用户体验
 * 
 * 验证需求：3.1, 3.2, 3.3, 3.5
 */
export default function Home() {
  // 从环境变量加载个人信息数据
  const profile = loadProfileFromEnv();

  // 社交媒体图标映射
  const socialIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    github: Github,
    twitter: Twitter,
    linkedin: Linkedin,
    bilibili: BilibiliIcon,
    qq: QQIcon,
  };

  // 快速入口配置
  const quickLinks = [
    {
      title: '技术栈',
      description: '查看我掌握的技术和工具',
      href: '/tech-stack',
      icon: Code,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: '博客',
      description: '阅读我的技术文章和心得',
      href: '/blog',
      icon: BookOpen,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: '友链',
      description: '发现更多优秀的网站',
      href: '/friends',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: '关于',
      description: '了解更多关于我的信息',
      href: '/about',
      icon: User,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <div className="space-y-12">
      {/* 个人信息区域 */}
      <FadeIn>
        <div className="flex flex-col items-center text-center space-y-6">
          {/* 头像 */}
          <SlideIn direction="down" delay={0.1}>
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-primary-100 shadow-lg">
              <Image
                src={profile.avatar}
                alt={profile.name}
                fill
                sizes="128px"
                className="object-cover"
                priority
                quality={90}
              />
            </div>
          </SlideIn>

          {/* 姓名和职位 */}
          <SlideIn direction="up" delay={0.2}>
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100">
                {profile.name}
              </h1>
              <p className="text-xl md:text-2xl text-primary-600 dark:text-primary-400 font-medium">
                {profile.title}
              </p>
            </div>
          </SlideIn>

          {/* 个人简介 */}
          <SlideIn direction="up" delay={0.3}>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed">
              {profile.bio}
            </p>
          </SlideIn>

          {/* 社交媒体链接 */}
          <SlideIn direction="up" delay={0.4}>
            <div className="flex items-center space-x-4">
              {Object.entries(profile.social).map(([platform, url]) => {
                const Icon = socialIcons[platform];
                if (!Icon) return null;

                return (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-200 hover:scale-110"
                    aria-label={`访问 ${platform}`}
                  >
                    <Icon className="w-6 h-6" />
                  </a>
                );
              })}
              <a
                href={`mailto:${profile.email}`}
                className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-200 hover:scale-110"
                aria-label="发送邮件"
              >
                <Mail className="w-6 h-6" />
              </a>
            </div>
          </SlideIn>
        </div>
      </FadeIn>

      {/* 快速入口卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickLinks.map((link, index) => {
          const Icon = link.icon;
          return (
            <SlideIn key={link.href} direction="up" delay={0.5 + index * 0.1}>
              <Link href={link.href}>
                <Card hover className="h-full">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg ${link.bgColor} flex items-center justify-center mb-3`}>
                      <Icon className={`w-6 h-6 ${link.color}`} />
                    </div>
                    <CardTitle>{link.title}</CardTitle>
                    <CardDescription>{link.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            </SlideIn>
          );
        })}
      </div>

      {/* 欢迎信息 */}
      <FadeIn delay={0.9}>
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-300">
            欢迎来到我的个人网站！在这里你可以了解我的技术栈、阅读我的博客文章，以及发现更多有趣的内容。
          </p>
        </div>
      </FadeIn>
    </div>
  );
}

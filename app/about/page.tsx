import React from 'react';
import type { Metadata } from 'next';
import { Mail, Briefcase, GraduationCap } from 'lucide-react';
import Timeline from '@/components/Timeline';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import FadeIn from '@/components/animations/FadeIn';
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { loadConfig } from '@/lib/config';
import { aboutSchema, type AboutData } from '@/types';
import { loadProfileFromEnv } from '@/lib/env-config';

/**
 * 关于页面
 * 
 * 功能：
 * - 加载about.json数据
 * - 显示详细个人简介
 * - 展示教育背景和工作经历
 * - 使用Timeline组件展示时间线
 * - 显示联系方式
 * - 支持Markdown格式的简介内容
 * 
 * 验证需求：7.1, 7.2, 7.3, 7.4, 7.5
 */

export const metadata: Metadata = {
  title: '关于我',
  description: '了解更多关于我的信息，包括我的经历',
};

export default function AboutPage() {
  // 加载关于页面数据
  const aboutData: AboutData = loadConfig('data/about.json', aboutSchema);
  // 从环境变量加载个人信息数据
  const profile = loadProfileFromEnv();

  return (
    <div className="space-y-12">
      {/* 页面标题 */}
      <FadeIn>
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100">
            关于我
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            了解我的故事、经历和个性等
          </p>
        </div>
      </FadeIn>

      {/* 个人简介（Markdown） */}
      <FadeIn delay={0.1}>
        <Card>
          <MarkdownRenderer content={aboutData.introduction} />
        </Card>
      </FadeIn>

      {/* 教育背景 */}
      {aboutData.education && aboutData.education.length > 0 && (
        <FadeIn delay={0.2}>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <GraduationCap className="w-6 h-6 text-primary-600" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">教育背景</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {aboutData.education.map((edu, index) => (
                <Card key={index} hover>
                  <CardHeader>
                    <CardTitle>{edu.school}</CardTitle>
                    <CardDescription>{edu.degree}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{edu.period}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </FadeIn>
      )}

      {/* 工作经历 */}
      {aboutData.experience && aboutData.experience.length > 0 && (
        <FadeIn delay={0.3}>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Briefcase className="w-6 h-6 text-primary-600" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">工作经历</h2>
            </div>
            <div className="space-y-4">
              {aboutData.experience.map((exp, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <CardTitle>{exp.company}</CardTitle>
                        <CardDescription>{exp.position}</CardDescription>
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400 mt-2 sm:mt-0">
                        {exp.period}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {exp.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </FadeIn>
      )}

      {/* 个人时间线 */}
      {aboutData.timeline && aboutData.timeline.length > 0 && (
        <FadeIn delay={0.4}>
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 text-center">
              我的历程
            </h2>
            <Timeline items={aboutData.timeline} />
          </div>
        </FadeIn>
      )}

      {/* 联系方式 */}
      <FadeIn delay={0.5}>
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-2 border-blue-200 dark:border-blue-800">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <Mail className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">联系我</h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300">
              如果你对我的项目感兴趣，或者想要交流技术，欢迎通过以下方式联系我：
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-4">
              <a
                href={`mailto:${profile.email}`}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
              >
                发送邮件
              </a>
              <a
                href={profile.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-gray-900 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors shadow-md hover:shadow-lg"
              >
                访问 GitHub
              </a>
            </div>
          </div>
        </Card>
      </FadeIn>
    </div>
  );
}

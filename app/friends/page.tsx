import type { Metadata } from 'next';
import FriendLinkCard from '@/components/FriendLinkCard';
import FadeIn from '@/components/animations/FadeIn';
import { loadConfig } from '@/lib/config';
import { friendLinksSchema, type FriendLinksData } from '@/types';
import { shuffleArray } from '@/lib/utils';

/**
 * 友链页面
 * 
 * 功能：
 * - 加载friends.json数据
 * - 使用网格布局展示友链卡片
 * - 响应式：移动端单列，平板端双列，桌面端三列
 * 
 * 验证需求：6.1, 6.4
 */

export const metadata: Metadata = {
  title: '友情链接',
  description: '发现更多优秀的网站和博客，与志同道合的朋友交流学习',
};

export default function FriendsPage() {
  // 加载友链数据
  const friendLinksData: FriendLinksData = loadConfig('data/friends.json', friendLinksSchema);
  
  // 随机打乱友链顺序
  const shuffledLinks = shuffleArray(friendLinksData.links);

  return (
    <div className="space-y-8">
      {/* 页面标题 */}
      <FadeIn>
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100">
            友情链接
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            这里收录了一些优秀的网站和博客，欢迎访问交流！
          </p>
        </div>
      </FadeIn>

      {/* 友链网格 */}
      {shuffledLinks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shuffledLinks.map((link, index) => (
            <FadeIn key={link.url} delay={0.1 + index * 0.05}>
              <FriendLinkCard link={link} />
            </FadeIn>
          ))}
        </div>
      ) : (
        /* 空状态 */
        <FadeIn delay={0.1}>
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <span className="text-4xl">🔗</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              暂无友情链接
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
              还没有添加任何友情链接，敬请期待！
            </p>
          </div>
        </FadeIn>
      )}

      {/* 申请友链说明 */}
      <FadeIn delay={0.2}>
        <div className="mt-12 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-2 border-blue-200 dark:border-blue-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            申请友链
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            如果你也有自己的博客或网站，欢迎与我交换友情链接！请通过邮件联系我，并提供以下信息：
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
            <li>网站名称</li>
            <li>网站描述（不超过50字）</li>
            <li>网站链接</li>
            <li>网站头像/Logo（建议尺寸：200x200px）</li>
          </ul>
        </div>
      </FadeIn>
    </div>
  );
}

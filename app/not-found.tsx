import Link from 'next/link';
import { Home, Search, ArrowLeft, ExternalLink } from 'lucide-react';

/**
 * 404页面
 * 
 * 当用户访问不存在的页面时显示
 * 提供友好的错误消息和导航选项
 */
export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="text-center space-y-8 max-w-lg mx-auto px-4">
        {/* 404图标 */}
        <div className="space-y-4">
          <div className="text-9xl font-bold text-primary-600">404</div>
          <div className="flex justify-center">
            <div className="w-24 h-1 bg-primary-600 rounded-full"></div>
          </div>
        </div>

        {/* 错误信息 */}
        <div className="space-y-3">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            页面未找到
          </h1>
          <p className="text-lg text-gray-600">
            抱歉，您访问的页面不存在或已被移除。
          </p>
        </div>

        {/* 建议操作 */}
        <div className="space-y-4">
          <p className="text-gray-600">您可以尝试：</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              <Home className="w-5 h-5 mr-2" />
              返回首页
            </Link>
            <a
              href="https://blog.shanshui.site/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              <ExternalLink className="w-5 h-5 mr-2" />
              浏览博客
            </a>
          </div>
        </div>

        {/* 快速链接 */}
        <div className="pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-4">或者访问其他页面：</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link
              href="/tech-stack"
              className="text-primary-600 hover:text-primary-700 hover:underline"
            >
              技术栈
            </Link>
            <span className="text-gray-300">|</span>
            <Link
              href="/friends"
              className="text-primary-600 hover:text-primary-700 hover:underline"
            >
              友情链接
            </Link>
            <span className="text-gray-300">|</span>
            <Link
              href="/about"
              className="text-primary-600 hover:text-primary-700 hover:underline"
            >
              关于我
            </Link>
          </div>
        </div>

        {/* 装饰性元素 */}
        <div className="pt-8">
          <div className="inline-block p-4 bg-gray-50 rounded-full">
            <span className="text-6xl">🔍</span>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, Home, RefreshCw } from 'lucide-react';

/**
 * 全局错误边界组件
 * 
 * 捕获并显示运行时错误，提供恢复选项
 * 验证需求：错误处理
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 记录错误到控制台（生产环境可以发送到错误追踪服务）
    console.error('应用错误:', error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-6 max-w-md mx-auto px-4">
        {/* 错误图标 */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>
        </div>

        {/* 错误标题 */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">出错了</h1>
          <p className="text-gray-600">
            抱歉，页面加载时遇到了问题。请尝试刷新页面或返回首页。
          </p>
        </div>

        {/* 错误详情（仅开发环境） */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-left">
            <p className="text-sm text-red-800 font-mono break-all">
              {error.message}
            </p>
          </div>
        )}

        {/* 操作按钮 */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            重试
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
          >
            <Home className="w-5 h-5 mr-2" />
            返回首页
          </Link>
        </div>
      </div>
    </div>
  );
}

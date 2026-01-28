/**
 * 全局加载状态组件
 * 
 * 在页面加载时显示，提供友好的加载反馈
 * 验证需求：11.5
 */
export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-4">
        {/* 加载动画 */}
        <div className="relative w-16 h-16 mx-auto">
          <div className="absolute inset-0 border-4 border-primary-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-primary-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
        
        {/* 加载文本 */}
        <p className="text-gray-600 text-lg">加载中...</p>
      </div>
    </div>
  );
}

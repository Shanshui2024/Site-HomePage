/**
 * 博客页面加载状态
 */
export default function BlogLoading() {
  return (
    <div className="space-y-8">
      {/* 页面标题骨架屏 */}
      <div className="space-y-4">
        <div className="h-10 bg-gray-200 rounded-lg w-48 animate-pulse"></div>
        <div className="h-6 bg-gray-200 rounded-lg w-96 animate-pulse"></div>
      </div>

      {/* 标签筛选骨架屏 */}
      <div className="flex flex-wrap gap-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-8 bg-gray-200 rounded-full w-20 animate-pulse"></div>
        ))}
      </div>

      {/* 文章列表骨架屏 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="border border-gray-200 rounded-lg p-6 space-y-4">
            <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
            </div>
            <div className="flex gap-2">
              <div className="h-6 bg-gray-200 rounded-full w-16 animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded-full w-16 animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

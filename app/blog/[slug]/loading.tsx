/**
 * 博客文章详情页加载状态
 */
export default function PostLoading() {
  return (
    <article className="max-w-4xl mx-auto space-y-8">
      {/* 返回链接骨架屏 */}
      <div className="h-6 bg-gray-200 rounded w-24 animate-pulse"></div>

      {/* 文章头部骨架屏 */}
      <div className="space-y-4">
        <div className="h-12 bg-gray-200 rounded-lg w-3/4 animate-pulse"></div>
        <div className="flex items-center gap-4">
          <div className="h-5 bg-gray-200 rounded w-32 animate-pulse"></div>
          <div className="flex gap-2">
            <div className="h-6 bg-gray-200 rounded-full w-20 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded-full w-20 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* 文章内容骨架屏 */}
      <div className="space-y-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-11/12 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-10/12 animate-pulse"></div>
          </div>
        ))}
      </div>
    </article>
  );
}

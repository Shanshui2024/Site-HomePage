/**
 * MarkdownRenderer Component
 * 
 * 功能：
 * - 使用react-markdown渲染Markdown内容
 * - 自定义样式，匹配网站主题
 * - 支持代码高亮、表格、列表等
 * 
 * 验证需求：7.4, 12.4
 */

import React from 'react';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  // 自定义组件样式
  const components: Components = {
    // 标题
    h1: ({ children }) => (
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-4 pb-2 border-b-2 border-blue-500">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-6 mb-3">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-5 mb-2">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-4 mb-2">
        {children}
      </h4>
    ),
    h5: ({ children }) => (
      <h5 className="text-base font-semibold text-gray-900 dark:text-gray-100 mt-3 mb-2">
        {children}
      </h5>
    ),
    h6: ({ children }) => (
      <h6 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mt-3 mb-2">
        {children}
      </h6>
    ),

    // 段落
    p: ({ children }) => (
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
        {children}
      </p>
    ),

    // 链接
    a: ({ href, children }) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary-600 hover:text-primary-700 hover:underline font-medium"
      >
        {children}
      </a>
    ),

    // 列表
    ul: ({ children }) => (
      <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-inside space-y-2 mb-4 ml-4">
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li className="text-gray-700 dark:text-gray-300">
        {children}
      </li>
    ),

    // 引用
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-blue-500 pl-4 py-2 my-4 bg-gray-50 dark:bg-gray-800 italic text-gray-700 dark:text-gray-300">
        {children}
      </blockquote>
    ),

    // 代码块
    code: ({ inline, className, children, ...props }: any) => {
      if (inline) {
        return (
          <code className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-primary-600 dark:text-primary-400 rounded text-sm font-mono">
            {children}
          </code>
        );
      }
      return (
        <code className={`block p-4 bg-gray-900 dark:bg-gray-950 text-gray-100 rounded-lg overflow-x-auto mb-4 text-sm font-mono ${className || ''}`}>
          {children}
        </code>
      );
    },

    // 预格式化文本
    pre: ({ children }) => (
      <pre className="mb-4">
        {children}
      </pre>
    ),

    // 表格
    table: ({ children }) => (
      <div className="overflow-x-auto mb-4">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 border border-gray-200 dark:border-gray-700">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className="bg-gray-50 dark:bg-gray-800">
        {children}
      </thead>
    ),
    tbody: ({ children }) => (
      <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
        {children}
      </tbody>
    ),
    tr: ({ children }) => (
      <tr>
        {children}
      </tr>
    ),
    th: ({ children }) => (
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
        {children}
      </td>
    ),

    // 水平线
    hr: () => (
      <hr className="my-8 border-t-2 border-gray-200 dark:border-gray-700" />
    ),

    // 图片
    img: ({ src, alt }) => (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt || ''}
        className="max-w-full h-auto rounded-lg my-4 shadow-md"
      />
    ),

    // 强调
    strong: ({ children }) => (
      <strong className="font-bold text-gray-900 dark:text-gray-100">
        {children}
      </strong>
    ),
    em: ({ children }) => (
      <em className="italic text-gray-700 dark:text-gray-300">
        {children}
      </em>
    ),
  };

  return (
    <div className="prose prose-lg max-w-none">
      <ReactMarkdown components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import BlogListClient from '../BlogListClient';
import type { BlogPost } from '@/types';

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

// Mock next/image
jest.mock('next/image', () => {
  return ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} />
  );
});

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
      <div {...props}>{children}</div>
    ),
  },
  useReducedMotion: () => false,
}));

// Mock FadeIn component
jest.mock('@/components/animations/FadeIn', () => {
  return ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
});

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Calendar: () => <span data-testid="calendar-icon">Calendar</span>,
  Clock: () => <span data-testid="clock-icon">Clock</span>,
  BookOpen: () => <span data-testid="book-open-icon">BookOpen</span>,
}));

const mockPosts: BlogPost[] = [
  {
    slug: 'post-1',
    title: '第一篇文章',
    description: '第一篇文章的描述',
    date: '2024-01-15',
    tags: ['React', 'TypeScript'],
    content: '文章内容1',
  },
  {
    slug: 'post-2',
    title: '第二篇文章',
    description: '第二篇文章的描述',
    date: '2024-02-20',
    tags: ['Next.js', 'TypeScript'],
    content: '文章内容2',
  },
  {
    slug: 'post-3',
    title: '第三篇文章',
    description: '第三篇文章的描述',
    date: '2024-03-10',
    tags: ['React', 'TailwindCSS'],
    content: '文章内容3',
  },
];

const mockTags = ['React', 'TypeScript', 'Next.js', 'TailwindCSS'];

describe('BlogListClient Component', () => {
  describe('空状态显示 (Empty State Display)', () => {
    it('shows empty state when no posts are provided', () => {
      render(<BlogListClient allPosts={[]} allTags={[]} />);

      expect(screen.getByText('暂无文章')).toBeInTheDocument();
      expect(screen.getByText('还没有发布任何文章，敬请期待！')).toBeInTheDocument();
      expect(screen.getByTestId('book-open-icon')).toBeInTheDocument();
    });

    it('shows filtered empty state when tag filter returns no results', () => {
      // Render with posts but filter by a tag that doesn't exist in any post
      render(<BlogListClient allPosts={mockPosts} allTags={['NonExistentTag']} />);

      // Click on the non-existent tag
      fireEvent.click(screen.getByText('NonExistentTag'));

      expect(screen.getByText('没有找到相关文章')).toBeInTheDocument();
      expect(screen.getByText('查看全部文章')).toBeInTheDocument();
    });

    it('shows "查看全部文章" button in filtered empty state', () => {
      render(<BlogListClient allPosts={mockPosts} allTags={['NonExistentTag']} />);

      fireEvent.click(screen.getByText('NonExistentTag'));

      const viewAllButton = screen.getByText('查看全部文章');
      expect(viewAllButton).toBeInTheDocument();
    });

    it('clicking "查看全部文章" clears the filter', () => {
      render(<BlogListClient allPosts={mockPosts} allTags={['NonExistentTag']} />);

      // Select non-existent tag
      fireEvent.click(screen.getByText('NonExistentTag'));
      expect(screen.getByText('没有找到相关文章')).toBeInTheDocument();

      // Click view all button
      fireEvent.click(screen.getByText('查看全部文章'));

      // Should now show all posts
      expect(screen.getByText('第一篇文章')).toBeInTheDocument();
      expect(screen.getByText('第二篇文章')).toBeInTheDocument();
      expect(screen.getByText('第三篇文章')).toBeInTheDocument();
    });
  });

  describe('文章列表渲染 (Post List Rendering)', () => {
    it('renders all posts when no tag is selected', () => {
      render(<BlogListClient allPosts={mockPosts} allTags={mockTags} />);

      expect(screen.getByText('第一篇文章')).toBeInTheDocument();
      expect(screen.getByText('第二篇文章')).toBeInTheDocument();
      expect(screen.getByText('第三篇文章')).toBeInTheDocument();
    });

    it('renders page title and description', () => {
      render(<BlogListClient allPosts={mockPosts} allTags={mockTags} />);

      expect(screen.getByText('博客')).toBeInTheDocument();
      expect(screen.getByText('分享技术心得、学习笔记和开发经验')).toBeInTheDocument();
    });

    it('shows post count when posts exist', () => {
      render(<BlogListClient allPosts={mockPosts} allTags={mockTags} />);

      expect(screen.getByText('共有 3 篇文章')).toBeInTheDocument();
    });
  });

  describe('标签筛选功能 (Tag Filtering)', () => {
    it('filters posts by selected tag', () => {
      render(<BlogListClient allPosts={mockPosts} allTags={mockTags} />);

      // Click on React tag button (use getByRole to target the button specifically)
      const reactButton = screen.getAllByText('React').find(el => el.tagName === 'BUTTON');
      fireEvent.click(reactButton!);

      // Should show posts with React tag
      expect(screen.getByText('第一篇文章')).toBeInTheDocument();
      expect(screen.getByText('第三篇文章')).toBeInTheDocument();

      // Should not show post without React tag
      expect(screen.queryByText('第二篇文章')).not.toBeInTheDocument();
    });

    it('shows filtered post count', () => {
      render(<BlogListClient allPosts={mockPosts} allTags={mockTags} />);

      const reactButton = screen.getAllByText('React').find(el => el.tagName === 'BUTTON');
      fireEvent.click(reactButton!);

      // Check that the filtered count section exists with the correct count
      const countSection = document.querySelector('.text-center.text-sm.text-gray-500 p');
      expect(countSection?.textContent).toContain('2');
      expect(countSection?.textContent).toContain('篇文章');
    });

    it('clicking "全部" shows all posts again', () => {
      render(<BlogListClient allPosts={mockPosts} allTags={mockTags} />);

      // First filter by tag
      const reactButton = screen.getAllByText('React').find(el => el.tagName === 'BUTTON');
      fireEvent.click(reactButton!);
      expect(screen.queryByText('第二篇文章')).not.toBeInTheDocument();

      // Then click "全部"
      fireEvent.click(screen.getByText('全部'));

      // All posts should be visible again
      expect(screen.getByText('第一篇文章')).toBeInTheDocument();
      expect(screen.getByText('第二篇文章')).toBeInTheDocument();
      expect(screen.getByText('第三篇文章')).toBeInTheDocument();
    });
  });

  describe('标签筛选器显示 (Tag Filter Display)', () => {
    it('does not show tag filter when no tags are available', () => {
      render(<BlogListClient allPosts={mockPosts} allTags={[]} />);

      expect(screen.queryByText('筛选标签：')).not.toBeInTheDocument();
    });

    it('shows tag filter when tags are available', () => {
      render(<BlogListClient allPosts={mockPosts} allTags={mockTags} />);

      expect(screen.getByText('筛选标签：')).toBeInTheDocument();
    });
  });
});

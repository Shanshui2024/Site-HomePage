import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import BlogPostCard from '../BlogPostCard';
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

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Calendar: () => <span data-testid="calendar-icon">Calendar</span>,
  Clock: () => <span data-testid="clock-icon">Clock</span>,
}));

const mockPost: BlogPost = {
  slug: 'test-post',
  title: '测试文章标题',
  description: '这是一篇测试文章的摘要描述',
  date: '2024-01-15',
  tags: ['React', 'TypeScript'],
  content: '这是文章的内容，用于测试阅读时间计算。',
  coverImage: '/images/test-cover.jpg',
};

const mockPostWithoutCover: BlogPost = {
  slug: 'no-cover-post',
  title: '无封面文章',
  description: '这篇文章没有封面图',
  date: '2024-02-20',
  tags: ['Next.js'],
  content: '文章内容',
};

describe('BlogPostCard Component', () => {
  describe('文章卡片渲染 (Article Card Rendering)', () => {
    it('renders post title', () => {
      render(<BlogPostCard post={mockPost} />);
      expect(screen.getByText('测试文章标题')).toBeInTheDocument();
    });

    it('renders post description', () => {
      render(<BlogPostCard post={mockPost} />);
      expect(screen.getByText('这是一篇测试文章的摘要描述')).toBeInTheDocument();
    });

    it('renders formatted date', () => {
      render(<BlogPostCard post={mockPost} />);
      // Date should be formatted in Chinese locale
      expect(screen.getByText(/2024年1月15日/)).toBeInTheDocument();
    });

    it('renders all tags as badges', () => {
      render(<BlogPostCard post={mockPost} />);
      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByText('TypeScript')).toBeInTheDocument();
    });

    it('renders cover image when provided', () => {
      render(<BlogPostCard post={mockPost} />);
      const image = screen.getByAltText('测试文章标题');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', '/images/test-cover.jpg');
    });

    it('does not render cover image when not provided', () => {
      render(<BlogPostCard post={mockPostWithoutCover} />);
      expect(screen.queryByAltText('无封面文章')).not.toBeInTheDocument();
    });

    it('renders reading time estimate', () => {
      render(<BlogPostCard post={mockPost} />);
      // Should show reading time in minutes
      expect(screen.getByText(/分钟/)).toBeInTheDocument();
    });

    it('renders calendar and clock icons', () => {
      render(<BlogPostCard post={mockPost} />);
      expect(screen.getByTestId('calendar-icon')).toBeInTheDocument();
      expect(screen.getByTestId('clock-icon')).toBeInTheDocument();
    });
  });

  describe('导航链接 (Navigation Link)', () => {
    it('links to correct blog post URL', () => {
      render(<BlogPostCard post={mockPost} />);
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/blog/test-post');
    });
  });

  describe('空标签处理 (Empty Tags Handling)', () => {
    it('handles post with empty tags array', () => {
      const postWithNoTags: BlogPost = {
        ...mockPost,
        tags: [],
      };
      render(<BlogPostCard post={postWithNoTags} />);
      // Should still render without errors
      expect(screen.getByText('测试文章标题')).toBeInTheDocument();
    });
  });
});

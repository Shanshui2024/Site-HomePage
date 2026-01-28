/**
 * 博客文章详情页单元测试
 * 
 * 测试内容：
 * - 测试文章内容渲染
 * - 测试Markdown格式转换
 * - 测试不存在的文章返回404
 * 
 * 验证需求：5.2, 7.4
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock react-markdown (ESM module)
jest.mock('react-markdown', () => {
  return ({ children }: { children: string }) => {
    // Simple markdown to HTML conversion for testing
    const lines = children.split('\n');
    const elements: React.ReactNode[] = [];
    
    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return;
      
      if (trimmedLine.startsWith('# ')) {
        elements.push(<h1 key={index}>{trimmedLine.slice(2)}</h1>);
      } else if (trimmedLine.startsWith('## ')) {
        elements.push(<h2 key={index}>{trimmedLine.slice(3)}</h2>);
      } else if (trimmedLine.startsWith('### ')) {
        elements.push(<h3 key={index}>{trimmedLine.slice(4)}</h3>);
      } else if (trimmedLine.startsWith('- ')) {
        elements.push(<li key={index}>{trimmedLine.slice(2)}</li>);
      } else if (trimmedLine.match(/^\d+\. /)) {
        elements.push(<li key={index}>{trimmedLine.replace(/^\d+\. /, '')}</li>);
      } else if (trimmedLine.startsWith('> ')) {
        elements.push(<blockquote key={index}>{trimmedLine.slice(2)}</blockquote>);
      } else if (trimmedLine === '---') {
        elements.push(<hr key={index} />);
      } else if (trimmedLine.startsWith('```')) {
        // Skip code fence markers
      } else if (trimmedLine.includes('`') && !trimmedLine.startsWith('```')) {
        // Handle inline code
        const parts = trimmedLine.split(/`([^`]+)`/);
        elements.push(
          <p key={index}>
            {parts.map((part, i) => 
              i % 2 === 1 ? <code key={i}>{part}</code> : part
            )}
          </p>
        );
      } else if (trimmedLine.includes('[') && trimmedLine.includes('](')) {
        // Handle links
        const match = trimmedLine.match(/\[([^\]]+)\]\(([^)]+)\)/);
        if (match) {
          elements.push(
            <p key={index}>
              <a href={match[2]} target="_blank" rel="noopener noreferrer">{match[1]}</a>
            </p>
          );
        }
      } else if (trimmedLine.includes('**')) {
        // Handle bold
        const parts = trimmedLine.split(/\*\*([^*]+)\*\*/);
        elements.push(
          <p key={index}>
            {parts.map((part, i) => 
              i % 2 === 1 ? <strong key={i}>{part}</strong> : part
            )}
          </p>
        );
      } else if (trimmedLine.includes('*') && !trimmedLine.includes('**')) {
        // Handle italic
        const parts = trimmedLine.split(/\*([^*]+)\*/);
        elements.push(
          <p key={index}>
            {parts.map((part, i) => 
              i % 2 === 1 ? <em key={i}>{part}</em> : part
            )}
          </p>
        );
      } else {
        elements.push(<p key={index}>{trimmedLine}</p>);
      }
    });
    
    return <div data-testid="markdown-content">{elements}</div>;
  };
});

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

// Mock next/navigation
const mockNotFound = jest.fn();
jest.mock('next/navigation', () => ({
  notFound: () => {
    mockNotFound();
    throw new Error('NEXT_NOT_FOUND');
  },
}));

// Mock next/script
jest.mock('next/script', () => {
  return ({ children, ...props }: { children?: React.ReactNode; [key: string]: unknown }) => (
    <script {...props}>{children}</script>
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
  ArrowLeft: () => <span data-testid="arrow-left-icon">ArrowLeft</span>,
  Calendar: () => <span data-testid="calendar-icon">Calendar</span>,
  Clock: () => <span data-testid="clock-icon">Clock</span>,
}));

// Mock blog utilities
jest.mock('@/lib/blog', () => ({
  getAllPosts: jest.fn(() => [
    { slug: 'test-post', title: 'Test Post', date: '2024-01-15', tags: ['React'], description: 'Test description', content: '# Test Content' },
    { slug: 'another-post', title: 'Another Post', date: '2024-02-20', tags: ['Next.js'], description: 'Another description', content: '# Another Content' },
  ]),
  getPostBySlug: jest.fn((slug: string) => {
    const posts: Record<string, { slug: string; title: string; date: string; tags: string[]; description: string; content: string; coverImage?: string }> = {
      'test-post': {
        slug: 'test-post',
        title: '测试文章标题',
        date: '2024-01-15',
        tags: ['React', 'TypeScript'],
        description: '这是测试文章的描述',
        content: '# 标题\n\n这是文章内容。\n\n## 子标题\n\n- 列表项1\n- 列表项2',
      },
      'post-with-cover': {
        slug: 'post-with-cover',
        title: '带封面的文章',
        date: '2024-02-20',
        tags: ['Next.js'],
        description: '带封面图片的文章',
        content: '文章内容',
        coverImage: '/images/cover.jpg',
      },
    };
    return posts[slug] || null;
  }),
}));

describe('BlogPostPage Component', () => {
  // Import the page component dynamically to test it
  let BlogPostPage: React.ComponentType<{ params: { slug: string } }>;

  beforeEach(async () => {
    jest.clearAllMocks();
    // Dynamic import to get fresh module
    const module = await import('../page');
    BlogPostPage = module.default;
  });

  describe('文章内容渲染 (Article Content Rendering)', () => {
    it('renders article title correctly', () => {
      render(<BlogPostPage params={{ slug: 'test-post' }} />);

      expect(screen.getByText('测试文章标题')).toBeInTheDocument();
    });

    it('renders article description correctly', () => {
      render(<BlogPostPage params={{ slug: 'test-post' }} />);

      expect(screen.getByText('这是测试文章的描述')).toBeInTheDocument();
    });

    it('renders article tags correctly', () => {
      render(<BlogPostPage params={{ slug: 'test-post' }} />);

      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByText('TypeScript')).toBeInTheDocument();
    });

    it('renders formatted date correctly', () => {
      render(<BlogPostPage params={{ slug: 'test-post' }} />);

      // The date should be formatted in Chinese locale
      expect(screen.getByText(/2024年1月15日/)).toBeInTheDocument();
    });

    it('renders reading time estimate', () => {
      render(<BlogPostPage params={{ slug: 'test-post' }} />);

      expect(screen.getByText(/分钟阅读/)).toBeInTheDocument();
    });

    it('renders back to blog list link', () => {
      render(<BlogPostPage params={{ slug: 'test-post' }} />);

      const backLinks = screen.getAllByText('返回博客列表');
      expect(backLinks.length).toBeGreaterThan(0);
      expect(backLinks[0].closest('a')).toHaveAttribute('href', '/blog');
    });

    it('renders article content via MarkdownRenderer', () => {
      render(<BlogPostPage params={{ slug: 'test-post' }} />);

      // The content should be rendered
      expect(screen.getByText('标题')).toBeInTheDocument();
      expect(screen.getByText('这是文章内容。')).toBeInTheDocument();
    });
  });

  describe('不存在的文章返回404 (404 for Non-existent Articles)', () => {
    it('calls notFound() for non-existent slug', () => {
      expect(() => {
        render(<BlogPostPage params={{ slug: 'non-existent-post' }} />);
      }).toThrow('NEXT_NOT_FOUND');

      expect(mockNotFound).toHaveBeenCalled();
    });

    it('calls notFound() for empty slug', () => {
      expect(() => {
        render(<BlogPostPage params={{ slug: '' }} />);
      }).toThrow('NEXT_NOT_FOUND');

      expect(mockNotFound).toHaveBeenCalled();
    });
  });
});

describe('generateStaticParams', () => {
  it('generates static params for all posts', async () => {
    const { generateStaticParams } = await import('../page');
    const params = await generateStaticParams();

    expect(params).toEqual([
      { slug: 'test-post' },
      { slug: 'another-post' },
    ]);
  });
});

describe('generateMetadata', () => {
  it('generates correct metadata for existing post', async () => {
    const { generateMetadata } = await import('../page');
    const metadata = await generateMetadata({ params: { slug: 'test-post' } });

    expect(metadata.title).toBe('测试文章标题');
    expect(metadata.description).toBe('这是测试文章的描述');
    expect(metadata.keywords).toEqual(['React', 'TypeScript']);
  });

  it('generates fallback metadata for non-existent post', async () => {
    const { generateMetadata } = await import('../page');
    const metadata = await generateMetadata({ params: { slug: 'non-existent' } });

    expect(metadata.title).toBe('文章未找到');
  });

  it('includes Open Graph metadata for post with cover image', async () => {
    const { generateMetadata } = await import('../page');
    const metadata = await generateMetadata({ params: { slug: 'post-with-cover' } });

    expect(metadata.openGraph?.images).toEqual(['/images/cover.jpg']);
  });
});

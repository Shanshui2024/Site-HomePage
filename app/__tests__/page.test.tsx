import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: { src: string; alt: string; fill?: boolean; className?: string; priority?: boolean }) => (
    <img src={props.src} alt={props.alt} className={props.className} data-testid="profile-avatar" />
  ),
}));

// Mock next/link
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href} data-testid={`link-${href.replace('/', '')}`}>{children}</a>
  ),
}));

// Mock animation components to render children directly
jest.mock('@/components/animations/FadeIn', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="fade-in">{children}</div>,
}));

jest.mock('@/components/animations/SlideIn', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="slide-in">{children}</div>,
}));

// Mock profile data
const mockProfile = {
  name: 'Test User',
  title: 'Software Developer',
  bio: 'This is a test bio for the homepage.',
  avatar: '/images/avatar.jpg',
  email: 'test@example.com',
  social: {
    github: 'https://github.com/testuser',
    twitter: 'https://twitter.com/testuser',
    linkedin: 'https://linkedin.com/in/testuser',
  },
};

// Mock loadConfig
jest.mock('@/lib/config', () => ({
  loadConfig: jest.fn(() => mockProfile),
}));

// Import after mocks
import Home from '../page';

/**
 * 首页单元测试
 * 
 * 测试内容：
 * - 测试个人信息显示（需求 3.1, 3.2）
 * - 测试社交链接存在（需求 3.5）
 * - 测试快速入口链接（需求 3.3）
 */
describe('Home Page', () => {
  describe('个人信息显示', () => {
    it('应该显示用户姓名', () => {
      render(<Home />);
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });

    it('应该显示用户职位', () => {
      render(<Home />);
      expect(screen.getByText('Software Developer')).toBeInTheDocument();
    });

    it('应该显示用户简介', () => {
      render(<Home />);
      expect(screen.getByText('This is a test bio for the homepage.')).toBeInTheDocument();
    });

    it('应该显示用户头像', () => {
      render(<Home />);
      const avatar = screen.getByTestId('profile-avatar');
      expect(avatar).toBeInTheDocument();
      expect(avatar).toHaveAttribute('src', '/images/avatar.jpg');
      expect(avatar).toHaveAttribute('alt', 'Test User');
    });
  });

  describe('社交链接', () => {
    it('应该显示GitHub链接', () => {
      render(<Home />);
      const githubLink = screen.getByLabelText('访问 github');
      expect(githubLink).toBeInTheDocument();
      expect(githubLink).toHaveAttribute('href', 'https://github.com/testuser');
      expect(githubLink).toHaveAttribute('target', '_blank');
      expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('应该显示Twitter链接', () => {
      render(<Home />);
      const twitterLink = screen.getByLabelText('访问 twitter');
      expect(twitterLink).toBeInTheDocument();
      expect(twitterLink).toHaveAttribute('href', 'https://twitter.com/testuser');
    });

    it('应该显示LinkedIn链接', () => {
      render(<Home />);
      const linkedinLink = screen.getByLabelText('访问 linkedin');
      expect(linkedinLink).toBeInTheDocument();
      expect(linkedinLink).toHaveAttribute('href', 'https://linkedin.com/in/testuser');
    });

    it('应该显示邮件链接', () => {
      render(<Home />);
      const emailLink = screen.getByLabelText('发送邮件');
      expect(emailLink).toBeInTheDocument();
      expect(emailLink).toHaveAttribute('href', 'mailto:test@example.com');
    });
  });

  describe('快速入口链接', () => {
    it('应该显示技术栈入口', () => {
      render(<Home />);
      expect(screen.getByText('技术栈')).toBeInTheDocument();
      expect(screen.getByText('查看我掌握的技术和工具')).toBeInTheDocument();
      const techStackLink = screen.getByTestId('link-tech-stack');
      expect(techStackLink).toHaveAttribute('href', '/tech-stack');
    });

    it('应该显示博客入口', () => {
      render(<Home />);
      expect(screen.getByText('博客')).toBeInTheDocument();
      expect(screen.getByText('阅读我的技术文章和心得')).toBeInTheDocument();
      const blogLink = screen.getByTestId('link-blog');
      expect(blogLink).toHaveAttribute('href', 'https://blog.shanshui.site/');
    });

    it('应该显示友链入口', () => {
      render(<Home />);
      expect(screen.getByText('友链')).toBeInTheDocument();
      expect(screen.getByText('发现更多优秀的网站')).toBeInTheDocument();
      const friendsLink = screen.getByTestId('link-friends');
      expect(friendsLink).toHaveAttribute('href', '/friends');
    });

    it('应该显示关于入口', () => {
      render(<Home />);
      expect(screen.getByText('关于')).toBeInTheDocument();
      expect(screen.getByText('了解更多关于我的信息')).toBeInTheDocument();
      const aboutLink = screen.getByTestId('link-about');
      expect(aboutLink).toHaveAttribute('href', '/about');
    });
  });
});

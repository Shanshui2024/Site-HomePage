import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FriendLinkCard from '../FriendLinkCard';
import type { FriendLink } from '@/types';

// Mock next/image
jest.mock('next/image', () => {
  return ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} data-testid="friend-avatar" />
  );
});

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  ExternalLink: () => <span data-testid="external-link-icon">ExternalLink</span>,
}));

const mockFriendLink: FriendLink = {
  name: '星海科技',
  description: '你我同在，星海之下',
  url: 'https://hixinghai.top/',
  avatar: 'https://hixinghai.top/logo.png',
};

describe('FriendLinkCard Component', () => {
  describe('新标签打开 (New Tab Opening) - 需求 6.2', () => {
    it('should have target="_blank" attribute', () => {
      render(<FriendLinkCard link={mockFriendLink} />);
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('target', '_blank');
    });

    it('should have rel="noopener noreferrer" for security', () => {
      render(<FriendLinkCard link={mockFriendLink} />);
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('should link to the correct URL', () => {
      render(<FriendLinkCard link={mockFriendLink} />);
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', 'https://hixinghai.top/');
    });

    it('should render external link icon', () => {
      render(<FriendLinkCard link={mockFriendLink} />);
      expect(screen.getByTestId('external-link-icon')).toBeInTheDocument();
    });
  });

  describe('字段完整性 (Field Completeness) - 需求 6.3', () => {
    it('should render friend name', () => {
      render(<FriendLinkCard link={mockFriendLink} />);
      expect(screen.getByText('星海科技')).toBeInTheDocument();
    });

    it('should render friend description', () => {
      render(<FriendLinkCard link={mockFriendLink} />);
      expect(screen.getByText('你我同在，星海之下')).toBeInTheDocument();
    });

    it('should render friend avatar', () => {
      render(<FriendLinkCard link={mockFriendLink} />);
      const avatar = screen.getByTestId('friend-avatar');
      expect(avatar).toBeInTheDocument();
      expect(avatar).toHaveAttribute('src', 'https://hixinghai.top/logo.png');
      expect(avatar).toHaveAttribute('alt', '星海科技');
    });

    it('should render all required fields for different friend links', () => {
      const anotherFriend: FriendLink = {
        name: 'Cay的小屋',
        description: '记录成长，分享知识',
        url: 'https://www.caynet.cn/',
        avatar: 'https://img.cdn.caynet.cn/2024-12-1734173116.webp',
      };
      
      render(<FriendLinkCard link={anotherFriend} />);
      
      // Name
      expect(screen.getByText('Cay的小屋')).toBeInTheDocument();
      // Description
      expect(screen.getByText('记录成长，分享知识')).toBeInTheDocument();
      // Avatar
      const avatar = screen.getByTestId('friend-avatar');
      expect(avatar).toHaveAttribute('src', 'https://img.cdn.caynet.cn/2024-12-1734173116.webp');
    });
  });

  describe('响应式布局 (Responsive Layout)', () => {
    it('should have block display class for full-width clickable area', () => {
      render(<FriendLinkCard link={mockFriendLink} />);
      const link = screen.getByRole('link');
      expect(link).toHaveClass('block');
    });

    it('should have h-full class for consistent card height', () => {
      render(<FriendLinkCard link={mockFriendLink} />);
      const link = screen.getByRole('link');
      expect(link).toHaveClass('h-full');
    });
  });
});

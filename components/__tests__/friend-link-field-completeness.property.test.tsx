/**
 * 友链字段完整性属性测试
 * 
 * Feature: personal-portfolio, Property 12: 友链字段完整性
 * 
 * *对于任意*友情链接列表，每个友链的渲染输出应该包含名称、描述和头像这三个必需字段。
 * 
 * **Validates: Requirements 6.3**
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import * as fc from 'fast-check';
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

/**
 * 生成非空字符串的arbitrary（用于必需字段）
 */
const nonEmptyStringArbitrary = fc.string({ minLength: 1, maxLength: 50 })
  .filter(s => s.trim().length > 0)
  .map(s => s.trim());

/**
 * 生成有效URL的arbitrary
 */
const urlArbitrary = fc.webUrl();

/**
 * 生成有效图片URL的arbitrary
 */
const imageUrlArbitrary = fc.oneof(
  fc.constant('/images/avatar.jpg'),
  fc.constant('/images/default.png'),
  fc.webUrl().map(url => `${url}/avatar.png`)
);

/**
 * 生成有效的FriendLink数据的arbitrary
 */
const friendLinkArbitrary: fc.Arbitrary<FriendLink> = fc.record({
  name: nonEmptyStringArbitrary,
  description: nonEmptyStringArbitrary,
  url: urlArbitrary,
  avatar: imageUrlArbitrary,
});

/**
 * Feature: personal-portfolio, Property 12: 友链字段完整性
 * 
 * **Validates: Requirements 6.3**
 */
describe('Property 12: 友链字段完整性', () => {
  /**
   * Property 12.1: 友链应显示名称字段
   * 
   * 对于任意友情链接，渲染后的输出应该包含友链名称
   */
  it('友链应显示名称字段', () => {
    fc.assert(
      fc.property(
        friendLinkArbitrary,
        (link) => {
          const { container } = render(<FriendLinkCard link={link} />);
          
          // 验证：名称应该在渲染输出中可见
          expect(screen.getByText(link.name)).toBeInTheDocument();
          
          // 清理
          container.remove();
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 12.2: 友链应显示描述字段
   * 
   * 对于任意友情链接，渲染后的输出应该包含友链描述
   */
  it('友链应显示描述字段', () => {
    fc.assert(
      fc.property(
        friendLinkArbitrary,
        (link) => {
          const { container } = render(<FriendLinkCard link={link} />);
          
          // 验证：描述应该在渲染输出中可见
          expect(screen.getByText(link.description)).toBeInTheDocument();
          
          // 清理
          container.remove();
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 12.3: 友链应显示头像字段
   * 
   * 对于任意友情链接，渲染后的输出应该包含头像图片元素，
   * 且头像的src属性应与友链数据中的avatar匹配
   */
  it('友链应显示头像字段', () => {
    fc.assert(
      fc.property(
        friendLinkArbitrary,
        (link) => {
          const { container } = render(<FriendLinkCard link={link} />);
          
          // 验证：头像图片应该存在
          const avatar = screen.getByTestId('friend-avatar');
          expect(avatar).toBeInTheDocument();
          
          // 验证：头像src应与友链数据匹配
          expect(avatar).toHaveAttribute('src', link.avatar);
          
          // 验证：头像alt应与友链名称匹配（用于可访问性）
          expect(avatar).toHaveAttribute('alt', link.name);
          
          // 清理
          container.remove();
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 12.4: 友链应同时包含所有三个必需字段
   * 
   * 对于任意友情链接，渲染后的输出应该同时包含名称、描述和头像这三个必需字段
   */
  it('友链应同时包含名称、描述和头像三个必需字段', () => {
    fc.assert(
      fc.property(
        friendLinkArbitrary,
        (link) => {
          const { container } = render(<FriendLinkCard link={link} />);
          
          // 验证名称存在
          const hasName = screen.queryByText(link.name) !== null;
          
          // 验证描述存在
          const hasDescription = screen.queryByText(link.description) !== null;
          
          // 验证头像存在且属性正确
          const avatar = screen.queryByTestId('friend-avatar');
          const hasAvatar = avatar !== null && 
            avatar.getAttribute('src') === link.avatar;
          
          // 所有三个字段都必须存在
          expect(hasName && hasDescription && hasAvatar).toBe(true);
          
          // 清理
          container.remove();
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});

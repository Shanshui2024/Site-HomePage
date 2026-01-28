/**
 * 友链新标签打开属性测试
 * 
 * Feature: personal-portfolio, Property 11: 友链新标签打开
 * 
 * *对于任意*友情链接，渲染后的链接元素应该包含target="_blank"和rel="noopener noreferrer"属性，
 * 确保在新标签页安全打开。
 * 
 * **Validates: Requirements 6.2**
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
 * Feature: personal-portfolio, Property 11: 友链新标签打开
 * 
 * **Validates: Requirements 6.2**
 */
describe('Property 11: 友链新标签打开', () => {
  /**
   * Property 11.1: 友链应包含target="_blank"属性
   * 
   * 对于任意友情链接，渲染后的链接元素应该包含target="_blank"属性
   */
  it('友链应包含target="_blank"属性以在新标签页打开', () => {
    fc.assert(
      fc.property(
        friendLinkArbitrary,
        (link) => {
          const { container } = render(<FriendLinkCard link={link} />);
          
          // 获取链接元素
          const linkElement = screen.getByRole('link');
          
          // 验证：链接应该包含target="_blank"属性
          expect(linkElement).toHaveAttribute('target', '_blank');
          
          // 清理
          container.remove();
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 11.2: 友链应包含rel="noopener noreferrer"属性
   * 
   * 对于任意友情链接，渲染后的链接元素应该包含rel="noopener noreferrer"属性以确保安全性
   */
  it('友链应包含rel="noopener noreferrer"属性以确保安全性', () => {
    fc.assert(
      fc.property(
        friendLinkArbitrary,
        (link) => {
          const { container } = render(<FriendLinkCard link={link} />);
          
          // 获取链接元素
          const linkElement = screen.getByRole('link');
          
          // 验证：链接应该包含rel="noopener noreferrer"属性
          expect(linkElement).toHaveAttribute('rel', 'noopener noreferrer');
          
          // 清理
          container.remove();
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 11.3: 友链href应与原始URL匹配
   * 
   * 对于任意友情链接，渲染后的链接href应该与友链数据中的url完全匹配
   */
  it('友链href应与原始URL完全匹配', () => {
    fc.assert(
      fc.property(
        friendLinkArbitrary,
        (link) => {
          const { container } = render(<FriendLinkCard link={link} />);
          
          // 获取链接元素
          const linkElement = screen.getByRole('link');
          
          // 验证：href应该与原始URL匹配
          expect(linkElement).toHaveAttribute('href', link.url);
          
          // 清理
          container.remove();
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 11.4: 友链应同时具备新标签打开和安全属性
   * 
   * 对于任意友情链接，渲染后的链接元素应该同时包含target="_blank"和rel="noopener noreferrer"属性
   */
  it('友链应同时具备target="_blank"和rel="noopener noreferrer"属性', () => {
    fc.assert(
      fc.property(
        friendLinkArbitrary,
        (link) => {
          const { container } = render(<FriendLinkCard link={link} />);
          
          // 获取链接元素
          const linkElement = screen.getByRole('link');
          
          // 验证：链接应该同时包含两个安全属性
          const hasTargetBlank = linkElement.getAttribute('target') === '_blank';
          const hasSecureRel = linkElement.getAttribute('rel') === 'noopener noreferrer';
          
          expect(hasTargetBlank && hasSecureRel).toBe(true);
          
          // 清理
          container.remove();
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Navigation 组件测试
 * 
 * 测试导航组件的基本功能
 * - 测试当前页面高亮
 * - 测试移动端菜单切换
 * 验证需求：1.2, 1.5
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Navigation from '../Navigation';
import { usePathname } from 'next/navigation';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/'),
}));

const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>;

describe('Navigation', () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue('/');
  });

  it('应该渲染所有导航项', () => {
    render(<Navigation />);
    
    expect(screen.getByText('首页')).toBeInTheDocument();
    expect(screen.getByText('技术栈')).toBeInTheDocument();
    expect(screen.getByText('博客')).toBeInTheDocument();
    expect(screen.getByText('友链')).toBeInTheDocument();
    expect(screen.getByText('关于')).toBeInTheDocument();
  });

  it('应该渲染品牌标识', () => {
    render(<Navigation />);
    
    expect(screen.getByText('Portfolio')).toBeInTheDocument();
  });

  it('应该渲染汉堡菜单按钮', () => {
    render(<Navigation />);
    
    const menuButton = screen.getByLabelText('打开菜单');
    expect(menuButton).toBeInTheDocument();
  });

  // 测试当前页面高亮 - 需求 1.2
  describe('当前页面高亮', () => {
    it('首页路径应该高亮首页链接', () => {
      mockUsePathname.mockReturnValue('/');
      render(<Navigation />);
      
      // 获取桌面端导航中的首页链接（hidden md:flex 容器内的链接）
      const homeLinks = screen.getAllByText('首页');
      // 桌面端导航链接应该有激活样式
      const desktopHomeLink = homeLinks[0];
      expect(desktopHomeLink).toHaveClass('bg-primary-100', 'text-primary-700');
    });

    it('博客链接应该指向外部站点', () => {
      mockUsePathname.mockReturnValue('/');
      render(<Navigation />);
      
      const blogLinks = screen.getAllByText('博客');
      const desktopBlogLink = blogLinks[0];
      expect(desktopBlogLink.closest('a')).toHaveAttribute('href', 'https://blog.shanshui.site/');
      expect(desktopBlogLink.closest('a')).toHaveAttribute('target', '_blank');
    });

    it('技术栈路径应该高亮技术栈链接', () => {
      mockUsePathname.mockReturnValue('/tech-stack');
      render(<Navigation />);
      
      const techLinks = screen.getAllByText('技术栈');
      const desktopTechLink = techLinks[0];
      expect(desktopTechLink).toHaveClass('bg-primary-100', 'text-primary-700');
    });

    it('非激活链接不应该有激活样式', () => {
      mockUsePathname.mockReturnValue('/friends');
      render(<Navigation />);
      
      const homeLinks = screen.getAllByText('首页');
      const desktopHomeLink = homeLinks[0];
      expect(desktopHomeLink).not.toHaveClass('bg-primary-100');
      expect(desktopHomeLink).toHaveClass('text-gray-700');
    });
  });

  // 测试移动端菜单切换 - 需求 1.5
  describe('移动端菜单切换', () => {
    it('点击汉堡菜单按钮应该打开移动端菜单', async () => {
      render(<Navigation />);
      
      const menuButton = screen.getByLabelText('打开菜单');
      fireEvent.click(menuButton);
      
      // 等待移动端菜单出现
      await waitFor(() => {
        expect(screen.getByText('菜单')).toBeInTheDocument();
      });
      
      // 关闭按钮应该出现
      expect(screen.getByLabelText('关闭菜单')).toBeInTheDocument();
    });

    it('点击关闭按钮应该关闭移动端菜单', async () => {
      render(<Navigation />);
      
      // 打开菜单
      const menuButton = screen.getByLabelText('打开菜单');
      fireEvent.click(menuButton);
      
      await waitFor(() => {
        expect(screen.getByText('菜单')).toBeInTheDocument();
      });
      
      // 关闭菜单
      const closeButton = screen.getByLabelText('关闭菜单');
      fireEvent.click(closeButton);
      
      // 等待菜单关闭
      await waitFor(() => {
        expect(screen.queryByLabelText('关闭菜单')).not.toBeInTheDocument();
      });
    });

    it('点击菜单项应该关闭移动端菜单', async () => {
      mockUsePathname.mockReturnValue('/');
      render(<Navigation />);
      
      // 打开菜单
      const menuButton = screen.getByLabelText('打开菜单');
      fireEvent.click(menuButton);
      
      await waitFor(() => {
        expect(screen.getByText('菜单')).toBeInTheDocument();
      });
      
      // 点击移动端菜单中的博客链接
      const mobileMenuBlogLinks = screen.getAllByText('博客');
      // 移动端菜单中的链接是第二个（第一个是桌面端导航）
      const mobileBlogLink = mobileMenuBlogLinks[1];
      fireEvent.click(mobileBlogLink);
      
      // 等待菜单关闭
      await waitFor(() => {
        expect(screen.queryByLabelText('关闭菜单')).not.toBeInTheDocument();
      });
    });

    it('移动端菜单应该显示当前页面的激活状态', async () => {
      mockUsePathname.mockReturnValue('/about');
      render(<Navigation />);
      
      // 打开菜单
      const menuButton = screen.getByLabelText('打开菜单');
      fireEvent.click(menuButton);
      
      await waitFor(() => {
        expect(screen.getByText('菜单')).toBeInTheDocument();
      });
      
      // 移动端菜单中的关于链接应该有激活样式
      const aboutLinks = screen.getAllByText('关于');
      const mobileAboutLink = aboutLinks[1]; // 移动端菜单中的链接
      expect(mobileAboutLink).toHaveClass('bg-primary-100', 'text-primary-700');
    });
  });
});

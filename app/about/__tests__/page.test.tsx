import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock animation components to render children directly
jest.mock('@/components/animations/FadeIn', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="fade-in">{children}</div>,
}));

// Mock MarkdownRenderer
jest.mock('@/components/MarkdownRenderer', () => ({
  __esModule: true,
  default: ({ content }: { content: string }) => <div data-testid="markdown-content">{content}</div>,
}));

// Mock Timeline component
jest.mock('@/components/Timeline', () => ({
  __esModule: true,
  default: ({ items }: { items: Array<{ year: string; event: string }> }) => (
    <div data-testid="timeline">
      {items.map((item, index) => (
        <div key={index} data-testid={`timeline-item-${index}`}>
          <span data-testid={`timeline-year-${index}`}>{item.year}</span>
          <span data-testid={`timeline-event-${index}`}>{item.event}</span>
        </div>
      ))}
    </div>
  ),
}));

// Mock about data
const mockAboutData = {
  introduction: '# 关于我\n\n这是个人简介内容。',
  education: [
    {
      school: '测试大学',
      degree: '计算机科学 学士',
      period: '2015 - 2019',
    },
    {
      school: '测试研究院',
      degree: '软件工程 硕士',
      period: '2019 - 2021',
    },
  ],
  experience: [
    {
      company: '测试科技公司',
      position: '前端开发工程师',
      period: '2021.07 - 2022.12',
      description: '负责前端开发工作。',
    },
    {
      company: '测试互联网公司',
      position: '全栈开发工程师',
      period: '2023.01 - 至今',
      description: '负责全栈开发工作。',
    },
  ],
  timeline: [
    { year: '2015', event: '开始大学学习' },
    { year: '2021', event: '硕士毕业' },
  ],
};

// Mock loadConfig
jest.mock('@/lib/config', () => ({
  loadConfig: jest.fn(() => mockAboutData),
}));

// Import after mocks
import AboutPage from '../page';

/**
 * 关于页面单元测试
 * 
 * 测试内容：
 * - 测试个人简介显示（需求 7.1）
 * - 测试教育背景和经历显示（需求 7.2）
 * - 测试联系方式显示（需求 7.3）
 */
describe('About Page', () => {
  describe('个人简介显示 (需求 7.1)', () => {
    it('应该显示页面标题', () => {
      render(<AboutPage />);
      expect(screen.getByRole('heading', { name: '关于我', level: 1 })).toBeInTheDocument();
    });

    it('应该显示页面描述', () => {
      render(<AboutPage />);
      expect(screen.getByText('了解我的故事、经历和技术理念')).toBeInTheDocument();
    });

    it('应该渲染Markdown格式的个人简介', () => {
      render(<AboutPage />);
      const markdownContent = screen.getByTestId('markdown-content');
      expect(markdownContent).toBeInTheDocument();
      expect(markdownContent).toHaveTextContent('# 关于我');
    });
  });

  describe('教育背景显示 (需求 7.2)', () => {
    it('应该显示教育背景标题', () => {
      render(<AboutPage />);
      expect(screen.getByRole('heading', { name: '教育背景' })).toBeInTheDocument();
    });

    it('应该显示所有教育经历', () => {
      render(<AboutPage />);
      expect(screen.getByText('测试大学')).toBeInTheDocument();
      expect(screen.getByText('计算机科学 学士')).toBeInTheDocument();
      expect(screen.getByText('2015 - 2019')).toBeInTheDocument();
      
      expect(screen.getByText('测试研究院')).toBeInTheDocument();
      expect(screen.getByText('软件工程 硕士')).toBeInTheDocument();
      expect(screen.getByText('2019 - 2021')).toBeInTheDocument();
    });
  });

  describe('工作经历显示 (需求 7.2)', () => {
    it('应该显示工作经历标题', () => {
      render(<AboutPage />);
      expect(screen.getByRole('heading', { name: '工作经历' })).toBeInTheDocument();
    });

    it('应该显示所有工作经历', () => {
      render(<AboutPage />);
      expect(screen.getByText('测试科技公司')).toBeInTheDocument();
      expect(screen.getByText('前端开发工程师')).toBeInTheDocument();
      expect(screen.getByText('2021.07 - 2022.12')).toBeInTheDocument();
      expect(screen.getByText('负责前端开发工作。')).toBeInTheDocument();
      
      expect(screen.getByText('测试互联网公司')).toBeInTheDocument();
      expect(screen.getByText('全栈开发工程师')).toBeInTheDocument();
      expect(screen.getByText('2023.01 - 至今')).toBeInTheDocument();
      expect(screen.getByText('负责全栈开发工作。')).toBeInTheDocument();
    });
  });

  describe('时间线显示 (需求 7.5)', () => {
    it('应该显示时间线标题', () => {
      render(<AboutPage />);
      expect(screen.getByRole('heading', { name: '我的历程' })).toBeInTheDocument();
    });

    it('应该渲染Timeline组件', () => {
      render(<AboutPage />);
      expect(screen.getByTestId('timeline')).toBeInTheDocument();
    });

    it('应该传递正确的时间线数据', () => {
      render(<AboutPage />);
      expect(screen.getByTestId('timeline-year-0')).toHaveTextContent('2015');
      expect(screen.getByTestId('timeline-event-0')).toHaveTextContent('开始大学学习');
      expect(screen.getByTestId('timeline-year-1')).toHaveTextContent('2021');
      expect(screen.getByTestId('timeline-event-1')).toHaveTextContent('硕士毕业');
    });
  });

  describe('联系方式显示 (需求 7.3)', () => {
    it('应该显示联系我标题', () => {
      render(<AboutPage />);
      expect(screen.getByRole('heading', { name: '联系我' })).toBeInTheDocument();
    });

    it('应该显示联系说明文字', () => {
      render(<AboutPage />);
      expect(screen.getByText(/如果你对我的项目感兴趣/)).toBeInTheDocument();
    });

    it('应该显示发送邮件按钮', () => {
      render(<AboutPage />);
      const emailLink = screen.getByRole('link', { name: '发送邮件' });
      expect(emailLink).toBeInTheDocument();
      expect(emailLink).toHaveAttribute('href', 'mailto:zhangsan@example.com');
    });

    it('应该显示GitHub链接', () => {
      render(<AboutPage />);
      const githubLink = screen.getByRole('link', { name: '访问 GitHub' });
      expect(githubLink).toBeInTheDocument();
      expect(githubLink).toHaveAttribute('href', 'https://github.com/zhangsan');
      expect(githubLink).toHaveAttribute('target', '_blank');
      expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });
});

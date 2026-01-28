import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TechStackGrid from '../TechStackGrid';
import type { TechCategory } from '@/types';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
      <div {...props}>{children}</div>
    ),
  },
  useReducedMotion: () => false,
}));

const mockCategories: TechCategory[] = [
  {
    name: '前端开发',
    items: [
      { name: 'React', icon: 'react', level: 'expert', category: '前端开发' },
      { name: 'TypeScript', icon: 'typescript', level: 'advanced', category: '前端开发' },
    ],
  },
  {
    name: '后端开发',
    items: [
      { name: 'Node.js', icon: 'nodejs', level: 'intermediate', category: '后端开发' },
      { name: 'Python', icon: 'python', level: 'beginner', category: '后端开发' },
    ],
  },
];

describe('TechStackGrid Component', () => {
  describe('分类展示 (Category Display)', () => {
    it('renders all category names', () => {
      render(<TechStackGrid categories={mockCategories} />);
      
      expect(screen.getByText('前端开发')).toBeInTheDocument();
      expect(screen.getByText('后端开发')).toBeInTheDocument();
    });

    it('renders tech items under correct categories', () => {
      render(<TechStackGrid categories={mockCategories} />);
      
      // Check that all tech items are rendered
      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByText('TypeScript')).toBeInTheDocument();
      expect(screen.getByText('Node.js')).toBeInTheDocument();
      expect(screen.getByText('Python')).toBeInTheDocument();
    });

    it('renders empty state when no categories provided', () => {
      const { container } = render(<TechStackGrid categories={[]} />);
      
      // Should render the container but with no category sections
      expect(container.querySelector('h2')).not.toBeInTheDocument();
    });

    it('renders category with empty items array', () => {
      const emptyCategory: TechCategory[] = [
        { name: '空类别', items: [] },
      ];
      
      render(<TechStackGrid categories={emptyCategory} />);
      
      expect(screen.getByText('空类别')).toBeInTheDocument();
    });
  });

  describe('悬停信息显示 (Hover Information Display)', () => {
    it('shows proficiency level on hover for expert level', () => {
      render(<TechStackGrid categories={mockCategories} />);
      
      const reactCard = screen.getByText('React').closest('.group');
      expect(reactCard).toBeInTheDocument();
      
      // Trigger hover
      fireEvent.mouseEnter(reactCard!);
      
      // Should show the expert level label
      expect(screen.getByText('专家')).toBeInTheDocument();
    });

    it('shows proficiency level on hover for advanced level', () => {
      render(<TechStackGrid categories={mockCategories} />);
      
      const tsCard = screen.getByText('TypeScript').closest('.group');
      fireEvent.mouseEnter(tsCard!);
      
      expect(screen.getByText('高级')).toBeInTheDocument();
    });

    it('shows proficiency level on hover for intermediate level', () => {
      render(<TechStackGrid categories={mockCategories} />);
      
      const nodeCard = screen.getByText('Node.js').closest('.group');
      fireEvent.mouseEnter(nodeCard!);
      
      expect(screen.getByText('中级')).toBeInTheDocument();
    });

    it('shows proficiency level on hover for beginner level', () => {
      render(<TechStackGrid categories={mockCategories} />);
      
      const pythonCard = screen.getByText('Python').closest('.group');
      fireEvent.mouseEnter(pythonCard!);
      
      expect(screen.getByText('初学者')).toBeInTheDocument();
    });

    it('hides proficiency level on mouse leave', () => {
      render(<TechStackGrid categories={mockCategories} />);
      
      const reactCard = screen.getByText('React').closest('.group');
      
      // Hover to show
      fireEvent.mouseEnter(reactCard!);
      expect(screen.getByText('专家')).toBeInTheDocument();
      
      // Leave to hide
      fireEvent.mouseLeave(reactCard!);
      expect(screen.queryByText('专家')).not.toBeInTheDocument();
    });
  });

  describe('图标渲染 (Icon Rendering)', () => {
    it('renders icon container for each tech item', () => {
      const { container } = render(<TechStackGrid categories={mockCategories} />);
      
      // Each tech item should have an icon container (w-16 h-16)
      const iconContainers = container.querySelectorAll('.w-16.h-16');
      expect(iconContainers.length).toBe(4); // 4 tech items total
    });

    it('renders SVG icon element inside icon container', () => {
      const { container } = render(<TechStackGrid categories={mockCategories} />);
      
      // The component uses lucide-react Code2 icon which renders as SVG
      const svgIcons = container.querySelectorAll('svg');
      expect(svgIcons.length).toBeGreaterThan(0);
    });

    it('icon container has proper styling', () => {
      const { container } = render(<TechStackGrid categories={mockCategories} />);
      
      const iconContainers = container.querySelectorAll('.w-16.h-16');
      iconContainers.forEach((iconContainer) => {
        expect(iconContainer).toHaveClass('flex');
        expect(iconContainer).toHaveClass('items-center');
        expect(iconContainer).toHaveClass('justify-center');
      });
    });
  });
});

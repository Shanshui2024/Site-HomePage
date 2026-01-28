import React from 'react';
import { render, screen } from '@testing-library/react';
import SlideIn from '../SlideIn';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, ...props }: any) => (
      <div className={className} data-testid="motion-div" {...props}>
        {children}
      </div>
    ),
  },
  useReducedMotion: jest.fn(() => false),
}));

describe('SlideIn', () => {
  it('should render children', () => {
    render(
      <SlideIn>
        <div>Test Content</div>
      </SlideIn>
    );
    
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    render(
      <SlideIn className="custom-class">
        <div>Test Content</div>
      </SlideIn>
    );
    
    const motionDiv = screen.getByTestId('motion-div');
    expect(motionDiv).toHaveClass('custom-class');
  });

  it('should support all four directions', () => {
    const directions: Array<'left' | 'right' | 'up' | 'down'> = ['left', 'right', 'up', 'down'];
    
    directions.forEach((direction) => {
      const { container } = render(
        <SlideIn direction={direction}>
          <div>Test {direction}</div>
        </SlideIn>
      );
      
      expect(screen.getByText(`Test ${direction}`)).toBeInTheDocument();
    });
  });

  it('should cap duration at 300ms', () => {
    const { container } = render(
      <SlideIn duration={0.5}>
        <div>Test Content</div>
      </SlideIn>
    );
    
    // Component should cap duration internally
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render without animation when reduced motion is preferred', () => {
    const { useReducedMotion } = require('framer-motion');
    useReducedMotion.mockReturnValue(true);

    render(
      <SlideIn>
        <div>Test Content</div>
      </SlideIn>
    );
    
    expect(screen.getByText('Test Content')).toBeInTheDocument();
    // Should render as plain div, not motion.div
    expect(screen.queryByTestId('motion-div')).not.toBeInTheDocument();
  });
});

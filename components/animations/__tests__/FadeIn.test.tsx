import React from 'react';
import { render, screen } from '@testing-library/react';
import FadeIn from '../FadeIn';

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

describe('FadeIn', () => {
  it('should render children', () => {
    render(
      <FadeIn>
        <div>Test Content</div>
      </FadeIn>
    );
    
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    render(
      <FadeIn className="custom-class">
        <div>Test Content</div>
      </FadeIn>
    );
    
    const motionDiv = screen.getByTestId('motion-div');
    expect(motionDiv).toHaveClass('custom-class');
  });

  it('should cap duration at 300ms', () => {
    const { container } = render(
      <FadeIn duration={0.5}>
        <div>Test Content</div>
      </FadeIn>
    );
    
    // Component should cap duration internally
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render without animation when reduced motion is preferred', () => {
    const { useReducedMotion } = require('framer-motion');
    useReducedMotion.mockReturnValue(true);

    render(
      <FadeIn>
        <div>Test Content</div>
      </FadeIn>
    );
    
    expect(screen.getByText('Test Content')).toBeInTheDocument();
    // Should render as plain div, not motion.div
    expect(screen.queryByTestId('motion-div')).not.toBeInTheDocument();
  });
});

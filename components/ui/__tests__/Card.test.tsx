import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Card, { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../Card';

describe('Card Component', () => {
  it('renders card with children', () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('applies hover styles when hover prop is true', () => {
    const { container } = render(<Card hover>Hoverable card</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('hover:shadow-md');
    expect(card).toHaveClass('cursor-pointer');
  });

  it('does not apply hover styles when hover prop is false', () => {
    const { container } = render(<Card hover={false}>Non-hoverable card</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card).not.toHaveClass('hover:shadow-md');
    expect(card).not.toHaveClass('cursor-pointer');
  });

  it('applies correct padding for different sizes', () => {
    const { container: container1 } = render(<Card padding="sm">Small padding</Card>);
    expect(container1.firstChild).toHaveClass('p-4');

    const { container: container2 } = render(<Card padding="md">Medium padding</Card>);
    expect(container2.firstChild).toHaveClass('p-6');

    const { container: container3 } = render(<Card padding="lg">Large padding</Card>);
    expect(container3.firstChild).toHaveClass('p-8');

    const { container: container4 } = render(<Card padding="none">No padding</Card>);
    expect(container4.firstChild).not.toHaveClass('p-4');
    expect(container4.firstChild).not.toHaveClass('p-6');
    expect(container4.firstChild).not.toHaveClass('p-8');
  });

  it('applies custom className', () => {
    const { container } = render(<Card className="custom-class">Custom card</Card>);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});

describe('CardHeader Component', () => {
  it('renders card header with children', () => {
    render(<CardHeader>Header content</CardHeader>);
    expect(screen.getByText('Header content')).toBeInTheDocument();
  });
});

describe('CardTitle Component', () => {
  it('renders card title as h3 element', () => {
    render(<CardTitle>Card Title</CardTitle>);
    const title = screen.getByText('Card Title');
    expect(title).toBeInTheDocument();
    expect(title.tagName).toBe('H3');
  });
});

describe('CardDescription Component', () => {
  it('renders card description as paragraph', () => {
    render(<CardDescription>Card description</CardDescription>);
    const description = screen.getByText('Card description');
    expect(description).toBeInTheDocument();
    expect(description.tagName).toBe('P');
  });
});

describe('CardContent Component', () => {
  it('renders card content with children', () => {
    render(<CardContent>Content area</CardContent>);
    expect(screen.getByText('Content area')).toBeInTheDocument();
  });
});

describe('CardFooter Component', () => {
  it('renders card footer with children', () => {
    render(<CardFooter>Footer content</CardFooter>);
    expect(screen.getByText('Footer content')).toBeInTheDocument();
  });
});

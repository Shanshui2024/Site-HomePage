import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TagFilter from '../TagFilter';

const mockTags = ['React', 'TypeScript', 'Next.js', 'TailwindCSS'];

describe('TagFilter Component', () => {
  describe('标签筛选功能 (Tag Filtering Functionality)', () => {
    it('renders all provided tags', () => {
      const onTagSelect = jest.fn();
      render(
        <TagFilter
          tags={mockTags}
          selectedTag={null}
          onTagSelect={onTagSelect}
        />
      );

      mockTags.forEach((tag) => {
        expect(screen.getByText(tag)).toBeInTheDocument();
      });
    });

    it('renders "全部" (All) button', () => {
      const onTagSelect = jest.fn();
      render(
        <TagFilter
          tags={mockTags}
          selectedTag={null}
          onTagSelect={onTagSelect}
        />
      );

      expect(screen.getByText('全部')).toBeInTheDocument();
    });

    it('calls onTagSelect with tag when tag button is clicked', () => {
      const onTagSelect = jest.fn();
      render(
        <TagFilter
          tags={mockTags}
          selectedTag={null}
          onTagSelect={onTagSelect}
        />
      );

      fireEvent.click(screen.getByText('React'));
      expect(onTagSelect).toHaveBeenCalledWith('React');
    });

    it('calls onTagSelect with null when "全部" button is clicked', () => {
      const onTagSelect = jest.fn();
      render(
        <TagFilter
          tags={mockTags}
          selectedTag="React"
          onTagSelect={onTagSelect}
        />
      );

      fireEvent.click(screen.getByText('全部'));
      expect(onTagSelect).toHaveBeenCalledWith(null);
    });

    it('highlights selected tag with primary color', () => {
      const onTagSelect = jest.fn();
      render(
        <TagFilter
          tags={mockTags}
          selectedTag="TypeScript"
          onTagSelect={onTagSelect}
        />
      );

      const selectedButton = screen.getByText('TypeScript');
      expect(selectedButton).toHaveClass('bg-primary-600');
      expect(selectedButton).toHaveClass('text-white');
    });

    it('highlights "全部" button when no tag is selected', () => {
      const onTagSelect = jest.fn();
      render(
        <TagFilter
          tags={mockTags}
          selectedTag={null}
          onTagSelect={onTagSelect}
        />
      );

      const allButton = screen.getByText('全部');
      expect(allButton).toHaveClass('bg-primary-600');
      expect(allButton).toHaveClass('text-white');
    });

    it('non-selected tags have gray background', () => {
      const onTagSelect = jest.fn();
      render(
        <TagFilter
          tags={mockTags}
          selectedTag="React"
          onTagSelect={onTagSelect}
        />
      );

      const nonSelectedButton = screen.getByText('TypeScript');
      expect(nonSelectedButton).toHaveClass('bg-gray-100');
      expect(nonSelectedButton).toHaveClass('text-gray-700');
    });
  });

  describe('空标签列表 (Empty Tags List)', () => {
    it('renders only "全部" button when tags array is empty', () => {
      const onTagSelect = jest.fn();
      render(
        <TagFilter
          tags={[]}
          selectedTag={null}
          onTagSelect={onTagSelect}
        />
      );

      expect(screen.getByText('全部')).toBeInTheDocument();
      expect(screen.getByText('筛选标签：')).toBeInTheDocument();
    });
  });

  describe('多次点击 (Multiple Clicks)', () => {
    it('allows switching between different tags', () => {
      const onTagSelect = jest.fn();
      render(
        <TagFilter
          tags={mockTags}
          selectedTag={null}
          onTagSelect={onTagSelect}
        />
      );

      fireEvent.click(screen.getByText('React'));
      expect(onTagSelect).toHaveBeenCalledWith('React');

      fireEvent.click(screen.getByText('TypeScript'));
      expect(onTagSelect).toHaveBeenCalledWith('TypeScript');

      fireEvent.click(screen.getByText('全部'));
      expect(onTagSelect).toHaveBeenCalledWith(null);

      expect(onTagSelect).toHaveBeenCalledTimes(3);
    });
  });
});

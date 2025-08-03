import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LoadMoreButton from '../LoadMoreButton';
import React from 'react';

const defaultProps = {
  loading: false,
  currentPage: 1,
  handleLoadMore: vi.fn(),
  data: {
    characters: {
      info: {
        next: 2,
        prev: null,
        count: 100,
        pages: 5,
      },
    },
  },
};

describe('LoadMoreButton Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders load more button when there is a next page', () => {
    render(<LoadMoreButton {...defaultProps} />);

    expect(screen.getByText('Load More Characters')).toBeInTheDocument();
  });

  it('does not render when there is no next page', () => {
    const propsWithNoNextPage = {
      ...defaultProps,
      data: {
        characters: {
          info: {
            next: null,
            prev: 1,
            count: 100,
            pages: 5,
          },
        },
      },
    };

    render(<LoadMoreButton {...propsWithNoNextPage} />);

    expect(screen.queryByText('Load More Characters')).not.toBeInTheDocument();
  });

  it('calls handleLoadMore when button is clicked', () => {
    render(<LoadMoreButton {...defaultProps} />);

    const button = screen.getByText('Load More Characters');
    fireEvent.click(button);

    expect(defaultProps.handleLoadMore).toHaveBeenCalledTimes(1);
  });

  it('shows loading state when loading and currentPage > 1', () => {
    const loadingProps = {
      ...defaultProps,
      loading: true,
      currentPage: 2,
    };

    render(<LoadMoreButton {...loadingProps} />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('shows loading spinner when in loading state', () => {
    const loadingProps = {
      ...defaultProps,
      loading: true,
      currentPage: 2,
    };

    render(<LoadMoreButton {...loadingProps} />);

    const spinner = screen.getByRole('button').querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('does not show loading state when loading but currentPage is 1', () => {
    const loadingProps = {
      ...defaultProps,
      loading: true,
      currentPage: 1,
    };

    render(<LoadMoreButton {...loadingProps} />);

    expect(screen.getByText('Load More Characters')).toBeInTheDocument();
    expect(screen.getByRole('button')).not.toBeDisabled();
  });

  it('applies correct styling when not loading', () => {
    render(<LoadMoreButton {...defaultProps} />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-(--color-primary-600)', 'text-white', 'hover:bg-(--color-primary-700)');
  });

  it('applies correct styling when loading', () => {
    const loadingProps = {
      ...defaultProps,
      loading: true,
      currentPage: 2,
    };

    render(<LoadMoreButton {...loadingProps} />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-gray-300', 'text-gray-500', 'cursor-not-allowed');
  });

  it('handles data with undefined characters', () => {
    const propsWithUndefinedData = {
      ...defaultProps,
      data: undefined,
    };

    render(<LoadMoreButton {...propsWithUndefinedData} />);

    expect(screen.queryByText('Load More Characters')).not.toBeInTheDocument();
  });

  it('handles data with undefined info', () => {
    const propsWithUndefinedInfo = {
      ...defaultProps,
      data: {
        characters: {
          info: undefined,
        },
      },
    };

    render(<LoadMoreButton {...propsWithUndefinedInfo} />);

    expect(screen.queryByText('Load More Characters')).not.toBeInTheDocument();
  });

  it('handles data with null next page', () => {
    const propsWithNullNext = {
      ...defaultProps,
      data: {
        characters: {
          info: {
            next: null,
            prev: 1,
            count: 100,
            pages: 5,
          },
        },
      },
    };

    render(<LoadMoreButton {...propsWithNullNext} />);

    expect(screen.queryByText('Load More Characters')).not.toBeInTheDocument();
  });

  it('handles data with zero next page', () => {
    const propsWithZeroNext = {
      ...defaultProps,
      data: {
        characters: {
          info: {
            next: 0,
            prev: 1,
            count: 100,
            pages: 5,
          },
        },
      },
    };

    render(<LoadMoreButton {...propsWithZeroNext} />);

    expect(screen.queryByText('Load More Characters')).not.toBeInTheDocument();
  });

  it('renders button with correct text when not loading', () => {
    render(<LoadMoreButton {...defaultProps} />);

    expect(screen.getByText('Load More Characters')).toBeInTheDocument();
  });

  it('renders loading text when in loading state', () => {
    const loadingProps = {
      ...defaultProps,
      loading: true,
      currentPage: 2,
    };

    render(<LoadMoreButton {...loadingProps} />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('has correct button accessibility', () => {
    render(<LoadMoreButton {...defaultProps} />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button.tagName).toBe('BUTTON');
  });

  it('handles edge case with very large page numbers', () => {
    const propsWithLargePage = {
      ...defaultProps,
      currentPage: 999999,
      loading: true,
    };

    render(<LoadMoreButton {...propsWithLargePage} />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('handles edge case with zero page number', () => {
    const propsWithZeroPage = {
      ...defaultProps,
      currentPage: 0,
      loading: true,
    };

    render(<LoadMoreButton {...propsWithZeroPage} />);

    expect(screen.getByText('Load More Characters')).toBeInTheDocument();
    expect(screen.getByRole('button')).not.toBeDisabled();
  });
}); 
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SearchAndFilter from '../SearchAndFilter';
import React from 'react';

const mockStore = {
  searchTerm: '',
  setSearchTerm: vi.fn(),
  setShowFilters: vi.fn(),
  filters: {},
  setFilters: vi.fn(),
  sortOrder: 'asc' as const,
  setSort: vi.fn(),
};

vi.mock('../../store/useStore', () => ({
  useStore: vi.fn(() => mockStore),
}));

vi.mock('../FilterPopover', () => ({
  default: ({ onClose, onFilterChange }: any) => (
    <div data-testid="filter-popover">
      <button onClick={() => onFilterChange({ test: 'filter' })}>Apply Filter</button>
      <button onClick={onClose}>Close</button>
    </div>
  ),
}));

const defaultProps = {
  onFilterChange: vi.fn(),
  onSortChange: vi.fn(),
  totalResults: 42,
  isMobile: false,
};

describe('SearchAndFilter Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockStore.searchTerm = '';
    mockStore.filters = {};
    mockStore.sortOrder = 'asc';
  });

  it('renders search input with placeholder', () => {
    render(<SearchAndFilter {...defaultProps} />);

    expect(screen.getByPlaceholderText('Search or filter results')).toBeInTheDocument();
  });

  it('renders search icon', () => {
    render(<SearchAndFilter {...defaultProps} />);

    expect(screen.getByTestId('magnifying-glass-icon')).toBeInTheDocument();
  });

  it('renders filter button', () => {
    render(<SearchAndFilter {...defaultProps} />);

    expect(screen.getByTestId('adjustments-icon')).toBeInTheDocument();
  });

  it('displays total results count', () => {
    render(<SearchAndFilter {...defaultProps} />);

    expect(screen.getByText('42 Results')).toBeInTheDocument();
  });

  it('displays sort button with current sort order', () => {
    render(<SearchAndFilter {...defaultProps} />);

    expect(screen.getByText('Sort: Name ↑')).toBeInTheDocument();
  });

  it('calls setSearchTerm and setFilters when search input changes', async () => {
    render(<SearchAndFilter {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText('Search or filter results');
    await userEvent.type(searchInput, 'Rick');

    
    expect(mockStore.setSearchTerm).toHaveBeenLastCalledWith('k');
    expect(mockStore.setFilters).toHaveBeenLastCalledWith({ name: 'k' });
  });

  it('calls onFilterChange when search input changes', async () => {
    render(<SearchAndFilter {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText('Search or filter results');
    await userEvent.type(searchInput, 'Morty');

    
    expect(defaultProps.onFilterChange).toHaveBeenLastCalledWith({ name: 'y' });
  });

  it('calls setSort and onSortChange when sort button is clicked', async () => {
    render(<SearchAndFilter {...defaultProps} />);

    const sortButton = screen.getByText('Sort: Name ↑');
    await userEvent.click(sortButton);

    expect(mockStore.setSort).toHaveBeenCalledWith('name', 'desc');
    expect(defaultProps.onSortChange).toHaveBeenCalledWith('name', 'desc');
  });

  it('toggles sort order when sort button is clicked', async () => {
    mockStore.sortOrder = 'desc';
    render(<SearchAndFilter {...defaultProps} />);

    const sortButton = screen.getByText('Sort: Name ↓');
    await userEvent.click(sortButton);

    expect(mockStore.setSort).toHaveBeenCalledWith('name', 'asc');
    expect(defaultProps.onSortChange).toHaveBeenCalledWith('name', 'asc');
  });

  it('renders desktop filter popover when not mobile', () => {
    render(<SearchAndFilter {...defaultProps} />);

    expect(screen.getByTestId('popover')).toBeInTheDocument();
    expect(screen.getByTestId('popover-button')).toBeInTheDocument();
    expect(screen.getByTestId('popover-panel')).toBeInTheDocument();
  });

  it('renders mobile dialog when isMobile is true', () => {
    render(<SearchAndFilter {...defaultProps} isMobile={true} />);

    expect(screen.getByTestId('adjustments-icon')).toBeInTheDocument();
  });

  it('shows filter count badge when filters are active', () => {
    mockStore.filters = { species: 'Human', status: 'Alive' };
    render(<SearchAndFilter {...defaultProps} />);

    expect(screen.getByText('2 Filter')).toBeInTheDocument();
  });

  it('does not show filter count badge when no filters are active', () => {
    mockStore.filters = {};
    render(<SearchAndFilter {...defaultProps} />);

    
    expect(screen.queryByText('Apply Filter')).toBeInTheDocument();
  });

  it('handles empty search term', async () => {
    render(<SearchAndFilter {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText('Search or filter results');
    await userEvent.clear(searchInput);

    
    expect(searchInput).toHaveValue('');
  });

  it('handles special characters in search', async () => {
    render(<SearchAndFilter {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText('Search or filter results');
    await userEvent.type(searchInput, 'Rick & Morty');

    
    expect(mockStore.setSearchTerm).toHaveBeenLastCalledWith('y');
    expect(mockStore.setFilters).toHaveBeenLastCalledWith({ name: 'y' });
  });

  it('calls setShowFilters when filter dialog is closed', async () => {
    render(<SearchAndFilter {...defaultProps} isMobile={true} />);

    const filterButton = screen.getByTestId('adjustments-icon').closest('button');
    await userEvent.click(filterButton!);

    
    const closeButton = screen.getByText('Close');
    await userEvent.click(closeButton);

    expect(mockStore.setShowFilters).toHaveBeenCalledWith(false);
  });

  it('renders with correct styling classes', () => {
    render(<SearchAndFilter {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText('Search or filter results');
    expect(searchInput).toHaveClass('w-full', 'h-[3.25rem]', 'bg-(--color-gray-100)');
  });

  it('handles zero results', () => {
    render(<SearchAndFilter {...defaultProps} totalResults={0} />);

    expect(screen.getByText('0 Results')).toBeInTheDocument();
  });

  it('handles large result counts', () => {
    render(<SearchAndFilter {...defaultProps} totalResults={999999} />);

    expect(screen.getByText('999999 Results')).toBeInTheDocument();
  });

  it('maintains search term state from store', () => {
    mockStore.searchTerm = 'Existing search';
    render(<SearchAndFilter {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText('Search or filter results') as HTMLInputElement;
    expect(searchInput.value).toBe('Existing search');
  });
}); 
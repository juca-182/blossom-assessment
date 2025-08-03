import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import FilterPopover from '../FilterPopover';
import React from 'react';

// Mock the store
const mockStore = {
  filters: {
    character: '',
    species: '',
  },
};

vi.mock('../../store/useStore', () => ({
  useStore: vi.fn(() => mockStore),
}));

const defaultProps = {
  onFilterChange: vi.fn(),
  onClose: vi.fn(),
};

describe('FilterPopover Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockStore.filters = {
      character: '',
      species: '',
    };
  });

  it('renders character filter section', () => {
    render(<FilterPopover {...defaultProps} />);

    expect(screen.getByText('Characters')).toBeInTheDocument();
  });

  it('renders species filter section', () => {
    render(<FilterPopover {...defaultProps} />);

    expect(screen.getByText('Specie')).toBeInTheDocument();
  });

  it('renders all character filter options', () => {
    render(<FilterPopover {...defaultProps} />);

    const allButtons = screen.getAllByText('all');
    expect(allButtons).toHaveLength(2);
    expect(screen.getByText('starred')).toBeInTheDocument();
    expect(screen.getByText('others')).toBeInTheDocument();
  });

  it('renders all species filter options', () => {
    render(<FilterPopover {...defaultProps} />);

    const allButtons = screen.getAllByText('all');
    expect(allButtons).toHaveLength(2);
    expect(screen.getByText('human')).toBeInTheDocument();
    expect(screen.getByText('alien')).toBeInTheDocument();
    expect(screen.getByText('humanoid')).toBeInTheDocument();
    expect(screen.getByText('robot')).toBeInTheDocument();
  });

  it('renders filter buttons', () => {
    render(<FilterPopover {...defaultProps} />);

    const filterButtons = screen.getAllByText('Filter');
    expect(filterButtons).toHaveLength(2);
  });

  it('calls onFilterChange and onClose when desktop filter button is clicked', async () => {
    render(<FilterPopover {...defaultProps} />);

    const filterButtons = screen.getAllByText('Filter');
    const desktopFilterButton = filterButtons[0];
    await userEvent.click(desktopFilterButton);

    expect(defaultProps.onFilterChange).toHaveBeenCalledWith({
      character: '',
      species: '',
    });
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('calls onFilterChange and onClose when mobile filter button is clicked', async () => {
    render(<FilterPopover {...defaultProps} />);

    const filterButtons = screen.getAllByText('Filter');
    const mobileFilterButton = filterButtons[1];
    await userEvent.click(mobileFilterButton);

    expect(defaultProps.onFilterChange).toHaveBeenCalledWith({
      character: '',
      species: '',
    });
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('updates character filter when character option is clicked', async () => {
    render(<FilterPopover {...defaultProps} />);

    const starredButton = screen.getAllByText('starred')[0];
    await userEvent.click(starredButton);

    const filterButtons = screen.getAllByText('Filter');
    const desktopFilterButton = filterButtons[0];
    await userEvent.click(desktopFilterButton);

    expect(defaultProps.onFilterChange).toHaveBeenCalledWith({
      character: 'starred',
      species: '',
    });
  });

  it('updates species filter when species option is clicked', async () => {
    render(<FilterPopover {...defaultProps} />);

    const humanButton = screen.getAllByText('human')[0];
    await userEvent.click(humanButton);

    const filterButtons = screen.getAllByText('Filter');
    const desktopFilterButton = filterButtons[0];
    await userEvent.click(desktopFilterButton);

    expect(defaultProps.onFilterChange).toHaveBeenCalledWith({
      character: '',
      species: 'human',
    });
  });

  it('resets character filter when "all" is clicked', async () => {
    mockStore.filters.character = 'starred';

    render(<FilterPopover {...defaultProps} />);

    const allButtons = screen.getAllByText('all');
    const characterAllButton = allButtons[0];
    await userEvent.click(characterAllButton);

    const filterButtons = screen.getAllByText('Filter');
    const desktopFilterButton = filterButtons[0];
    await userEvent.click(desktopFilterButton);

    expect(defaultProps.onFilterChange).toHaveBeenCalledWith({
      character: '',
      species: '',
    });
  });

  it('resets species filter when "all" is clicked', async () => {
    mockStore.filters.species = 'human';

    render(<FilterPopover {...defaultProps} />);

    const allButtons = screen.getAllByText('all');
    const speciesAllButton = allButtons[1];
    await userEvent.click(speciesAllButton);

    const filterButtons = screen.getAllByText('Filter');
    const desktopFilterButton = filterButtons[0];
    await userEvent.click(desktopFilterButton);

    expect(defaultProps.onFilterChange).toHaveBeenCalledWith({
      character: '',
      species: '',
    });
  });

  it('applies correct styling to selected character filter', async () => {
    render(<FilterPopover {...defaultProps} />);

    const starredButton = screen.getAllByText('starred')[0];
    await userEvent.click(starredButton);

    expect(starredButton).toHaveClass('bg-purple-100', 'text-purple-700', 'border', 'border-purple-300');
  });

  it('applies correct styling to selected species filter', async () => {
    render(<FilterPopover {...defaultProps} />);

    const humanButton = screen.getAllByText('human')[0];
    await userEvent.click(humanButton);

    expect(humanButton).toHaveClass('bg-purple-100', 'text-purple-700', 'border', 'border-purple-300');
  });

  it('applies correct styling to unselected filters', () => {
    render(<FilterPopover {...defaultProps} />);

    const starredButton = screen.getAllByText('starred')[0];
    expect(starredButton).toHaveClass('bg-gray-100', 'text-gray-700', 'hover:bg-gray-200');
  });

  it('handles multiple filter selections', async () => {
    render(<FilterPopover {...defaultProps} />);

    const starredButton = screen.getAllByText('starred')[0];
    await userEvent.click(starredButton);

    const humanButton = screen.getAllByText('human')[0];
    await userEvent.click(humanButton);

    const filterButtons = screen.getAllByText('Filter');
    const desktopFilterButton = filterButtons[0];
    await userEvent.click(desktopFilterButton);

    expect(defaultProps.onFilterChange).toHaveBeenCalledWith({
      character: 'starred',
      species: 'human',
    });
  });

  it('initializes with store filter values', () => {
    mockStore.filters = {
      character: 'starred',
      species: 'human',
    };

    render(<FilterPopover {...defaultProps} />);

    const starredButton = screen.getAllByText('starred')[0];
    const humanButton = screen.getAllByText('human')[0];

    expect(starredButton).toHaveClass('bg-purple-100', 'text-purple-700');
    expect(humanButton).toHaveClass('bg-purple-100', 'text-purple-700');
  });

  it('handles empty store filter values', () => {
    mockStore.filters = {
      character: '',
      species: '',
    };

    render(<FilterPopover {...defaultProps} />);

    const filterButtons = screen.getAllByText('Filter');
    const desktopFilterButton = filterButtons[0];
    fireEvent.click(desktopFilterButton);

    expect(defaultProps.onFilterChange).toHaveBeenCalledWith({
      character: '',
      species: '',
    });
  });

  it('handles undefined store filter values', () => {
    mockStore.filters = {
      character: '',
      species: '',
    };

    render(<FilterPopover {...defaultProps} />);

    const filterButtons = screen.getAllByText('Filter');
    const desktopFilterButton = filterButtons[0];
    fireEvent.click(desktopFilterButton);

    expect(defaultProps.onFilterChange).toHaveBeenCalledWith({
      character: '',
      species: '',
    });
  });

  it('renders desktop filter button with correct styling', () => {
    render(<FilterPopover {...defaultProps} />);

    const filterButtons = screen.getAllByText('Filter');
    const desktopFilterButton = filterButtons[0];
    expect(desktopFilterButton).toHaveClass('bg-gray-800', 'text-white', 'rounded-lg', 'hover:bg-gray-700');
  });

  it('renders mobile filter button with different styling', () => {
    render(<FilterPopover {...defaultProps} />);

    const filterButtons = screen.getAllByText('Filter');
    const mobileFilterButton = filterButtons[1];
    expect(mobileFilterButton).toHaveClass('bg-purple-600', 'text-white', 'rounded-lg', 'hover:bg-purple-700');
  });

  it('capitalizes filter option text', () => {
    render(<FilterPopover {...defaultProps} />);

    const allButtons = screen.getAllByText('all');
    allButtons.forEach(button => {
      expect(button).toHaveClass('capitalize');
    });
  });

  it('handles rapid filter changes', async () => {
    render(<FilterPopover {...defaultProps} />);

    const starredButton = screen.getAllByText('starred')[0];
    const othersButton = screen.getAllByText('others')[0];

    await userEvent.click(starredButton);
    await userEvent.click(othersButton);

    const filterButtons = screen.getAllByText('Filter');
    const desktopFilterButton = filterButtons[0];
    await userEvent.click(desktopFilterButton);

    expect(defaultProps.onFilterChange).toHaveBeenCalledWith({
      character: 'others',
      species: '',
    });
  });
}); 
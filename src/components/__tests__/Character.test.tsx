import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Character from '../Character';
import { ICharacter } from '../../types/character';
import React from 'react';

const mockToggleFavorite = vi.fn();

vi.mock('../../store/useStore', () => ({
  useStore: vi.fn(() => ({
    toggleFavorite: mockToggleFavorite,
  })),
}));

const mockCharacter: ICharacter = {
  id: '1',
  name: 'Rick Sanchez',
  status: 'Alive',
  species: 'Human',
  type: '',
  gender: 'Male',
  image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
  episode: ['https://rickandmortyapi.com/api/episode/1'],
  url: 'https://rickandmortyapi.com/api/character/1',
  created: '2017-11-04T18:48:46.250Z',
  location: {
    name: 'Citadel of Ricks',
    url: 'https://rickandmortyapi.com/api/location/3',
  },
  origin: {
    name: 'Earth (C-137)',
    url: 'https://rickandmortyapi.com/api/location/1',
  },
};

describe('Character Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders character information correctly', () => {
    render(<Character character={mockCharacter} />);

    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
    expect(screen.getByText('Human')).toBeInTheDocument();
    expect(screen.getByAltText('Rick Sanchez')).toBeInTheDocument();
  });

  it('displays favorite heart icon when isFavorite is true', () => {
    render(<Character character={mockCharacter} isFavorite={true} />);

    expect(screen.getByTestId('heart-solid-icon')).toBeInTheDocument();
  });

  it('displays outline heart icon when isFavorite is false', () => {
    render(<Character character={mockCharacter} isFavorite={false} />);

    expect(screen.getByTestId('heart-icon')).toBeInTheDocument();
  });

  it('calls toggleFavorite when heart button is clicked', () => {
    render(<Character character={mockCharacter} />);

    const heartButton = screen.getByTestId('heart-icon').closest('button');
    fireEvent.click(heartButton!);

    expect(mockToggleFavorite).toHaveBeenCalledWith(mockCharacter);
  });

  it('prevents default behavior when heart button is clicked', () => {
    render(<Character character={mockCharacter} />);

    const heartButton = screen.getByTestId('heart-icon').closest('button');
    const clickEvent = new MouseEvent('click', { bubbles: true });
    const preventDefaultSpy = vi.spyOn(clickEvent, 'preventDefault');
    const stopPropagationSpy = vi.spyOn(clickEvent, 'stopPropagation');

    fireEvent(heartButton!, clickEvent);

    expect(preventDefaultSpy).toHaveBeenCalled();
    expect(stopPropagationSpy).toHaveBeenCalled();
  });

  it('renders as a link with correct href', () => {
    render(<Character character={mockCharacter} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/1');
  });

  it('applies correct styling when character is selected', () => {
    render(<Character character={mockCharacter} />);

    // Find the main container div that has the styling
    const characterContainer = screen.getByText('Rick Sanchez').closest('div')?.parentElement;
    expect(characterContainer).toHaveClass('bg-purple-100');
  });

  it('applies hover styling when character is not selected', () => {
    const nonSelectedCharacter = { ...mockCharacter, id: '2' };
    render(<Character character={nonSelectedCharacter} />);

    // Find the main container div that has the styling
    const characterContainer = screen.getByText('Rick Sanchez').closest('div')?.parentElement;
    expect(characterContainer).toHaveClass('hover:bg-(--color-primary-100)');
  });

  it('renders character image with correct attributes', () => {
    render(<Character character={mockCharacter} />);

    const image = screen.getByAltText('Rick Sanchez');
    expect(image).toHaveAttribute('src', mockCharacter.image);
    expect(image).toHaveClass('w-12', 'h-12', 'rounded-full', 'object-cover');
  });

  it('handles character with empty species', () => {
    const characterWithEmptySpecies = { ...mockCharacter, species: '' };
    render(<Character character={characterWithEmptySpecies} />);

    // Check that the species paragraph element exists but has no text content
    const speciesElement = screen.getByText('Rick Sanchez').closest('div')?.querySelector('p');
    expect(speciesElement).toBeInTheDocument();
    expect(speciesElement?.textContent).toBe('');
  });

  it('handles character with long name', () => {
    const characterWithLongName = { ...mockCharacter, name: 'Very Long Character Name That Should Be Truncated' };
    render(<Character character={characterWithLongName} />);

    const nameElement = screen.getByText('Very Long Character Name That Should Be Truncated');
    expect(nameElement).toHaveClass('truncate');
  });
}); 
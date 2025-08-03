import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import CharacterListHeader from '../CharacterListHeader';
import React from 'react';

describe('CharacterListHeader Component', () => {
  it('renders the main title', () => {
    render(<CharacterListHeader />);

    expect(screen.getByText('Rick and Morty list')).toBeInTheDocument();
  });

  it('renders title with correct heading level', () => {
    render(<CharacterListHeader />);

    const title = screen.getByRole('heading', { level: 1 });
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent('Rick and Morty list');
  });

  it('applies correct styling classes', () => {
    render(<CharacterListHeader />);

    const container = screen.getByText('Rick and Morty list').closest('div');
    expect(container).toHaveClass('mb-6', 'pt-[1.625rem]');
  });

  it('applies correct title styling', () => {
    render(<CharacterListHeader />);

    const title = screen.getByText('Rick and Morty list');
    expect(title).toHaveClass('text-2xl', 'font-bold', 'text-gray-900', 'mb-5');
  });

  it('renders only the expected content', () => {
    render(<CharacterListHeader />);

    const container = screen.getByText('Rick and Morty list').closest('div');
    expect(container?.children).toHaveLength(1);
  });

  it('has correct semantic structure', () => {
    render(<CharacterListHeader />);

    const container = screen.getByText('Rick and Morty list').closest('div');
    const title = container?.querySelector('h1');
    
    expect(container).toBeInTheDocument();
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent('Rick and Morty list');
  });

  it('is accessible with proper heading structure', () => {
    render(<CharacterListHeader />);

    const heading = screen.getByRole('heading');
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe('H1');
  });

  it('renders consistently across multiple renders', () => {
    const { rerender } = render(<CharacterListHeader />);
    
    expect(screen.getByText('Rick and Morty list')).toBeInTheDocument();
    
    rerender(<CharacterListHeader />);
    
    expect(screen.getByText('Rick and Morty list')).toBeInTheDocument();
  });
}); 
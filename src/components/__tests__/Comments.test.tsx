import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Comments from '../Comments';
import React from 'react';


const mockStore = {
  getCommentsForCharacter: vi.fn(),
  addComment: vi.fn(),
  removeComment: vi.fn(),
  newComment: '',
  setNewComment: vi.fn(),
};

vi.mock('../../store/useStore', () => ({
  useStore: vi.fn(() => mockStore),
}));


vi.mock('../../utils/helpers', () => ({
  formatDate: vi.fn((date) => `Formatted: ${date}`),
}));

const mockComments = [
  {
    id: '1',
    characterId: '1',
    text: 'This is a great character!',
    createdAt: '2023-01-01T00:00:00.000Z',
  },
  {
    id: '2',
    characterId: '1',
    text: 'Another comment here.',
    createdAt: '2023-01-02T00:00:00.000Z',
  },
];

describe('Comments Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockStore.newComment = '';
  });

  it('renders comments section with title', () => {
    mockStore.getCommentsForCharacter.mockReturnValue([]);
    
    render(<Comments characterId="1" />);

    expect(screen.getByText('Comments')).toBeInTheDocument();
  });

  it('renders comment form with textarea and submit button', () => {
    mockStore.getCommentsForCharacter.mockReturnValue([]);
    
    render(<Comments characterId="1" />);

    expect(screen.getByPlaceholderText('Add a comment...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add Comment' })).toBeInTheDocument();
  });

  it('displays "no comments" message when there are no comments', () => {
    mockStore.getCommentsForCharacter.mockReturnValue([]);
    
    render(<Comments characterId="1" />);

    expect(screen.getByText('No comments yet. Be the first to comment!')).toBeInTheDocument();
  });

  it('displays comments when they exist', () => {
    mockStore.getCommentsForCharacter.mockReturnValue(mockComments);
    
    render(<Comments characterId="1" />);

    expect(screen.getByText('This is a great character!')).toBeInTheDocument();
    expect(screen.getByText('Another comment here.')).toBeInTheDocument();
  });

  it('calls setNewComment when textarea value changes', async () => {
    mockStore.getCommentsForCharacter.mockReturnValue([]);
    
    render(<Comments characterId="1" />);

    const textarea = screen.getByPlaceholderText('Add a comment...');
    await userEvent.type(textarea, 'New comment');

    
    expect(mockStore.setNewComment).toHaveBeenLastCalledWith('t');
  });

  it('calls addComment when form is submitted with valid comment', async () => {
    mockStore.getCommentsForCharacter.mockReturnValue([]);
    mockStore.newComment = 'New comment';
    
    render(<Comments characterId="1" />);

    const submitButton = screen.getByRole('button', { name: 'Add Comment' });
    await userEvent.click(submitButton);

    expect(mockStore.addComment).toHaveBeenCalledWith('New comment', '1');
    expect(mockStore.setNewComment).toHaveBeenCalledWith('');
  });

  it('does not call addComment when form is submitted with empty comment', async () => {
    mockStore.getCommentsForCharacter.mockReturnValue([]);
    mockStore.newComment = '   ';
    
    render(<Comments characterId="1" />);

    const submitButton = screen.getByRole('button', { name: 'Add Comment' });
    await userEvent.click(submitButton);

    expect(mockStore.addComment).not.toHaveBeenCalled();
  });

  it('disables submit button when comment is empty', () => {
    mockStore.getCommentsForCharacter.mockReturnValue([]);
    mockStore.newComment = '';
    
    render(<Comments characterId="1" />);

    const submitButton = screen.getByRole('button', { name: 'Add Comment' });
    expect(submitButton).toBeDisabled();
  });

  it('enables submit button when comment has content', () => {
    mockStore.getCommentsForCharacter.mockReturnValue([]);
    mockStore.newComment = 'Valid comment';
    
    render(<Comments characterId="1" />);

    const submitButton = screen.getByRole('button', { name: 'Add Comment' });
    expect(submitButton).not.toBeDisabled();
  });

  it('calls removeComment when delete button is clicked', async () => {
    mockStore.getCommentsForCharacter.mockReturnValue(mockComments);
    
    render(<Comments characterId="1" />);

    const deleteButtons = screen.getAllByTestId('trash-icon');
    await userEvent.click(deleteButtons[0]);

    expect(mockStore.removeComment).toHaveBeenCalledWith('1');
  });

  it('renders delete button for each comment', () => {
    mockStore.getCommentsForCharacter.mockReturnValue(mockComments);
    
    render(<Comments characterId="1" />);

    const deleteButtons = screen.getAllByTestId('trash-icon');
    expect(deleteButtons).toHaveLength(2);
  });

  it('displays formatted date for each comment', () => {
    mockStore.getCommentsForCharacter.mockReturnValue(mockComments);
    
    render(<Comments characterId="1" />);

    expect(screen.getByText('Formatted: 2023-01-01T00:00:00.000Z')).toBeInTheDocument();
    expect(screen.getByText('Formatted: 2023-01-02T00:00:00.000Z')).toBeInTheDocument();
  });

  it('trims whitespace from comments before adding', async () => {
    mockStore.getCommentsForCharacter.mockReturnValue([]);
    mockStore.newComment = '  Comment with spaces  ';
    
    render(<Comments characterId="1" />);

    const submitButton = screen.getByRole('button', { name: 'Add Comment' });
    await userEvent.click(submitButton);

    expect(mockStore.addComment).toHaveBeenCalledWith('Comment with spaces', '1');
  });

  it('prevents form submission on Enter key when comment is empty', async () => {
    mockStore.getCommentsForCharacter.mockReturnValue([]);
    mockStore.newComment = '';
    
    render(<Comments characterId="1" />);

    const form = screen.getByRole('button', { name: 'Add Comment' }).closest('form');
    fireEvent.submit(form!);

    expect(mockStore.addComment).not.toHaveBeenCalled();
  });

  it('handles comment with special characters', async () => {
    mockStore.getCommentsForCharacter.mockReturnValue([]);
    mockStore.newComment = 'Comment with @#$%^&*() characters!';
    
    render(<Comments characterId="1" />);

    const submitButton = screen.getByRole('button', { name: 'Add Comment' });
    await userEvent.click(submitButton);

    expect(mockStore.addComment).toHaveBeenCalledWith('Comment with @#$%^&*() characters!', '1');
  });

  it('calls getCommentsForCharacter with correct characterId', () => {
    mockStore.getCommentsForCharacter.mockReturnValue([]);
    
    render(<Comments characterId="123" />);

    expect(mockStore.getCommentsForCharacter).toHaveBeenCalledWith('123');
  });
}); 
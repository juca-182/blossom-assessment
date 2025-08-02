import { useState, useEffect } from 'react';
import type { Comment } from '../types/character';

const COMMENTS_KEY = 'rick-and-morty-comments';

export const useComments = (characterId?: string) => {
  const [comments, setComments] = useState<Comment[]>([]);

  // Load comments from localStorage on component mount
  useEffect(() => {
    const storedComments = localStorage.getItem(COMMENTS_KEY);
    if (storedComments) {
      try {
        const allComments = JSON.parse(storedComments);
        if (characterId) {
          // Filter comments for specific character
          setComments(allComments.filter((comment: Comment) => comment.characterId === characterId));
        } else {
          setComments(allComments);
        }
      } catch (error) {
        console.error('Error parsing comments from localStorage:', error);
        setComments([]);
      }
    }
  }, [characterId]);

  // Save comments to localStorage whenever comments change
  useEffect(() => {
    const storedComments = localStorage.getItem(COMMENTS_KEY);
    let allComments: Comment[] = [];
    
    if (storedComments) {
      try {
        allComments = JSON.parse(storedComments);
      } catch (error) {
        console.error('Error parsing existing comments:', error);
        allComments = [];
      }
    }

    if (characterId) {
      // Update comments for specific character
      const otherComments = allComments.filter(comment => comment.characterId !== characterId);
      const updatedComments = [...otherComments, ...comments];
      localStorage.setItem(COMMENTS_KEY, JSON.stringify(updatedComments));
    } else {
      localStorage.setItem(COMMENTS_KEY, JSON.stringify(comments));
    }
  }, [comments, characterId]);

  const addComment = (text: string, characterId: string) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      characterId,
      text,
      createdAt: new Date().toISOString(),
    };
    setComments(prev => [...prev, newComment]);
  };

  const removeComment = (commentId: string) => {
    setComments(prev => prev.filter(comment => comment.id !== commentId));
  };

  const getCommentsForCharacter = (characterId: string) => {
    return comments.filter(comment => comment.characterId === characterId);
  };

  return {
    comments,
    addComment,
    removeComment,
    getCommentsForCharacter,
  };
}; 
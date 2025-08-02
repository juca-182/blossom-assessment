import { useState, useEffect } from 'react';
import type { ICharacter } from '../types/character';

const FAVORITES_KEY = 'rick-and-morty-favorites';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<ICharacter[]>([]);

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const storedFavorites = localStorage.getItem(FAVORITES_KEY);
    if (storedFavorites) {
      try {
        setFavorites(JSON.parse(storedFavorites));
      } catch (error) {
        console.error('Error parsing favorites from localStorage:', error);
        setFavorites([]);
      }
    }
  }, []);

  // Save favorites to localStorage whenever favorites change
  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const addToFavorites = (character: ICharacter) => {
    setFavorites(prev => {
      const isAlreadyFavorite = prev.some(fav => fav.id === character.id);
      if (isAlreadyFavorite) {
        return prev;
      }
      return [...prev, character];
    });
  };

  const removeFromFavorites = (characterId: string) => {
    setFavorites(prev => prev.filter(fav => fav.id !== characterId));
  };

  const toggleFavorite = (character: ICharacter) => {
    const isFavorite = favorites.some(fav => fav.id === character.id);
    if (isFavorite) {
      removeFromFavorites(character.id);
    } else {
      addToFavorites(character);
    }
  };

  const isFavorite = (characterId: string) => {
    return favorites.some(fav => fav.id === characterId);
  };

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
  };
}; 
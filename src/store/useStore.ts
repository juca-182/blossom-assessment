import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ICharacter, Comment, FilterOptions } from '../types/character';

interface AppState {
  // Favorites state
  favorites: ICharacter[];
  addToFavorites: (character: ICharacter) => void;
  removeFromFavorites: (characterId: string) => void;
  toggleFavorite: (character: ICharacter) => void;
  isFavorite: (characterId: string) => boolean;

  // Comments state
  comments: Comment[];
  addComment: (text: string, characterId: string) => void;
  removeComment: (commentId: string) => void;
  getCommentsForCharacter: (characterId: string) => Comment[];

  // UI state
  selectedCharacter: ICharacter | null;
  setSelectedCharacter: (character: ICharacter | null) => void;
  
  // Filter state
  filters: FilterOptions;
  setFilters: (filters: FilterOptions) => void;
  
  // Sort state
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  setSort: (sortBy: string, sortOrder: 'asc' | 'desc') => void;

  // Search and filter UI state
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;

  // Pagination state
  currentPage: number;
  setCurrentPage: (page: number) => void;

  // Comment form state
  newComment: string;
  setNewComment: (comment: string) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Favorites state
      favorites: [],
      addToFavorites: (character: ICharacter) => {
        set((state) => {
          const isAlreadyFavorite = state.favorites.some(fav => fav.id === character.id);
          if (isAlreadyFavorite) {
            return state;
          }
          return { favorites: [...state.favorites, character] };
        });
      },
      removeFromFavorites: (characterId: string) => {
        set((state) => ({
          favorites: state.favorites.filter(fav => fav.id !== characterId)
        }));
      },
      toggleFavorite: (character: ICharacter) => {
        const { isFavorite, addToFavorites, removeFromFavorites } = get();
        if (isFavorite(character.id)) {
          removeFromFavorites(character.id);
        } else {
          addToFavorites(character);
        }
      },
      isFavorite: (characterId: string) => {
        return get().favorites.some(fav => fav.id === characterId);
      },

      // Comments state
      comments: [],
      addComment: (text: string, characterId: string) => {
        const newComment: Comment = {
          id: Date.now().toString(),
          characterId,
          text,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          comments: [...state.comments, newComment]
        }));
      },
      removeComment: (commentId: string) => {
        set((state) => ({
          comments: state.comments.filter(comment => comment.id !== commentId)
        }));
      },
      getCommentsForCharacter: (characterId: string) => {
        return get().comments.filter(comment => comment.characterId === characterId);
      },

      // UI state
      selectedCharacter: null,
      setSelectedCharacter: (character: ICharacter | null) => {
        set({ selectedCharacter: character });
      },

      // Filter state
      filters: {},
      setFilters: (filters: FilterOptions) => {
        set({ filters });
      },

      // Sort state
      sortBy: 'name',
      sortOrder: 'asc',
      setSort: (sortBy: string, sortOrder: 'asc' | 'desc') => {
        set({ sortBy, sortOrder });
      },

      // Search and filter UI state
      searchTerm: '',
      setSearchTerm: (term: string) => {
        set({ searchTerm: term });
      },
      showFilters: false,
      setShowFilters: (show: boolean) => {
        set({ showFilters: show });
      },

      // Pagination state
      currentPage: 1,
      setCurrentPage: (page: number) => {
        set({ currentPage: page });
      },

      // Comment form state
      newComment: '',
      setNewComment: (comment: string) => {
        set({ newComment: comment });
      },
    }),
    {
      name: 'rick-and-morty-storage',
      partialize: (state) => ({
        favorites: state.favorites,
        comments: state.comments,
        filters: state.filters,
        sortBy: state.sortBy,
        sortOrder: state.sortOrder,
        searchTerm: state.searchTerm,
        currentPage: state.currentPage,
      }),
    }
  )
); 
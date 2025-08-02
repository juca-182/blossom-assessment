import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_CHARACTERS } from '../services/queries';
import type { ICharacter, FilterOptions } from '../types/character';
import { useFavorites } from '../hooks/useFavorites';
import { filterCharacters, sortCharacters } from '../utils/helpers';
import SearchAndFilter from '../components/SearchAndFilter';
import Comments from '../components/Comments';
import { getStatusColor, getGenderIcon, formatDate } from '../utils/helpers';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import CharacterListDesktop from '../components/CharacterListDesktop';
import CharacterListMobile from '../components/CharacterListMobile';

const CharacterList: React.FC = () => {
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedCharacter, setSelectedCharacter] = useState<ICharacter | null>(null);

  // GraphQL query for characters
  const { loading, error, data, fetchMore } = useQuery(GET_CHARACTERS, {
    variables: {
      page: currentPage,
      filter: {
        name: filters.name || undefined,
        status: filters.status || undefined,
        species: filters.species || undefined,
        gender: filters.gender || undefined,
      },
    },
    notifyOnNetworkStatusChange: true,
  });

  // Combine API characters with favorites
  const allCharacters = data?.characters?.results || [];
  const combinedCharacters = [...allCharacters, ...favorites.filter(fav =>
    !allCharacters.some((char: ICharacter) => char.id === fav.id)
  )];

  // Apply client-side filtering and sorting
  const filteredCharacters = filterCharacters(combinedCharacters, filters);
  const sortedCharacters = sortCharacters(filteredCharacters, sortBy, sortOrder);

  // Separate starred and regular characters
  const starredCharacters = sortedCharacters.filter(char => isFavorite(char.id));
  const regularCharacters = sortedCharacters.filter(char => !isFavorite(char.id));

  const handleCharacterClick = (character: ICharacter) => {
    setSelectedCharacter(character);
  };

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleSortChange = (newSortBy: string, newSortOrder: 'asc' | 'desc') => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  };

  const loadMore = () => {
    if (data?.characters?.info?.next) {
      fetchMore({
        variables: {
          page: data.characters.info.next,
        },
      });
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Characters</h2>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Layout */}
      <CharacterListMobile
        selectedCharacter={selectedCharacter}
        setSelectedCharacter={setSelectedCharacter}
        handleFilterChange={handleFilterChange}
        handleSortChange={handleSortChange}
        sortedCharacters={sortedCharacters}
        starredCharacters={starredCharacters}
        regularCharacters={regularCharacters}
        handleCharacterClick={handleCharacterClick}
        loading={loading}
        toggleFavorite={toggleFavorite}
        isFavorite={isFavorite}
      />

      {/* Desktop Layout */}
      <CharacterListDesktop
        handleFilterChange={handleFilterChange}
        handleSortChange={handleSortChange}
        sortedCharacters={sortedCharacters}
        starredCharacters={starredCharacters}
        selectedCharacter={selectedCharacter}
        regularCharacters={regularCharacters}
        handleCharacterClick={handleCharacterClick}
        toggleFavorite={toggleFavorite}
        isFavorite={isFavorite}
        loading={loading}
      />

    </div>
  );
};

export default CharacterList; 
import React from "react";
import { useQuery } from '@apollo/client';
import { GET_CHARACTERS } from '../services/queries';
import { ICharacter } from "../types/character";
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Comments from "./Comments";
import SearchAndFilter from "./SearchAndFilter";
import { getStatusColor } from "../utils/helpers";
import { useStore } from "../store/useStore";
import { filterCharacters, sortCharacters } from "../utils/helpers";


const CharacterListMobile: React.FC<{
  }> = () => {
  const { 
    favorites,
    selectedCharacter, 
    setSelectedCharacter, 
    filters, 
    setFilters, 
    sortBy, 
    sortOrder, 
    setSort, 
    toggleFavorite, 
    isFavorite,
    currentPage,
    setCurrentPage
  } = useStore();

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

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleSortChange = (newSortBy: string, newSortOrder: 'asc' | 'desc') => {
    setSort(newSortBy, newSortOrder);
  };

  const handleCharacterClick = (character: ICharacter) => {
    setSelectedCharacter(character);
  };
    return (
      <div className="block lg:hidden">
        {selectedCharacter ? (
          // Mobile Detail View
          <div className="p-4">
            {/* Back Button */}
            <button
              onClick={() => setSelectedCharacter(null)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors duration-200"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              Back to Characters
            </button>

            {/* Character Details */}
            <div className="text-center">
              {/* Character Avatar */}
              <div className="relative inline-block mb-4">
                <img
                  src={selectedCharacter.image}
                  alt={selectedCharacter.name}
                  className="w-32 h-32 rounded-full object-cover"
                />
                <button
                  onClick={() => toggleFavorite(selectedCharacter)}
                  className="absolute -bottom-2 -right-2 p-2 bg-white rounded-full shadow-md hover:scale-110 transition-transform duration-200"
                >
                  {isFavorite(selectedCharacter.id) ? (
                    <HeartSolidIcon className="w-5 h-5 text-green-500" />
                  ) : (
                    <HeartIcon className="w-5 h-5 text-gray-400 hover:text-red-500" />
                  )}
                </button>
              </div>

              {/* Character Name */}
              <h1 className="text-2xl font-bold text-gray-900 mb-6">
                {selectedCharacter.name}
              </h1>

              {/* Character Details */}
              <div className="space-y-4 mb-8">
                <div className="border-b border-gray-200 pb-3">
                  <span className="text-sm font-medium text-gray-700">Specie:</span>
                  <span className="ml-2 text-gray-900">{selectedCharacter.species}</span>
                </div>

                <div className="border-b border-gray-200 pb-3">
                  <span className="text-sm font-medium text-gray-700">Status:</span>
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedCharacter.status)}`}>
                    {selectedCharacter.status}
                  </span>
                </div>

                {selectedCharacter.type && (
                  <div className="border-b border-gray-200 pb-3">
                    <span className="text-sm font-medium text-gray-700">Occupation:</span>
                    <span className="ml-2 text-gray-900">{selectedCharacter.type}</span>
                  </div>
                )}
              </div>

              {/* Comments Section */}
              <Comments characterId={selectedCharacter.id} />
            </div>
          </div>
        ) : (
          // Mobile List View
          <div className="p-4">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Rick and Morty list</h1>
            </div>

            {/* Search and Filter */}
            <div className="mb-6">
              <SearchAndFilter
                onFilterChange={handleFilterChange}
                onSortChange={handleSortChange}
                totalResults={sortedCharacters.length}
              />
            </div>

            {/* Character Lists */}
            <div className="space-y-6">
              {/* Starred Characters Section */}
              {starredCharacters.length > 0 && (
                <div>
                  <h2 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                    Starred Characters ({starredCharacters.length})
                  </h2>
                  <div className="space-y-2">
                    {starredCharacters.map((character) => (
                      <div
                        key={character.id}
                        className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors duration-200 hover:bg-gray-50"
                        onClick={() => handleCharacterClick(character)}
                      >
                        <img
                          src={character.image}
                          alt={character.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">{character.name}</h3>
                          <p className="text-sm text-gray-600">{character.species}</p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(character);
                          }}
                          className="p-1"
                        >
                          <HeartSolidIcon className="w-5 h-5 text-green-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Regular Characters Section */}
              <div>
                <h2 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                  Characters ({regularCharacters.length})
                </h2>
                <div className="space-y-2">
                  {regularCharacters.map((character) => (
                    <div
                      key={character.id}
                      className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors duration-200 hover:bg-gray-50"
                      onClick={() => handleCharacterClick(character)}
                    >
                      <img
                        src={character.image}
                        alt={character.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">{character.name}</h3>
                        <p className="text-sm text-gray-600">{character.species}</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(character);
                        }}
                        className="p-1"
                      >
                        <HeartIcon className="w-5 h-5 text-gray-400 hover:text-red-500" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
              </div>
            )}

          </div>
        )}
      </div>
    );
  };



export default CharacterListMobile;
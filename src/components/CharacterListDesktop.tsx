import React from "react";
import { useQuery } from '@apollo/client';
import { GET_CHARACTERS } from '../services/queries';
import SearchAndFilter from "./SearchAndFilter";
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { getStatusColor } from "../utils/helpers";
import Comments from "./Comments";
import { ICharacter } from "../types/character";
import Character from "./Character";
import { useStore } from "../store/useStore";
import { filterCharacters, sortCharacters } from "../utils/helpers";

const CharacterListDesktop: React.FC<{
}> = () => {
  const { 
    favorites, 
    toggleFavorite, 
    isFavorite, 
    filters, 
    setFilters, 
    sortBy, 
    sortOrder, 
    setSort, 
    selectedCharacter, 
    setSelectedCharacter,
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

    return (
      <div className="hidden lg:block">

        <div className="hidden lg:flex">
          {/* Left Sidebar */}
          <div className="w-80 bg-white border-r border-gray-200 min-h-screen p-6">
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
                      <Character
                        key={character.id}
                        character={character}
                        isFavorite
                      />
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
                    <Character
                      key={character.id}
                      character={character}
                    />
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

          {/* Right Content Area - Character Details */}
          <div className="flex-1 p-8">
            {selectedCharacter ? (
              <div className="max-w-2xl">
                {/* Character Header */}
                <div className="flex items-start gap-6 mb-8">
                  <div className="relative">
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

                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {selectedCharacter.name}
                    </h1>
                  </div>
                </div>

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
            ) : (
              <div className="text-center text-gray-500">
                <h2 className="text-xl font-semibold mb-2">Select a Character</h2>
                <p>Click on a character from the list to view their details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

export default CharacterListDesktop;
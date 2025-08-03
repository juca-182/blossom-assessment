import React from "react";
import { useQuery } from "@apollo/client";
import { GET_CHARACTERS } from "../services/queries";
import SearchAndFilter from "../components/SearchAndFilter";
import { FilterOptions, ICharacter } from "../types/character";
import Character from "../components/Character";
import { useStore } from "../store/useStore";
import { filterCharacters, sortCharacters } from "../utils/helpers";
import { Outlet, useParams } from "react-router-dom";

const CharacterList: React.FC = () => {
  const { id: currentCharacterId } = useParams();
  const {
    favorites,
    isFavorite,
    filters,
    setFilters,
    sortBy,
    sortOrder,
    setSort,
    currentPage,
    setCurrentPage,
  } = useStore();

  // GraphQL query for characters
  const { loading, data } = useQuery(GET_CHARACTERS, {
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
  const combinedCharacters = [
    ...allCharacters,
    ...favorites.filter(
      (fav) => !allCharacters.some((char: ICharacter) => char.id === fav.id)
    ),
  ];

  // Apply client-side filtering and sorting
  const filteredCharacters = filterCharacters(combinedCharacters, filters);
  const sortedCharacters = sortCharacters(
    filteredCharacters,
    sortBy,
    sortOrder
  );

  // Separate starred and regular characters
  const starredCharacters = filters.character === 'others' ?  [] : sortedCharacters.filter((char) =>
    isFavorite(char.id)
  );
  const regularCharacters = filters.character === 'starred' ?  [] : sortedCharacters.filter(
    (char) => !isFavorite(char.id)
  );

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleSortChange = (
    newSortBy: string,
    newSortOrder: "asc" | "desc"
  ) => {
    setSort(newSortBy, newSortOrder);
  };

  const handleLoadMore = () => {
    setCurrentPage(currentPage + 1);
  };

  const Header = () => (
    <div className="mb-6 pt-[1.625rem]">
      <h1 className="text-2xl font-bold text-gray-900 mb-5">
        Rick and Morty list
      </h1>
    </div>
  );

  const LoadMoreButton = () => {
    const hasNextPage = data?.characters?.info?.next;
    const isLoadingMore = loading && currentPage > 1;

    if (!hasNextPage) return null;

    return (
      <div className="flex justify-center mt-6">
        <button
          onClick={handleLoadMore}
          disabled={isLoadingMore}
          className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
            isLoadingMore
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {isLoadingMore ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Loading...</span>
            </div>
          ) : (
            "Load More Characters"
          )}
        </button>
      </div>
    );
  };

  const List = ({
    title,
    characters,
    areFavorites = false,
  }: {
    title: string;
    characters: ICharacter[];
    areFavorites?: boolean;
  }) => (
    <>
      <h2 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
        {title} ({characters.length})
      </h2>
      <div className="space-y-2">
        {characters.map((character) => (
          <Character
            key={character.id}
            character={character}
            isFavorite={areFavorites}
          />
        ))}
      </div>
    </>
  );

  const Loader = ({ loading }: { loading: boolean }) => {
    if (!loading) return null;

    return (
      <div className="flex justify-center items-center py-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <div className="hidden lg:flex">
          {/* Left Sidebar */}
          <div className="lg:w-[23.4375rem] bg-white border-r border-gray-200 min-h-screen px-4">
            {/* Header */}
            <Header />
            <SearchAndFilter
              onFilterChange={handleFilterChange}
              onSortChange={handleSortChange}
              totalResults={sortedCharacters.length}
            />

            {/* Character Lists */}
            <div className="space-y-6">
              {/* Starred Characters Section */}
              {starredCharacters.length > 0 && (
                <div>
                  <List
                    title="Starred Characters"
                    characters={starredCharacters}
                    areFavorites
                  />
                </div>
              )}

              {/* Regular Characters Section */}
              <div>
                <List title="Characters" characters={regularCharacters} />
              </div>
            </div>

            {/* Loading State */}
            <Loader loading={loading} />
            
            {/* Load More Button */}
            <LoadMoreButton />
          </div>

          <div className="flex-1 p-8">
            <Outlet />
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="block lg:hidden">
        {/* -> // Mobile List View */}
        {currentCharacterId ? (
          <Outlet />
        ) : (
          <div className="p-4">
            {/* Header */}
            <Header />
            <SearchAndFilter
              onFilterChange={handleFilterChange}
              onSortChange={handleSortChange}
              totalResults={sortedCharacters.length}
            />

            {/* Character Lists */}
            <div className="space-y-6 px-4">
              {/* Starred Characters Section */}
              {starredCharacters.length > 0 && (
                <div>
                  <List
                    title="Starred Characters"
                    characters={starredCharacters}
                    areFavorites
                  />
                </div>
              )}

              {/* Regular Characters Section */}
              <div>
                <List title="Characters" characters={regularCharacters} />
              </div>
            </div>

            {/* Loading State */}
            <Loader loading={loading} />
            
            {/* Load More Button */}
            <LoadMoreButton />
          </div>
        )}
      </div>
    </div>
  );
};

export default CharacterList;

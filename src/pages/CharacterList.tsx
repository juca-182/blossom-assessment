import React from "react";
import { useQuery } from "@apollo/client";
import { GET_CHARACTERS } from "../services/queries";
import SearchAndFilter from "../components/SearchAndFilter";
import { ICharacter } from "../types/character";
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
  const starredCharacters = sortedCharacters.filter((char) =>
    isFavorite(char.id)
  );
  const regularCharacters = sortedCharacters.filter(
    (char) => !isFavorite(char.id)
  );

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleSortChange = (
    newSortBy: string,
    newSortOrder: "asc" | "desc"
  ) => {
    setSort(newSortBy, newSortOrder);
  };

  const Header = () => (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Rick and Morty list
      </h1>
    </div>
  );

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
          <div className="w-80 bg-white border-r border-gray-200 min-h-screen p-6">
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
          </div>
        )}
      </div>
    </div>
  );
};

export default CharacterList;

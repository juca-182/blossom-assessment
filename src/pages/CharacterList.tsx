import React from "react";
import { useQuery } from "@apollo/client";
import { GET_CHARACTERS } from "../services/queries";
import SearchAndFilter from "../components/SearchAndFilter";
import { IFilterOptions, ICharacter } from "../types/character";
import Character from "../components/Character";
import { useStore } from "../store/useStore";
import { filterCharacters, sortCharacters } from "../utils/helpers";
import { Outlet, useParams } from "react-router-dom";
import LoadMoreButton from "../components/LoadMoreButton";
import CharacterListHeader from "../components/CharacterListHeader";

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

  const allCharacters = data?.characters?.results || [];
  const combinedCharacters = [
    ...allCharacters,
    ...favorites.filter(
      (fav) => !allCharacters.some((char: ICharacter) => char.id === fav.id)
    ),
  ];

  const filteredCharacters = filterCharacters(combinedCharacters, filters);
  const sortedCharacters = sortCharacters(
    filteredCharacters,
    sortBy,
    sortOrder
  );

  const starredCharacters =
    filters.character === "others"
      ? []
      : sortedCharacters.filter((char) => isFavorite(char.id));
  const regularCharacters =
    filters.character === "starred"
      ? []
      : sortedCharacters.filter((char) => !isFavorite(char.id));

  const handleFilterChange = (newFilters: IFilterOptions) => {
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
      <div className="hidden lg:block">
        <div className="hidden lg:flex">
          <div className="lg:w-[23.4375rem] bg-white border-r border-gray-200 min-h-screen px-4">
            <CharacterListHeader />
            <SearchAndFilter
              onFilterChange={handleFilterChange}
              onSortChange={handleSortChange}
              totalResults={sortedCharacters.length}
            />

            <div className="space-y-6 scroll-side-bar" >
              {starredCharacters.length > 0 && (
                <div>
                  <List
                    title="Starred Characters"
                    characters={starredCharacters}
                    areFavorites
                  />
                </div>
              )}

              <div>
                <List title="Characters" characters={regularCharacters} />
              </div>
            </div>

            <Loader loading={loading} />

            <LoadMoreButton
              loading={loading}
              currentPage={currentPage}
              handleLoadMore={handleLoadMore}
              data={data}
            />
          </div>

          <div className="flex-1 p-8">
            <Outlet />
          </div>
        </div>
      </div>

      <div className="block lg:hidden">
        {currentCharacterId ? (
          <Outlet />
        ) : (
          <div className="p-4">
            <CharacterListHeader />
            <SearchAndFilter
              onFilterChange={handleFilterChange}
              onSortChange={handleSortChange}
              totalResults={sortedCharacters.length}
              isMobile
            />

            <div className="space-y-6 px-4">
              {starredCharacters.length > 0 && (
                <div>
                  <List
                    title="Starred Characters"
                    characters={starredCharacters}
                    areFavorites
                  />
                </div>
              )}

              <div>
                <List title="Characters" characters={regularCharacters} />
              </div>
            </div>

            <Loader loading={loading} />

            <LoadMoreButton
              loading={loading}
              currentPage={currentPage}
              handleLoadMore={handleLoadMore}
              data={data}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CharacterList;

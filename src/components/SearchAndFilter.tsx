import React from "react";
import { MagnifyingGlassIcon, FunnelIcon } from "@heroicons/react/24/outline";
import type { FilterOptions } from "../types/character";
import { useStore } from "../store/useStore";

interface SearchAndFilterProps {
  onFilterChange: (filters: FilterOptions) => void;
  onSortChange: (sortBy: string, sortOrder: "asc" | "desc") => void;
  totalResults: number;
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  onFilterChange,
  onSortChange,
  totalResults,
}) => {
  const {
    searchTerm,
    setSearchTerm,
    showFilters,
    setShowFilters,
    filters,
    setFilters,
    sortBy,
    sortOrder,
    setSort,
  } = useStore();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    const newFilters = { ...filters, name: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSortChange = (newSortBy: string) => {
    let newSortOrder: "asc" | "desc" = "asc";

    if (newSortBy === sortBy) {
      newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    }

    setSort(newSortBy, newSortOrder);
    onSortChange(newSortBy, newSortOrder);
  };

  const clearFilters = () => {
    setFilters({});
    setSearchTerm("");
    onFilterChange({});
  };

  return (
    <div className="mb-6">
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search or filter results"
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
          />
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
          >
            <FunnelIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-blue-600 font-medium">
            {totalResults} Results
          </span>
          {Object.keys(filters).some(
            (key) => filters[key as keyof FilterOptions]
          ) && (
            <span className="text-green-600 bg-green-100 px-2 py-1 rounded-sm text-xs">
              {
                Object.keys(filters).filter(
                  (key) => filters[key as keyof FilterOptions]
                ).length
              }{" "}
              Filter
            </span>
          )}
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-4 shadow-lg">
            {/* Character Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Character
              </label>
              <div className="flex flex-wrap gap-2">
                {["All", "Starred", "Others"].map((option) => (
                  <button
                    key={option}
                    onClick={() =>
                      handleFilterChange(
                        "status",
                        option === "All" ? "" : option
                      )
                    }
                    className={`px-3 py-1 text-sm rounded-full transition-colors duration-200 ${
                      filters.status === option ||
                      (option === "All" && !filters.status)
                        ? "bg-purple-100 text-purple-700 border border-purple-300"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Species Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specie
              </label>
              <div className="flex flex-wrap gap-2">
                {["All", "Human", "Alien"].map((option) => (
                  <button
                    key={option}
                    onClick={() =>
                      handleFilterChange(
                        "species",
                        option === "All" ? "" : option
                      )
                    }
                    className={`px-3 py-1 text-sm rounded-full transition-colors duration-200 ${
                      filters.species === option ||
                      (option === "All" && !filters.species)
                        ? "bg-purple-100 text-purple-700 border border-purple-300"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <div className="flex flex-wrap gap-2">
                {["name", "status", "species"].map((option) => (
                  <button
                    key={option}
                    onClick={() => handleSortChange(option)}
                    className={`px-3 py-1 text-sm rounded-full transition-colors duration-200 ${
                      sortBy === option
                        ? "bg-purple-100 text-purple-700 border border-purple-300"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                    {sortBy === option && (
                      <span className="ml-1">
                        {sortOrder === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Apply Filter Button */}
            <button
              onClick={() => setShowFilters(false)}
              className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 text-sm font-medium"
            >
              Filter
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchAndFilter;

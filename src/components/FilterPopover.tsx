import React from "react";
import type { FilterOptions } from "../types/character";
import { useState } from 'react';

interface FilterPopoverProps {
  onFilterChange: (filters: FilterOptions) => void;
  onClose: () => void;
}

interface FilterPopoverOptions {
  character?: string;
  species?: string;
}

const SearchAndFilterPopover: React.FC<FilterPopoverProps> = ({
  onFilterChange,
  onClose,
}) => {
  const [filters, setFilters] = useState<FilterPopoverOptions>({
    character: '',
    species: '',
  });

  const handleFilterChange = (filter: string, value: string) => {
    setFilters((prevFilters) => {
        return {
          ...prevFilters,
          [filter]: value
        }
    });
  };

  const handleApplyFilters = () => {
    onFilterChange(filters);
    onClose();
  };

  return (
    <div className="p-4 space-y-4">
      {/* Character Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Characters
        </label>
        <div className="flex flex-wrap gap-2">
          {["all", "starred","others"].map((option) => (
            <button
              key={option}
              onClick={() =>
                handleFilterChange('character', option === "all" ? "" : option)
              }
              className={`px-3 py-1 text-sm rounded-full transition-colors duration-200 rounded-lg capitalize ${filters.character === option ||
                (option === "all" && !filters.character)
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
          {["all", "human", "alien", "humanoid", "robot"].map((option) => (
            <button
              key={option}
              onClick={() =>
                handleFilterChange('species', option === "all" ? "" : option)
              }
              className={`px-3 py-1 text-sm rounded-full transition-colors duration-200 capitalize ${filters.species === option ||
                (option === "all" && !filters.species)
                ? "bg-purple-100 text-purple-700 border border-purple-300"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Button */}
      <button
        onClick={handleApplyFilters}
        className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 text-sm font-medium"
      >
        Filter
      </button>
    </div>
  );
};

export default SearchAndFilterPopover;
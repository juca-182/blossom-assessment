import React from "react";
import { MagnifyingGlassIcon, AdjustmentsVerticalIcon, ArrowsUpDownIcon } from "@heroicons/react/24/outline";
import type { FilterOptions } from "../types/character";
import { useStore } from "../store/useStore";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import FilterPopover from "./FilterPopover";

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

  const handleSortChange = () => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSort("name", newSortOrder);
    onSortChange("name", newSortOrder);
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
            className="w-full h-[3.25rem] bg-(--color-gray-100) pl-10 pr-4 py-2 rounded-lg text-sm outline-none"
          />

          {/* Filter Popover Button */}
          <Popover className="absolute right-3 top-1/2 transform -translate-y-1/2 z-3">
            <PopoverButton className="p-1 text-gray-400 hover:text-(--color-primary-600) hover:bg-(--color-primary-600)/5 rounded-lg  transition-colors duration-200">
              <AdjustmentsVerticalIcon className="w-6 h-6" />
            </PopoverButton>

            <PopoverPanel className="absolute right-0 mt-4 -mr-[0.74rem] w-[21.3rem] bg-white rounded-lg border border-gray-200 shadow-lg z-50">
              <FilterPopover
                onClose={() => setShowFilters(false)}
                onFilterChange={onFilterChange}
              />
            </PopoverPanel>
          </Popover>
        </div>

        {/* Results Count and Sort */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <span className="text-blue-600 font-medium">
              {totalResults} Results
            </span>
            {/* Sort Button */}
            <button
              onClick={handleSortChange}
              className="flex items-center gap-1 px-2 py-1 text-gray-600 hover:text-gray-800 transition-colors duration-200"
            >
              <span className="text-xs">Sort: Name {sortOrder === "asc" ? "↑" : "↓"}</span>
            </button>
          </div>
          
          {/* Filter Counter */}
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
      </div>
    </div>
  );
};

export default SearchAndFilter;
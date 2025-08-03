import React, { useState } from "react";
import {
  MagnifyingGlassIcon,
  AdjustmentsVerticalIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import { IFilterOptions, ISearchAndFilterProps } from "../types/character";
import { useStore } from "../store/useStore";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import FilterPopover from "./FilterPopover";


const SearchAndFilter: React.FC<ISearchAndFilterProps> = ({
  onFilterChange,
  onSortChange,
  totalResults,
  isMobile,
}) => {
  const {
    searchTerm,
    setSearchTerm,
    setShowFilters,
    filters,
    setFilters,
    sortOrder,
    setSort,
  } = useStore();

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    const newFilters = { ...filters, name: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSortChange = () => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSort("name", newSortOrder);
    onSortChange("name", newSortOrder);
  };

  const toggleDialog = () => setIsDialogOpen((prev) => !prev);

  const toggleShowFilters = () => setShowFilters(false);

  return (
    <div className="mb-6">
      <div className="space-y-4">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search or filter results"
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full h-[3.25rem] bg-(--color-gray-100) pl-10 pr-4 py-2 rounded-lg text-sm outline-none"
          />

          <>
            {isMobile ? (
              <>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 z-3">
                  <button
                    onClick={toggleDialog}
                    className="p-1 text-gray-400 hover:text-(--color-primary-600) hover:bg-(--color-primary-600)/5 rounded-lg  transition-colors duration-200"
                  >
                    <AdjustmentsVerticalIcon className="w-6 h-6" />
                  </button>
                </div>

                <dialog
                  open={isDialogOpen}
                  className="fixed inset-0 w-screen h-screen bg-white z-50 p-8"
                >
                  <div className="flex flex-col h-full">
                    <div className="flex flex-row justify-between p-4">
                      <button
                        onClick={toggleDialog}
                        className="block lg:hidden flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
                      >
                        <ArrowLeftIcon className="w-5 h-5" />
                      </button>

                      <h3 className="text-lg font-semibold text-gray-900 text-center">
                        Filters
                      </h3>

                      <div className="" />
                    </div>

                    <FilterPopover
                      onClose={() => {
                        toggleShowFilters();
                        toggleDialog();
                      }}
                      onFilterChange={onFilterChange}
                    />
                  </div>
                  {false && (
                    <>
                      <div className="flex flex-row justify-between p-4">
                        <button
                          onClick={toggleDialog}
                          className="block lg:hidden flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
                        >
                          <ArrowLeftIcon className="w-5 h-5" />
                        </button>

                        <h3 className="text-lg font-semibold text-gray-900 text-center">
                          Filters
                        </h3>

                        <div className="" />
                      </div>

                      <FilterPopover
                        onClose={() => {
                          toggleShowFilters();
                          toggleDialog();
                        }}
                        onFilterChange={onFilterChange}
                      />
                    </>
                  )}
                </dialog>
              </>
            ) : (
              <Popover className="absolute right-3 top-1/2 transform -translate-y-1/2 z-3">
                <PopoverButton className="p-1 text-gray-400 hover:text-(--color-primary-600) hover:bg-(--color-primary-600)/5 rounded-lg  transition-colors duration-200">
                  <AdjustmentsVerticalIcon className="w-6 h-6" />
                </PopoverButton>

                <PopoverPanel className="absolute right-0 mt-4 -mr-[0.74rem] w-[21.3rem] bg-white rounded-lg border border-gray-200 shadow-lg z-50">
                  <FilterPopover
                    onClose={toggleShowFilters}
                    onFilterChange={onFilterChange}
                  />
                </PopoverPanel>
              </Popover>
            )}
          </>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <span className="text-blue-600 font-medium">
              {totalResults} Results
            </span>
            <button
              onClick={handleSortChange}
              className="flex items-center gap-1 px-2 py-1 text-gray-600 hover:text-gray-800 transition-colors duration-200"
            >
              <span className="text-xs">
                Sort: Name {sortOrder === "asc" ? "↑" : "↓"}
              </span>
            </button>
          </div>

          {Object.keys(filters).some(
            (key) => filters[key as keyof IFilterOptions]
          ) && (
              <span className="text-green-600 bg-green-100 px-2 py-1 rounded-sm text-xs">
                {
                  Object.keys(filters).filter(
                    (key) => filters[key as keyof IFilterOptions]
                  ).length
                }
                &nbsp; Filter
              </span>
            )}
        </div>
      </div>
    </div>
  );
};

export default SearchAndFilter;

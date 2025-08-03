import React from "react";
import type { IFilterPopoverProps, IFilterPopoverOptions } from "../types/character";
import { useState } from "react";
import { useStore } from "../store/useStore";

const FilterPopover: React.FC<IFilterPopoverProps> = ({
  onFilterChange,
  onClose,
}) => {

  const {
    filters: filtersStore,
  } = useStore();

  const [filters, setFilters] = useState<IFilterPopoverOptions>({
    character: filtersStore?.character ?? "",
    species: filtersStore?.species ?? "",
  });

  const handleFilterChange = (filter: string, value: string) => {
    setFilters((prevFilters) => {
      return {
        ...prevFilters,
        [filter]: value,
      };
    });
  };

  const handleApplyFilters = () => {
    onFilterChange(filters);
    onClose();
  };

  return (
    <>
      <div className="flex-grow">
        <div className="flex flex-col">
          <div className="p-4 space-y-4">
            <>
              <label className="block text-sm font-medium text-gray-700 mb-2 px-4">
                Characters
              </label>
              <div className="flex flex-wrap gap-2 px-4">
                {["all", "starred", "others"].map((option) => (
                  <button
                    key={option}
                    onClick={() =>
                      handleFilterChange(
                        "character",
                        option === "all" ? "" : option
                      )
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
            </>

            <>
              <label className="block text-sm font-medium text-gray-700 mb-2 px-4">
                Specie
              </label>
              <div className="flex flex-wrap gap-2 px-4">
                {["all", "human", "alien", "humanoid", "robot"].map(
                  (option) => (
                    <button
                      key={option}
                      onClick={() =>
                        handleFilterChange(
                          "species",
                          option === "all" ? "" : option
                        )
                      }
                      className={`px-3 py-1 text-sm rounded-full transition-colors rounded-lg duration-200 capitalize ${filters.species === option ||
                        (option === "all" && !filters.species)
                        ? "bg-purple-100 text-purple-700 border border-purple-300"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                      {option}
                    </button>
                  )
                )}
              </div>
            </>

            <div className="hidden lg:block p-4">
              <button
                onClick={handleApplyFilters}
                className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 text-sm font-medium"
              >
                Filter
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="block lg:hidden p-4 ">
        <button
          onClick={handleApplyFilters}
          className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 text-sm font-medium"
        >
          Filter
        </button>
      </div>
    </>
  );
};

export default FilterPopover;

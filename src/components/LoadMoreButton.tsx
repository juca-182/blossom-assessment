import React from "react";
import { ILoadMoreButtonProps } from "../types/character";



const LoadMoreButton: React.FC<ILoadMoreButtonProps> = ({ 
  loading,
  currentPage,
  handleLoadMore,
  data,
}) => {
  const hasNextPage = data?.characters?.info?.next;
  const isLoadingMore = loading && currentPage > 1;

  if (!hasNextPage) return null;

  return (
    <div className="flex justify-center mt-6 mb-5">
      <button
        onClick={handleLoadMore}
        disabled={isLoadingMore}
        className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${isLoadingMore
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-(--color-primary-600) text-white hover:bg-(--color-primary-700)"
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

export default LoadMoreButton;
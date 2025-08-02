import React from "react";
import { NavLink, useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_CHARACTER } from "../services/queries";
import { ICharacter } from "../types/character";
import { ArrowLeftIcon, HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import { getStatusColor } from "../utils/helpers";
import Comments from "../components/Comments";
import { useStore } from "../store/useStore";

const CharacterSelected: React.FC = () => {
  const { id } = useParams();
  const { toggleFavorite, isFavorite } = useStore();

  const { loading, error, data } = useQuery(GET_CHARACTER, {
    variables: { id },
  });

  if (loading) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error Loading Character
          </h2>
          <p className="text-gray-600">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!data?.character) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Character Not Found
          </h2>
          <p className="text-gray-600">
            The character you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  const character = data.character;

  return (
    <div className="flex-1 p-8">
      <NavLink
        to="/"
        className="block lg:hidden flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors duration-200"
      >
        <ArrowLeftIcon className="w-5 h-5" />
      </NavLink>

      <div className="max-w-2xl">
        {/* Character Header */}
        <div className="flex items-start gap-6 mb-8">
          <div className="relative">
            <img
              src={character.image}
              alt={character.name}
              className="w-32 h-32 rounded-full object-cover"
            />
            <button
              onClick={() => toggleFavorite(character)}
              className="absolute -bottom-2 -right-2 p-2 bg-white rounded-full shadow-md hover:scale-110 transition-transform duration-200"
            >
              {isFavorite(character.id) ? (
                <HeartSolidIcon className="w-5 h-5 text-green-500" />
              ) : (
                <HeartIcon className="w-5 h-5 text-gray-400 hover:text-red-500" />
              )}
            </button>
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {character.name}
            </h1>
          </div>
        </div>

        {/* Character Details */}
        <div className="space-y-4 mb-8">
          <div className="border-b border-gray-200 pb-3">
            <span className="text-sm font-medium text-gray-700">Specie:</span>
            <span className="ml-2 text-gray-900">{character.species}</span>
          </div>

          <div className="border-b border-gray-200 pb-3">
            <span className="text-sm font-medium text-gray-700">Status:</span>
            <span
              className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                character.status
              )}`}
            >
              {character.status}
            </span>
          </div>

          {character.type && (
            <div className="border-b border-gray-200 pb-3">
              <span className="text-sm font-medium text-gray-700">
                Occupation:
              </span>
              <span className="ml-2 text-gray-900">{character.type}</span>
            </div>
          )}
        </div>

        {/* Comments Section */}
        <Comments characterId={character.id} />
      </div>
    </div>
  );
};

export default CharacterSelected;

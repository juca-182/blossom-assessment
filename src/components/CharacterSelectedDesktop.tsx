import React from "react";
import { ICharacter } from "../types/character";
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { getStatusColor } from "../utils/helpers";
import Comments from "./Comments";

const CharacterSelectedDesktop: React.FC<{
  character: ICharacter,
  selectedCharacter: ICharacter | null,
  toggleFavorite: (character: ICharacter) => void,
  isFavorite: (characterId: string) => boolean,
}> = ({
  character,
  selectedCharacter,
  toggleFavorite,
  isFavorite
}) => {
    return (
      <div className="flex-1 p-8">
        {selectedCharacter ? (
          <div className="max-w-2xl">
            {/* Character Header */}
            <div className="flex items-start gap-6 mb-8">
              <div className="relative">
                <img
                  src={selectedCharacter.image}
                  alt={selectedCharacter.name}
                  className="w-32 h-32 rounded-full object-cover"
                />
                <button
                  onClick={() => toggleFavorite(selectedCharacter)}
                  className="absolute -bottom-2 -right-2 p-2 bg-white rounded-full shadow-md hover:scale-110 transition-transform duration-200"
                >
                  {isFavorite(selectedCharacter.id) ? (
                    <HeartSolidIcon className="w-5 h-5 text-green-500" />
                  ) : (
                    <HeartIcon className="w-5 h-5 text-gray-400 hover:text-red-500" />
                  )}
                </button>
              </div>

              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {selectedCharacter.name}
                </h1>
              </div>
            </div>

            {/* Character Details */}
            <div className="space-y-4 mb-8">
              <div className="border-b border-gray-200 pb-3">
                <span className="text-sm font-medium text-gray-700">Specie:</span>
                <span className="ml-2 text-gray-900">{selectedCharacter.species}</span>
              </div>

              <div className="border-b border-gray-200 pb-3">
                <span className="text-sm font-medium text-gray-700">Status:</span>
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedCharacter.status)}`}>
                  {selectedCharacter.status}
                </span>
              </div>

              {selectedCharacter.type && (
                <div className="border-b border-gray-200 pb-3">
                  <span className="text-sm font-medium text-gray-700">Occupation:</span>
                  <span className="ml-2 text-gray-900">{selectedCharacter.type}</span>
                </div>
              )}
            </div>

            {/* Comments Section */}
            <Comments characterId={selectedCharacter.id} />
          </div>
        ) : (
          <div className="text-center text-gray-500">
            {/* mover a oto lado */}
            <h2 className="text-xl font-semibold mb-2">Select a Character</h2>
            <p>Click on a character from the list to view their details</p>
          </div>
        )}
      </div>
    );
  };

export default CharacterSelectedDesktop;
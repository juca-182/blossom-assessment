import React from 'react';
import type { ICharacter } from '../types/character';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { getStatusColor, getGenderIcon } from '../utils/helpers';

interface CharacterCardProps {
  character: ICharacter;
  isFavorite: boolean;
  onToggleFavorite: (character: ICharacter) => void;
  onClick: (character: ICharacter) => void;
}

const CharacterCard: React.FC<CharacterCardProps> = ({
  character,
  isFavorite,
  onToggleFavorite,
  onClick,
}) => {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(character);
  };

  return (
    <div 
      className="card p-4 cursor-pointer hover:shadow-lg transition-shadow duration-200"
      onClick={() => onClick(character)}
    >
      <div className="relative">
        <img
          src={character.image}
          alt={character.name}
          className="w-full h-48 object-cover rounded-lg mb-3"
        />
        <button
          onClick={handleFavoriteClick}
          className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:scale-110 transition-transform duration-200"
        >
          {isFavorite ? (
            <HeartSolidIcon className="w-5 h-5 text-red-500" />
          ) : (
            <HeartIcon className="w-5 h-5 text-gray-400 hover:text-red-500" />
          )}
        </button>
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold text-lg text-gray-900 truncate">
          {character.name}
        </h3>
        
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <span className="text-lg">{getGenderIcon(character.gender)}</span>
            {character.species}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(character.status)}`}>
            {character.status}
          </span>
        </div>

        {character.type && (
          <p className="text-sm text-gray-500">
            Type: {character.type}
          </p>
        )}

        <div className="text-sm text-gray-500">
          <p>Location: {character.location.name}</p>
          <p>Origin: {character.origin.name}</p>
        </div>
      </div>
    </div>
  );
};

export default CharacterCard; 

import React from "react";
import { ICharacter } from "../types/character";
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { useStore } from "../store/useStore";


const Character: React.FC<{
  character: ICharacter,
  isFavorite?: boolean,
}> = ({
  character,
  isFavorite = false,
}) => {
  const { toggleFavorite, setSelectedCharacter, selectedCharacter } = useStore();
  
  const handleCharacterClick = (character: ICharacter) => {
    setSelectedCharacter(character);
  };
  
  return (
    <div
      key={character.id}
      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors duration-200 ${selectedCharacter?.id === character.id
        ? 'bg-purple-100 '
        : 'hover:bg-(--color-primary-100)'
        }`}
      onClick={() => handleCharacterClick(character)}
    >
      <img
        src={character.image}
        alt={character.name}
        className="w-12 h-12 rounded-full object-cover"
      />
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 truncate">{character.name}</h3>
        <p className="text-sm text-gray-600">{character.species}</p>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleFavorite(character);
        }}
        className="p-1 rounded-full bg-white"
      >
        {isFavorite ? (
          <HeartSolidIcon className={`w-5 h-5  text-(--color-secondary-600)`} />
        ) : (
          <HeartIcon className={`w-5 h-5 text-(--color-gray) hover:text-(--color-secondary-600)`} />
        )}
      </button>
    </div>
  );
};

export default Character;
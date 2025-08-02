import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_CHARACTER } from '../services/queries';
import { useFavorites } from '../hooks/useFavorites';
import { getStatusColor, getGenderIcon, formatDate } from '../utils/helpers';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Comments from '../components/Comments';

const CharacterDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useFavorites();

  const { loading, error, data } = useQuery(GET_CHARACTER, {
    variables: { id },
    skip: !id,
  });

  const character = data?.character;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Character</h2>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <button 
            onClick={() => navigate('/')} 
            className="btn-primary"
          >
            Back to Characters
          </button>
        </div>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Character Not Found</h2>
          <p className="text-gray-600 mb-4">The character you're looking for doesn't exist.</p>
          <button 
            onClick={() => navigate('/')} 
            className="btn-primary"
          >
            Back to Characters
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors duration-200"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Back to Characters
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Character Information */}
          <div className="space-y-6">
            {/* Character Image and Basic Info */}
            <div className="card p-6">
              <div className="flex items-start gap-6">
                <div className="relative">
                  <img
                    src={character.image}
                    alt={character.name}
                    className="w-32 h-32 rounded-lg object-cover"
                  />
                  <button
                    onClick={() => toggleFavorite(character)}
                    className="absolute -top-2 -right-2 p-2 bg-white rounded-full shadow-md hover:scale-110 transition-transform duration-200"
                  >
                    {isFavorite(character.id) ? (
                      <HeartSolidIcon className="w-5 h-5 text-red-500" />
                    ) : (
                      <HeartIcon className="w-5 h-5 text-gray-400 hover:text-red-500" />
                    )}
                  </button>
                </div>
                
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {character.name}
                  </h1>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getGenderIcon(character.gender)}</span>
                      <span className="text-gray-600">{character.species}</span>
                    </div>
                    
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(character.status)}`}>
                      {character.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Character Details */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Character Details</h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Species</label>
                    <p className="text-gray-900">{character.species}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Gender</label>
                    <p className="text-gray-900">{character.gender}</p>
                  </div>
                  
                  {character.type && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Type</label>
                      <p className="text-gray-900">{character.type}</p>
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Created</label>
                    <p className="text-gray-900">{formatDate(character.created)}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <p className="text-gray-900">{character.location.name}</p>
                  {character.location.type && (
                    <p className="text-sm text-gray-600">Type: {character.location.type}</p>
                  )}
                  {character.location.dimension && (
                    <p className="text-sm text-gray-600">Dimension: {character.location.dimension}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Origin</label>
                  <p className="text-gray-900">{character.origin.name}</p>
                  {character.origin.type && (
                    <p className="text-sm text-gray-600">Type: {character.origin.type}</p>
                  )}
                  {character.origin.dimension && (
                    <p className="text-sm text-gray-600">Dimension: {character.origin.dimension}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Episodes */}
            {character.episode && character.episode.length > 0 && (
              <div className="card p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Episodes ({character.episode.length})</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {character.episode.slice(0, 10).map((episode: any) => (
                    <div key={episode.id} className="p-2 bg-gray-50 rounded-sm">
                      <p className="font-medium text-sm">{episode.name}</p>
                      <p className="text-xs text-gray-600">{episode.episode}</p>
                    </div>
                  ))}
                  {character.episode.length > 10 && (
                    <p className="text-sm text-gray-600 col-span-full">
                      ... and {character.episode.length - 10} more episodes
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Comments Section */}
          <div className="card p-6">
            <Comments characterId={character.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterDetail; 
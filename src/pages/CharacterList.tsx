import React from 'react';
import CharacterListDesktop from '../components/CharacterListDesktop';
import CharacterListMobile from '../components/CharacterListMobile';

const CharacterList: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Layout */}
      <CharacterListMobile  />

      {/* Desktop Layout */}
      <CharacterListDesktop  />
    </div>
  );
};

export default CharacterList; 
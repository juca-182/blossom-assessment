import type { ICharacter, IFilterOptions } from '../types/character';


export const sortCharacters = (characters: ICharacter[], sortBy: string, sortOrder: 'asc' | 'desc' = 'asc') => {
  return [...characters].sort((a, b) => {
    let aValue: string;
    let bValue: string;

    switch (sortBy) {
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case 'status':
        aValue = a.status.toLowerCase();
        bValue = b.status.toLowerCase();
        break;
      case 'species':
        aValue = a.species.toLowerCase();
        bValue = b.species.toLowerCase();
        break;
      default:
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
    }

    if (sortOrder === 'asc') {
      return aValue.localeCompare(bValue);
    } else {
      return bValue.localeCompare(aValue);
    }
  });
};

export const filterCharacters = (characters: ICharacter[], filters: IFilterOptions) => {
  return characters.filter(character => {
    if (filters.name && !character.name.toLowerCase().includes(filters.name.toLowerCase())) {
      return false;
    }

    if (filters.species && character.species.toLowerCase() !== filters.species) {
      return false;
    }

    return  true;
  });
};

export const getUniqueValues = (characters: ICharacter[], field: keyof ICharacter) => {
  const values = characters.map(character => character[field]);
  return Array.from(new Set(values)).filter(Boolean).sort();
};

// Format date
export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

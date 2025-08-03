import type { ICharacter, FilterOptions } from '../types/character';

// Sort characters by name (A-Z or Z-A)
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

// Filter characters based on search criteria
export const filterCharacters = (characters: ICharacter[], filters: FilterOptions) => {
  return characters.filter(character => {
    // Filter by name
    if (filters.name && !character.name.toLowerCase().includes(filters.name.toLowerCase())) {
      return false;
    }

    // Filter by status
    // if (filters.status && character.status !== filters.status) {
    //   return false;
    // }

    // Filter by species
    if (filters.species && character.species.toLowerCase() !== filters.species) {
      return false;
    }

    // Filter by gender
    // if (filters.gender && character.gender !== filters.gender) {
    //   return false;
    // }

    return  true;
  });
};

// Get unique values for filter options
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

// Get status color for character status
export const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'alive':
      return 'text-green-600 bg-green-100';
    case 'dead':
      return 'text-red-600 bg-red-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

// Get gender icon
export const getGenderIcon = (gender: string) => {
  switch (gender.toLowerCase()) {
    case 'male':
      return '♂';
    case 'female':
      return '♀';
    default:
      return '⚧';
  }
}; 
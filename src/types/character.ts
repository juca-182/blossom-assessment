export interface ICharacter {
  id: string;
  name: string;
  status: 'Alive' | 'Dead' | 'unknown';
  species: string;
  type: string;
  gender: 'Female' | 'Male' | 'Genderless' | 'unknown';
  image: string;
  episode: string[];
  url: string;
  created: string;
  location: {
    name: string;
    url: string;
  };
  origin: {
    name: string;
    url: string;
  };
}

export interface ICharactersResponse {
  characters: {
    info: {
      count: number;
      pages: number;
      next: number | null;
      prev: number | null;
    };
    results: ICharacter[];
  };
}

export interface CharacterResponse {
  character: ICharacter;
}

export interface Comment {
  id: string;
  characterId: string;
  text: string;
  createdAt: string;
}

export interface FilterOptions {
  name?: string;
  status?: string;
  species?: string;
  gender?: string;
  sortBy?: 'name' | 'status' | 'species';
  sortOrder?: 'asc' | 'desc';
} 
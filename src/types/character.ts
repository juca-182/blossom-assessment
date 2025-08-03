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

export interface ICharacterResponse {
  character: ICharacter;
}

export interface IComment {
  id: string;
  characterId: string;
  text: string;
  createdAt: string;
}

export interface IFilterOptions {
  name?: string;
  status?: string;
  character?: string;
  species?: string;
  gender?: string;
  sortBy?: 'name' | 'status' | 'species';
  sortOrder?: 'asc' | 'desc';
} 

export interface ICharacterCardProps {
  character: ICharacter;
  isFavorite: boolean;
  onToggleFavorite: (character: ICharacter) => void;
  onClick: (character: ICharacter) => void;
}

export interface ICommentsProps {
  characterId: string;
}

export interface IFilterPopoverProps {
  onFilterChange: (filters: IFilterOptions) => void;
  onClose: () => void;
}

export interface IFilterPopoverOptions {
  character?: string;
  species?: string;
}

export interface ISearchAndFilterProps {
  onFilterChange: (filters: IFilterOptions) => void;
  onSortChange: (sortBy: string, sortOrder: "asc" | "desc") => void;
  totalResults: number;
  isMobile?: boolean;
}

export interface ILoadMoreButtonProps {
  loading: boolean;
  currentPage: number;
  handleLoadMore: () => void;
  data: any;
}
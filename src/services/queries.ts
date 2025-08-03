import { gql } from '@apollo/client';

// Query to get all characters with pagination and filtering
export const GET_CHARACTERS = gql`
  query GetCharacters($page: Int, $filter: FilterCharacter) {
    characters(page: $page, filter: $filter) {
      info {
        count
        pages
        next
        prev
      }
      results {
        id
        name
        status
        species
        type
        gender
        image
        location {
          name
        }
        origin {
          name
        }
      }
    }
  }
`;

// Query to get a single character by ID
export const GET_CHARACTER = gql`
  query GetCharacter($id: ID!) {
    character(id: $id) {
      id
      name
      status
      species
      type
      gender
      image
      episode {
        id
        name
        episode
      }
      location {
        name
        type
        dimension
      }
      origin {
        name
        type
        dimension
      }
      created
    }
  }
`;

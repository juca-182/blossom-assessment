import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

// Create the HTTP link to the Rick and Morty GraphQL API
const httpLink = createHttpLink({
  uri: 'https://rickandmortyapi.com/graphql',
});

// Create Apollo Client instance
export const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
}); 
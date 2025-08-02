import { ApolloProvider } from '@apollo/client';
import { client } from './services/apollo-client';
import { RouterProvider } from 'react-router-dom';
import routes from './AppRoutes';


function App() {
  return (
    <ApolloProvider client={client}>
      <RouterProvider router={routes} />
    </ApolloProvider>
  );
}

export default App;

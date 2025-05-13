// src/ApolloClient.js

import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

// Set up the Apollo Client to point to your Laravel GraphQL API
const client = new ApolloClient({
  uri:'https://fakestore-graphql-production.up.railway.app/graphql', // Your GraphQL endpoint
  cache: new InMemoryCache(),
});

export { client, ApolloProvider };

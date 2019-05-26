// import { ApolloClient } from "apollo-client";
import ApolloClient from "apollo-boost";
import { InMemoryCache } from "apollo-cache-inmemory";
import { persistCache } from "apollo-cache-persist";
import { SchemaLink } from "apollo-link-schema";
import { GRAPHQL_ENDPOINT } from "../config";
// const { schema } = require("./../graphql/schema");
// import gql from "graphql-tag";
// import { introspectionQuery } from "graphql";

const cache = new InMemoryCache();

persistCache({
  cache,
  storage: localStorage
});
// export const client = 1;
// export const client = new ApolloClient({
//   cache,
//   link: new SchemaLink({ schema })
// });

export const client = new ApolloClient({
  cache,
  uri: GRAPHQL_ENDPOINT
});

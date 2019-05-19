import ApolloClient from "apollo-boost";
import { GRAPHQL_ENDPOINT } from "./../config";

export const client = new ApolloClient({
  uri: GRAPHQL_ENDPOINT
});

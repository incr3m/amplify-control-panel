import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from "apollo-cache-inmemory";
import { persistCache } from "apollo-cache-persist";
import { SchemaLink } from "apollo-link-schema";
import schema from "./../graphql/schema";

const cache = new InMemoryCache();

// persistCache({
//   cache,
//   storage: localStorage
// });
console.log(">>common/apollo::", "schema", schema); //TRACE
// export const client = 1;
export const client = new ApolloClient({
  cache,
  link: new SchemaLink({ schema })
});

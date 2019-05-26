const { AwsApiParser } = require("graphql-compose-aws");
const {
  makeExecutableSchema,
  addMockFunctionsToSchema
} = require("graphql-tools");
const { GraphQLSchema, GraphQLObjectType } = require("graphql");
const { awsServices } = require("./../config");
const fromPairs = require("lodash/fromPairs");

console.log("testaws", window.AWS);
const awsApiParser = new AwsApiParser({
  awsSDK: window.AWS
});

const services = awsServices;

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "Query",
    fields: fromPairs(
      services.map(svcRaw => {
        const svc = svcRaw.toLowerCase();
        return [svc, awsApiParser.getService(svc).getFieldConfig()];
      })
    )
  })
});

// const schema = new GraphQLSchema({
//   query: new GraphQLObjectType({
//     name: "RootQueryType",
//     fields: {}
//   })
// });

module.exports = { schema };

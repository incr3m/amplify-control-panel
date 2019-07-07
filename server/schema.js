const { AwsApiParser } = require("graphql-compose-aws");
const { GraphQLSchema, GraphQLObjectType } = require("graphql");
const awsSDK = require("aws-sdk");
const fromPairs = require("lodash/fromPairs");
const { awsServices } = require("../src/config");
const awsApiParser = new AwsApiParser({
  awsSDK
});

const services = awsServices;

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "Query",
    fields: {
      ...fromPairs(
        services.map(svcRaw => {
          const svc = svcRaw.toLowerCase();
          return [svc, awsApiParser.getService(svc).getFieldConfig()];
        })
      ),
      listProfiles: require("./resolvers/ListProfiles"),
      getProjects: require("./resolvers/GetProjects")
    }
  }),
  mutation: new GraphQLObjectType({
    name: "Mutation",
    fields: {
      useProfile: require("./resolvers/UseProfile")
    }
  })
});

module.exports = { schema };

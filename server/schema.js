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
    fields: fromPairs(
      services.map(svcRaw => {
        const svc = svcRaw.toLowerCase();
        return [svc, awsApiParser.getService(svc).getFieldConfig()];
      })
    )
  })
});

module.exports = { schema };

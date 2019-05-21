import { AwsApiParser } from "graphql-compose-aws";
import { makeExecutableSchema, addMockFunctionsToSchema } from "graphql-tools";
import { GraphQLSchema, GraphQLObjectType } from "graphql";
import awsSDK from "aws-sdk";
import fromPairs from "lodash/fromPairs";

const awsApiParser = new AwsApiParser({
  awsSDK
});

const services = [
  "S3",
  // "Amplify",
  // "AppSync",
  "CognitoIdentityServiceProvider",
  "Lambda",
  "CloudFormation"
];

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "Query",
    fields: {
      ...fromPairs(
        services.map(svcRaw => {
          const svc = svcRaw.toLowerCase();
          return [svc, awsApiParser.getService(svc).getFieldConfig()];
        })
      )
    }
  })
});

// const schema = new GraphQLSchema({
//   query: new GraphQLObjectType({
//     name: "RootQueryType",
//     fields: {}
//   })
// });

export default schema;

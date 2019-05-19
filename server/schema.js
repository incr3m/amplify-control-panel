const { GraphQLSchema, GraphQLObjectType } = require("graphql");
const awsSDK = require("aws-sdk");
const { AwsApiParser } = require("graphql-compose-aws");
const { fromPairs } = require("lodash");

const awsApiParser = new AwsApiParser({
  awsSDK
});

const services = [
  "S3",
  "Amplify",
  "AppSync",
  "CognitoIdentityServiceProvider",
  "Lambda",
  "CloudFormation"
];

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "Query",
    fields: {
      // Full API
      // aws: awsApiParser.getFieldConfig()
      // Partial API with desired services
      // s3: awsApiParser.getService("s3").getFieldConfig(),
      // ec2: awsApiParser.getService("ec2").getFieldConfig()
      ...fromPairs(
        services.map(svcRaw => {
          const svc = svcRaw.toLowerCase();
          return [svc, awsApiParser.getService(svc).getFieldConfig()];
        })
      )
    }
  })
});

module.exports = schema;

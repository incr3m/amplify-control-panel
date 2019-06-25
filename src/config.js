module.exports = {
  GRAPHQL_ENDPOINT: "/graphql",
  awsServices: [
    // "S3",
    "Amplify",
    "AppSync",
    "DynamoDB",
    "CognitoIdentityServiceProvider",
    "Lambda",
    "CloudFormation"
  ]
  // to support more service, use dist-tools\browser-builder.js on https://github.com/aws/aws-sdk-js
  // guide: https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/building-sdk-for-browsers.html#building-specific-services-versions
};

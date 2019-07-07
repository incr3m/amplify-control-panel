import { gql } from "apollo-boost";

export default () => {
  return gql`
query ($StackName: String!, $NextToken: String, $Region: String!) {
  cloudformation(
    config: {
      region: $Region
    }
  ) {
    listStackResources(
      input: {
        StackName: $StackName
        NextToken: $NextToken
      }
    ) {
      NextToken
      StackResourceSummaries {
        ResourceType
        PhysicalResourceId
        LogicalResourceId
      }
    }
  }
}
`;
};

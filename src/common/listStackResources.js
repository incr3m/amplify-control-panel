import { getGlobal } from "reactn";
import { gql } from "apollo-boost";

export default () => {
  const creds = getGlobal().creds;
  console.log(">>common/listStackResources::", "creds", creds); //TRACE
  const { accessKeyId, secretAccessKey, region } = creds;

  return gql`
query ($StackName: String!, $NextToken: String) {
  cloudformation(
    config: {
      accessKeyId: "${accessKeyId}"
      secretAccessKey: "${secretAccessKey}"
      region: "${region}"
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

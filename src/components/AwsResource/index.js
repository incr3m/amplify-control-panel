import React, { useGlobal } from "reactn";
import StackResource from "../StackResource";
import AppSyncResolverResource from "../AppSyncResolverResource";

function DefaultResource({ resource, onLoad, paused }) {
  React.useEffect(() => {
    onLoad && onLoad();
  }, []);

  const {
    LogicalResourceId = "Root",
    PhysicalResourceId: stackName
  } = resource;

  const [searchMatched, setSearchMatched] = React.useState(true);
  const [search] = useGlobal("search");

  React.useEffect(() => {
    const { text } = search;
    setSearchMatched(
      LogicalResourceId.toLowerCase().indexOf(text.toLowerCase()) > -1
    );
  }, [search]);

  if (!searchMatched) return null;

  return (
    <div>
      {resource.ResourceType}:{resource.LogicalResourceId}
    </div>
  );
}

export default function AwsResource(props) {
  const { resource, resourceIndex, onLoad } = props;
  const {
    LogicalResourceId,
    PhysicalResourceId,
    ResourceType,
    __typename
  } = resource;

  let Resource;
  switch (ResourceType) {
    case "AWS::CloudFormation::Stack":
      Resource = StackResource;
      break;
    case "AWS::AppSync::Resolver":
      Resource = AppSyncResolverResource;
      break;
    default:
      Resource = DefaultResource;
  }

  const handleOnLoad = React.useCallback((opts = {}) => {
    onLoad && onLoad({ ...opts, resourceIndex });
  }, []);

  return <Resource {...props} onLoad={handleOnLoad} />;
}

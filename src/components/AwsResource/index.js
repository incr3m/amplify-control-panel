import React, { useGlobal } from "reactn";
import StackResource from "../StackResource";
import AppSyncResolverResource from "../AppSyncResolverResource";
import DynamoDBTableResource from "../DynamoDBTableResource";

function DefaultResource({ resource, onLoad, paused }) {
  React.useEffect(() => {
    onLoad && onLoad();
  }, []);

  const {
    LogicalResourceId = "Root",
    PhysicalResourceId: stackName
  } = resource;

  return (
    <div>
      {resource.ResourceType}:{resource.LogicalResourceId}
    </div>
  );
}

export default React.memo(function(props) {
  const { resource, resourceIndex, onLoad } = props;
  const {
    LogicalResourceId,
    PhysicalResourceId,
    ResourceType,
    __typename
  } = resource;

  const [searchMatched, setSearchMatched] = React.useState(true);
  const [search] = useGlobal("search");
  const [typeFilter] = useGlobal("typeFilter");

  React.useEffect(() => {
    const { text } = search;
    if (text.length < 1 && !searchMatched) {
      setSearchMatched(true);
      return;
    }
    setSearchMatched(
      LogicalResourceId.toLowerCase().includes(text.toLowerCase()) ||
        PhysicalResourceId.toLowerCase().includes(text.toLowerCase())
    );
  }, [search, searchMatched]);

  const handleOnLoad = React.useCallback((opts = {}) => {
    onLoad && onLoad({ ...opts, resourceIndex });
  }, []);

  let Resource,
    searchable = true;
  switch (ResourceType) {
    case "AWS::CloudFormation::Stack":
      Resource = StackResource;
      searchable = false;
      break;
    case "AWS::AppSync::Resolver":
      Resource = AppSyncResolverResource;
      break;
    case "AWS::DynamoDB::Table":
      Resource = DynamoDBTableResource;
      break;
    default:
      Resource = DefaultResource;
  }

  if (!searchMatched && searchable) return null;
  if (typeFilter && searchable && typeFilter !== ResourceType) return null;

  return <Resource {...props} onLoad={handleOnLoad} />;
});

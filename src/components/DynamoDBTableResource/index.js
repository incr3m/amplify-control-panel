import React from "react";

export default function DynamoDBTableResource(props) {
  const { onLoad } = props;
  React.useEffect(() => {
    onLoad && onLoad();
  }, []);
  // const { arn } = props;
  // const [, apiId, , typeName, , fieldName] = arn.split("/");
  return <div>{JSON.stringify(props)}</div>;
}

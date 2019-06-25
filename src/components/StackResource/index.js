import React, { useGlobal, getGlobal } from "reactn";
import listStackResources from "../../common/listStackResources";
import Paper from "@material-ui/core/Paper";
import Promise from "bluebird";
import Divider from "@material-ui/core/Divider";
import { withStyles } from "@material-ui/core/styles";
import { useQuery, useApolloClient } from "react-apollo-hooks";
import AwsResource from "../AwsResource";
import get from "lodash/get";
import set from "lodash/fp/set";
import range from "lodash/range";
import useTaskThrottler from "../../hooks/useTaskThrottler";

const styles = {
  info: { paddingTop: 10, paddingBottom: 10 }
};

function Fetcher({ onResult, stackName, nextToken }) {
  const client = useApolloClient();
  const task = React.useMemo(() => {
    return client.query({
      query: listStackResources(),
      variables: {
        StackName: stackName,
        NextToken: nextToken
      }
    });
    // return Promise.resolve({ data: {} });
  }, [stackName, nextToken]);

  const { result, waiting: loading, called, rerun: refetch } = useTaskThrottler(
    {
      task
    }
  );
  React.useEffect(() => {
    if (result) {
      const { data } = result || {};
      onResult && onResult(data);
    }
  }, [result]);

  return null;
}

export default withStyles(styles)(function StackResource({
  classes,
  resource,
  onLoad
}) {
  const {
    LogicalResourceId = "Root",
    PhysicalResourceId: stackName
  } = resource;
  const [state, setState] = React.useState({
    // nextToken: null,
    stackName,
    //stackName: "incentiveemployment-20190415075708-apiIncentiveEmployment-198U880ZN9V67",
    resources: [],
    resourceStatus: {}
  });

  const [searchMatched, setSearchMatched] = React.useState(true);
  const [search] = useGlobal("search");
  const [, setResourceMap] = useGlobal("resourceMap");

  React.useEffect(() => {
    const newResourceMap = { ...getGlobal().resourceMap };
    state.resources.forEach(r => {
      newResourceMap[r.PhysicalResourceId] = r;
    });
    setResourceMap(newResourceMap);
  }, [state.resources]);

  React.useEffect(() => {
    const { text } = search;
    setSearchMatched(
      LogicalResourceId.toLowerCase().includes(text.toLowerCase()) ||
        stackName.toLowerCase().includes(text.toLowerCase())
    );
  }, [search]);

  React.useEffect(() => {
    let allLoaded = true;

    state.resources.some((rsc, ii) => {
      if (!state.resourceStatus[ii]) {
        allLoaded = false;
        return true;
      }
    });
    if (state.resources.length > 0 && allLoaded) onLoad && onLoad();
  }, [state.resources, state.resourceStatus]);

  const onResult = React.useCallback(data => {
    const NextToken = get(data, "cloudformation.listStackResources.NextToken");
    console.log(">>StackResource/index::", "NextToken", NextToken); //TRACE
    const resources = get(
      data,
      "cloudformation.listStackResources.StackResourceSummaries",
      []
    );
    setState(oldState => ({ ...oldState, resources }));
  }, []);

  return (
    <>
      <Fetcher
        onResult={onResult}
        stackName={state.stackName}
        nextToken={state.nextToken}
      />
      {searchMatched && (
        <Paper className={classes.info}>
          name: {LogicalResourceId}
          <Divider />
          resources: {state.resources.length}
        </Paper>
      )}
      {state.resources.map((rsc, ii) => {
        return <AwsResource key={ii} resourceIndex={ii} resource={rsc} />;
      })}
    </>
  );
});

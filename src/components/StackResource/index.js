import React, { useGlobal } from "reactn";
import listStackResources from "../../common/listStackResources";
import Paper from "@material-ui/core/Paper";
import Divider from "@material-ui/core/Divider";
import { withStyles } from "@material-ui/core/styles";
import { useQuery } from "react-apollo-hooks";
import AwsResource from "../AwsResource";
import get from "lodash/get";
import set from "lodash/fp/set";
import range from "lodash/range";

const styles = {
  info: { paddingTop: 10, paddingBottom: 10 }
};

export default withStyles(styles)(function StackResource({
  classes,
  resource,
  onLoad,
  paused
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
  React.useEffect(() => {
    const { text } = search;
    setSearchMatched(
      LogicalResourceId.toLowerCase().indexOf(text.toLowerCase()) > -1
    );
  }, [search]);

  const { data, loading, fetchMore, refetch } = useQuery(listStackResources(), {
    variables: {
      StackName: state.stackName,
      NextToken: state.nextToken
    },
    skip: paused
  });

  React.useEffect(() => {
    const NextToken = get(data, "cloudformation.listStackResources.NextToken");
    console.log(">>StackResource/index::", "NextToken", NextToken); //TRACE
    const resources = get(
      data,
      "cloudformation.listStackResources.StackResourceSummaries",
      []
    );
    setState(oldState => ({ ...oldState, resources }));
  }, [data]);

  const handleOnLoad = React.useCallback(opts => {
    const { resourceIndex } = opts;
    // setState(oldState => ({ ...oldState, [resourceIndex]: true }));
    setState(oldState => {
      const x = set(`resourceStatus.${resourceIndex}`, true)(oldState);
      return x;
    });
  }, []);

  const currentLoadIndex = React.useMemo(() => {
    const curIndex = range(state.resources.length).findIndex(index => {
      return state.resourceStatus[index] !== true;
    });
    return curIndex > 0 ? curIndex : 0;
  }, [state.resourceStatus, state.resources]);

  React.useEffect(() => {
    console.log(
      ">>StackResource/index::",
      "xxx1",
      state.resources,
      state.resourceStatus
    ); //TRACE
    let allLoaded = true;

    state.resources.some((rsc, ii) => {
      if (!state.resourceStatus[ii]) {
        allLoaded = false;
        return true;
      }
    });
    console.log(">>StackResource/index::", "xxx22allLoaded", allLoaded); //TRACE
    if (state.resources.length > 0 && allLoaded) onLoad && onLoad();
  }, [state.resources, state.resourceStatus]);

  return (
    <>
      {searchMatched && (
        <Paper className={classes.info}>
          name: {LogicalResourceId}
          <Divider />
          resources: {state.resources.length}
        </Paper>
      )}
      {state.resources.map((rsc, ii) => {
        return (
          <AwsResource
            key={ii}
            resourceIndex={ii}
            resource={rsc}
            onLoad={handleOnLoad}
            paused={ii > currentLoadIndex}
          />
        );
      })}
    </>
  );
});

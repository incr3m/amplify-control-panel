import React, { setGlobal, useGlobal, getGlobal } from "reactn";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import listStackResources from "./../../common/listStackResources";
import { useApolloClient } from "@apollo/react-hooks";

import merge from "lodash/fp/merge";
import get from "lodash/get";
import debounce from "lodash/debounce";
import Divider from "@material-ui/core/Divider";
import StackResources from "./../../components/StackResource";
import { WorkspaceContext } from "../../contexts/Workspace";
import { useTaskPollerActions } from "../../hooks/useTaskThrottler";
import ResourceTypes from "./ResourceTypes";
import SearchBox from "./SearchBox";

setGlobal({
  search: {
    text: ""
  },
  typeFilter: "",
  resourceMap: {},
  disabled: false,
  initial: "values"
});

function RootStack(props) {
  const { projectState, currentProfile, env, currentRegion } = React.useContext(
    WorkspaceContext
  );

  const { clear } = useTaskPollerActions();

  React.useEffect(() => {
    clear();
    setGlobal({ resourceMap: {} });
  }, []);

  const StackId = get(
    projectState,
    `selectedProject.envs.${env}.awscloudformation.StackId`
  );
  const Region = currentRegion;
  console.log(">>home/index::", "Root Region", Region); //TRACE
  const client = useApolloClient();

  const onResetCache = React.useCallback(async () => {
    await client.cache.reset();
  }, []);

  if (!currentProfile || !StackId) return "loading...";
  return (
    <div>
      <div style={{ margin: 20 }}>
        <div style={{ marginBottom: 20 }}>
          <Divider />
          <div style={{ float: "right" }}>
            <SearchBox />
          </div>
          <Divider style={{ clear: "both" }} />
        </div>
        {/* <TextField
          label="Search"
          style={{ width: 200 }}
          onChange={handleSearchText}
        /> */}
        {/* <Button variant="contained" onClick={onResetCache}>
          Reset Cache{" "}
        </Button> */}
        <StackResources resource={{ PhysicalResourceId: StackId }} />
      </div>
    </div>
  );
}

export default function Home() {
  const { projectState } = React.useContext(WorkspaceContext);
  return (
    <div>
      <ResourceTypes />
      <RootStack key={get(projectState, "selectedProject.name", "no-name")} />
    </div>
  );
}

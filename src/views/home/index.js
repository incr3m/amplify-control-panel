import React, { setGlobal, useGlobal, getGlobal } from "reactn";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import listStackResources from "./../../common/listStackResources";
import { useApolloClient } from "@apollo/react-hooks";

import merge from "lodash/fp/merge";
import get from "lodash/get";
import debounce from "lodash/debounce";
import StackResources from "./../../components/StackResource";
import useWorkspace from "../../hooks/useWorkspace";

setGlobal({
  search: {
    text: ""
  },
  selectedProject: localStorage.getItem("selectedProject"),
  rootStackName: localStorage.getItem("rootStackName"),
  resourceMap: {},
  disabled: false,
  initial: "values",
  x: 1
});

function RootStack(props) {
  const [resourceMap, setResourceMap] = useGlobal("resourceMap");
  const [search, setSearch] = useGlobal("search");
  const { projectState, currentProfile, env } = useWorkspace();
  const StackId = get(
    projectState,
    `selectedProject.envs.${env}.awscloudformation.StackId`
  );
  const Region = get(
    projectState,
    `selectedProject.envs.${env}.awscloudformation.Region`
  );
  console.log(">>home/index::", "Root Region", Region); //TRACE
  const client = useApolloClient();

  const onResetCache = React.useCallback(async () => {
    await client.cache.reset();
  }, []);

  const updateSearchText = debounce(txt => {
    setSearch({ text: txt });
  }, 250);
  const handleSearchText = React.useCallback(e => {
    const { value } = e.target;
    updateSearchText(value);
  }, []);
  if (!currentProfile || !StackId) return "loading...";
  return (
    <div>
      <div style={{ margin: 20 }}>
        <TextField
          label="Search"
          style={{ width: 200 }}
          onChange={handleSearchText}
        />
        <Button variant="contained" onClick={onResetCache}>
          Reset Cache{" "}
        </Button>
        <StackResources resource={{ PhysicalResourceId: StackId }} />
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div>
      <RootStack />
    </div>
  );
}

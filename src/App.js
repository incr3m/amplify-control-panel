import React, { setGlobal, useGlobal, getGlobal } from "reactn";
import logo from "./logo.svg";
import "./App.css";
import CredInput from "./components/CredInput";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import { useQuery, useApolloClient } from "react-apollo-hooks";
import listStackResources from "./common/listStackResources";

import merge from "lodash/fp/merge";
import get from "lodash/get";
import debounce from "lodash/debounce";
import StackResources from "./components/StackResource";
import { TaskPoller } from "./hooks/useTaskThrottler";

setGlobal({
  creds: {
    accessKeyId: localStorage.getItem("accessKeyId"),
    secretAccessKey: localStorage.getItem("secretAccessKey"),
    region: localStorage.getItem("region")
  },
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
  const [rootStack, setRootStack] = useGlobal("rootStackName");
  const [resourceMap, setResourceMap] = useGlobal("resourceMap");
  const [search, setSearch] = useGlobal("search");
  // const [creds] = useGlobal("creds");

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
  return (
    <div>
      <TextField
        label="Root Stack"
        style={{ width: 200 }}
        value={rootStack || ""}
        onChange={e => {
          const { value } = e.target;
          localStorage.setItem("rootStackName", value);
          setRootStack(value);
        }}
      />
      <div style={{ margin: 20 }}>
        <TextField
          label="Search"
          style={{ width: 200 }}
          onChange={handleSearchText}
        />
        <Button variant="contained" onClick={onResetCache}>
          Reset Cache{" "}
        </Button>
        <StackResources resource={{ PhysicalResourceId: rootStack }} />
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <TaskPoller />
      <CredInput />
      <RootStack />
    </div>
  );
}

export default App;

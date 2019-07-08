import React, { setGlobal, useGlobal, getGlobal } from "reactn";
import logo from "./logo.svg";
import "./App.css";
import CredInput from "./components/CredInput";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import { useQuery, useApolloClient } from "react-apollo-hooks";
import listStackResources from "./common/listStackResources";
import Basket from "./Basket";
import HomeIcon from "@material-ui/icons/Home";
import SettingslIcon from "@material-ui/icons/Settings";
import SettingsPage from "./views/settings";

import merge from "lodash/fp/merge";
import get from "lodash/get";
import debounce from "lodash/debounce";
import StackResources from "./components/StackResource";
import { TaskPoller } from "./hooks/useTaskThrottler";
import Home from "./views/home";
import ProjectSelector from "./components/ProjectSelector";
import EnvSelector from "./components/EnvSelector";
import { WorkspaceProvider } from "./contexts/Workspace";

function App() {
  const headerControls = React.useMemo(() => {
    return [<ProjectSelector />, <EnvSelector />];
  }, []);
  return (
    <div className="App">
      <TaskPoller />
      <WorkspaceProvider>
        <Basket
          title={"Amplify"}
          headerControls={headerControls}
          tabs={[
            {
              icon: HomeIcon,
              path: "/",
              label: "Dashboard",
              content: Home
            },
            {
              icon: SettingslIcon,
              path: "/settings",
              label: "Settings",
              content: SettingsPage
            }
          ]}
        />
      </WorkspaceProvider>
    </div>
  );
}

export default App;

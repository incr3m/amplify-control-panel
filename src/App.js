import React, { setGlobal, useGlobal, getGlobal } from "reactn";
import logo from "./logo.svg";
import "./App.css";
import CredInput from "./components/CredInput";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import { useQuery, useApolloClient } from "react-apollo-hooks";
import listStackResources from "./common/listStackResources";

import merge from "lodash/fp/merge";
import get from "lodash/get";

setGlobal({
  creds: {
    accessKeyId: localStorage.getItem("accessKeyId"),
    secretAccessKey: localStorage.getItem("secretAccessKey"),
    region: localStorage.getItem("region")
  },
  selectedProject: localStorage.getItem("selectedProject"),
  rootStackName: null,
  resourceMap: {},
  projects: {
    ie: {
      name: "Incentive Employment",
      stackName: "incentiveemployment-uat-20190518192214"
    }
  },
  disabled: false,
  initial: "values",
  x: 1
});

function RootStack(props) {
  const [rootStack, setRootStack] = useGlobal("rootStack");
  const [selectedProject, setSelectedProject] = useGlobal("selectedProject");
  const [resourceMap, setResourceMap] = useGlobal("resourceMap");
  const [projects] = useGlobal("projects");
  const [creds] = useGlobal("creds");
  const { accessKeyId, secretAccessKey, region } = creds;

  React.useEffect(() => {
    localStorage.setItem("selectedProject", selectedProject);
    const stackName = get(projects, [selectedProject, "stackName"]);
    console.log(">>src/App::", "stackName", stackName); //TRACE
    if (stackName) setRootStack(projects[selectedProject].stackName);
  }, [selectedProject]);

  // const { data, loading } = useQuery(listStackResources(), {
  //   variables: {
  //     StackName: rootStack
  //   }
  // });
  // console.log(">>src/App::", "data", data); //TRACE
  const client = useApolloClient();
  console.log(">>src/App::", "resourceMap", resourceMap); //TRACE
  React.useEffect(() => {
    let unmounted = false;
    if (!rootStack) return;
    console.log(">>src/App::", "rootStack", rootStack); //TRACE

    async function fetchResource(StackName) {
      let NextToken;
      do {
        const ret = await client.query({
          query: listStackResources(),
          variables: {
            StackName,
            NextToken
          }
        });
        NextToken = get(
          ret,
          "data.cloudformation.listStackResources.NextToken"
        );
        console.log(">>src/App::", "NextToken", NextToken); //TRACE
        console.log(">>src/App::", "ret", ret); //TRACE
        const resources = get(
          ret,
          "data.cloudformation.listStackResources.StackResourceSummaries"
        );

        const rscMap = {};
        resources.forEach(rsc => {
          if (rsc.ResourceType === "AWS::CloudFormation::Stack") {
            //dive to child stack
            // ("arn:aws:cloudformation:ap-southeast-2:265681005590:stack/incentiveemployment-uat-20190518192214-functionEmail-K8RIRUXQKJIF/72b77660-7963-11e9-9eb3-068b7cc31228");
            const stackIdSplit = rsc.PhysicalResourceId.split("/");
            const [, stackName] = stackIdSplit;
            console.log(">>src/App::", "stackIdSplit", stackIdSplit); //TRACE
            fetchResource(stackName);
            return;
          }
          rscMap[rsc.LogicalResourceId] = rsc;
        });

        if (unmounted) return;

        setResourceMap(merge(rscMap)(getGlobal().resourceMap));
        console.log(">>src/App::", "resources", resources); //TRACE
      } while (NextToken !== null);
    }
    fetchResource(rootStack);
    return () => {
      unmounted = true;
    };
  }, [rootStack]);

  return (
    <div>
      <TextField
        label="Project"
        select
        style={{ width: 200 }}
        value={selectedProject || ""}
        onChange={e => {
          setSelectedProject(e.target.value);
        }}
      >
        {Object.entries(projects).map(e => {
          const [key, project] = e;
          const { name } = project;
          return (
            <MenuItem key={key} value={key}>
              {name}
            </MenuItem>
          );
        })}
      </TextField>
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <CredInput />
      <RootStack />
    </div>
  );
}

export default App;

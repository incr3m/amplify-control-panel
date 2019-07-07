import React, { createProvider, useGlobal, setGlobal } from "reactn";
// import { useQuery } from "@apollo/react-hooks";
import { useQuery } from "react-apollo-hooks";
import get from "lodash/get";
import gql from "graphql-tag";
import keyBy from "lodash/keyBy";
import useSettings from "./useSettings";

const projectDataQuery = gql`
  query($paths: [String]) {
    getProjects(projectPaths: $paths)
  }
`;

const SELECTED_PROJECT_NAME = "selectedProjectName";

setGlobal({
  selectedProject: JSON.parse(localStorage.getItem(SELECTED_PROJECT_NAME))
});

export default function useProjectSelector() {
  const [selectedProject, setSelectedProject] = useGlobal("selectedProject");

  const [{ projects }, setState] = React.useState({ projects: {} });

  const { projectPaths } = useSettings();

  // const projectName = selectedProject || get(projectPaths, "0");
  const { data } = useQuery(projectDataQuery, {
    variables: {
      paths: projectPaths
    },
    fetchPolicy: "network-only"
  });
  console.log(
    ">>ProjectSelector/useProjectSelector::",
    "selectedProject",
    selectedProject
  ); //TRACE
  React.useEffect(() => {
    const projKeys = Object.keys(projects);
    if (projKeys.length > 0 && !selectedProject) {
      setSelectedProject(projKeys[0]);
    }
  }, [projects, selectedProject]);

  React.useEffect(() => {
    if (data) {
      const projects = {};
      get(data, "getProjects", []).forEach(pStr => {
        const proj = JSON.parse(pStr);
        if (proj && proj.name) {
          projects[proj.name] = proj;
        }
      });
      setState(oldState => ({
        ...oldState,
        projects
      }));
    }
  }, [data]);

  console.log(">>ProjectSelector/useProjectSelector::", "projects", projects); //TRACE

  return {
    projects,
    selectedProject: projects[selectedProject],
    selectedProjectName: selectedProject,
    setSelectedProjectName: setSelectedProject
  };
}

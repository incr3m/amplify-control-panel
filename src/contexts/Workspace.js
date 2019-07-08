import React from "react";
import get from "lodash/get";
import gql from "graphql-tag";
import useProjectSelector from "../hooks/useProjectSelector";
import { useApolloClient } from "@apollo/react-hooks";
import { useTaskPollerActions } from "../hooks/useTaskThrottler";

export const WorkspaceContext = React.createContext();

export function WorkspaceProvider(props) {
  const [state, setState] = React.useState({
    env: "dev",
    currentProfile: null
  });

  const projectState = useProjectSelector();

  const client = useApolloClient();

  React.useEffect(() => {
    const { selectedProject } = projectState;
    if (selectedProject) {
      (async () => {
        const profile = get(selectedProject, ["profiles", state.env]);
        const { profileName } = profile || {};
        if (profileName) {
          await client.mutate({
            mutation: gql`
              mutation($profileName: String!) {
                useProfile(name: $profileName)
              }
            `,
            variables: {
              profileName
            }
          });
        }
        setState(oldState => ({ ...oldState, currentProfile: profile }));
      })();
    }
  }, [state.env, projectState.selectedProject]);

  const currentRegion = React.useMemo(() => {
    return get(
      projectState,
      `selectedProject.envs.${state.env}.awscloudformation.Region`
    );
  }, [projectState, state.env]);

  const creds = React.useMemo(() => {
    return {
      region: currentRegion
    };
  }, [currentRegion]);

  const value = {
    creds,
    projectState,
    currentRegion,
    ...state,
    setEnv(env) {
      setState(oldState => ({ ...oldState, env }));
    }
  };

  return (
    <WorkspaceContext.Provider value={value}>
      {props.children}
    </WorkspaceContext.Provider>
  );
}

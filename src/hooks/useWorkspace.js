import React, { createProvider } from "reactn";
// import { useQuery } from "@apollo/react-hooks";
import { useApolloClient } from "@apollo/react-hooks";
import get from "lodash/get";
import gql from "graphql-tag";
import keyBy from "lodash/keyBy";
import useProjectSelector from "./useProjectSelector";

export default function useWorkspace() {
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

  return {
    projectState,
    ...state,
    setEnv(env) {
      setState(oldState => ({ ...oldState, env }));
    }
  };
}

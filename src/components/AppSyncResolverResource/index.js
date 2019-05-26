import React, { useGlobal } from "reactn";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import gql from "graphql-tag";
import { useQuery, useApolloClient } from "react-apollo-hooks";
import get from "lodash/get";
import Editor from "react-simple-code-editor";

const saveQuery = gql`
  query($config: AwsConfig!, $input: AwsAppSyncUpdateResolverInput!) {
    appsync(config: $config) {
      updateResolver(input: $input) {
        resolver {
          typeName
          fieldName
          requestMappingTemplate
          responseMappingTemplate
        }
      }
    }
  }
`;

const resolverQuery = gql`
  query($config: AwsConfig!, $input: AwsAppSyncGetResolverInput!) {
    appsync(config: $config) {
      getResolver(input: $input) {
        resolver {
          typeName
          fieldName
          dataSourceName
          requestMappingTemplate
          responseMappingTemplate
        }
      }
    }
  }
`;

function ResolverDetails(props) {
  const { arn } = props;
  const [, apiId, , typeName, , fieldName] = arn.split("/");
  const [creds] = useGlobal("creds");
  const [state, setState] = React.useState({
    mode: "requestMappingTemplate",
    requestMappingTemplate: "",
    responseMappingTemplate: "",
    dataSourceName: null
  });

  const { data, loading, refetch } = useQuery(resolverQuery, {
    variables: {
      config: creds,
      input: {
        apiId,
        typeName,
        fieldName
      }
    },
    fetchPolicy: "network-only"
  });
  console.log(">>AppSyncResolverResource/index::", "loading", loading); //TRACE
  const client = useApolloClient();

  function init() {
    const {
      dataSourceName,
      requestMappingTemplate,
      responseMappingTemplate
    } = get(data, "appsync.getResolver.resolver", {});
    setState(oldState => ({
      ...oldState,
      dataSourceName,
      requestMappingTemplate,
      responseMappingTemplate
    }));
  }

  React.useEffect(() => {
    init();
  }, [data]);

  const save = React.useCallback(async () => {
    const {
      dataSourceName,
      requestMappingTemplate,
      responseMappingTemplate
    } = state;
    await client.query({
      query: saveQuery,
      variables: {
        config: creds,
        input: {
          apiId,
          typeName,
          fieldName,
          dataSourceName,
          requestMappingTemplate,
          responseMappingTemplate
        }
      }
    });
    refetch();
  }, [creds, state, arn]);

  const { mode } = state;
  return (
    <div style={{ textAlign: "left" }}>
      <div style={{ padding: 10 }}>
        <div style={{ float: "right" }}>
          <Button variant="contained" onClick={save}>
            SAVE
          </Button>
          <Button
            variant="contained"
            onClick={async () => {
              await refetch();
              init();
            }}
          >
            RESET
          </Button>
        </div>
        <div>
          <Button
            color={mode === "requestMappingTemplate" ? "primary" : "default"}
            variant="contained"
            onClick={() =>
              setState(oldState => ({
                ...oldState,
                mode: "requestMappingTemplate"
              }))
            }
          >
            REQUEST
          </Button>
          <Button
            color={mode === "responseMappingTemplate" ? "primary" : "default"}
            variant="contained"
            onClick={() =>
              setState(oldState => ({
                ...oldState,
                mode: "responseMappingTemplate"
              }))
            }
          >
            RESPONSE
          </Button>
        </div>
      </div>
      <Editor
        value={state[mode]}
        onValueChange={code =>
          setState(oldState => ({ ...oldState, [mode]: code }))
        }
        highlight={code => <div>{code}</div>}
        padding={10}
        style={{
          fontFamily: '"Fira code", "Fira Mono", monospace',
          fontSize: 12
        }}
      />
    </div>
  );
}

export default function AppSyncResolverResource({ resource, onLoad }) {
  const [{ expanded }, setState] = React.useState({ expanded: false });

  React.useEffect(() => {
    onLoad && onLoad();
  }, []);

  const { LogicalResourceId, PhysicalResourceId = "" } = resource;

  return (
    <Paper>
      <div>
        {LogicalResourceId}
        <Button
          onClick={() =>
            setState(oldState => ({ ...oldState, expanded: !expanded }))
          }
        >
          {expanded ? "-" : "+"}
        </Button>
      </div>
      {expanded && <ResolverDetails arn={PhysicalResourceId} />}
    </Paper>
  );
}

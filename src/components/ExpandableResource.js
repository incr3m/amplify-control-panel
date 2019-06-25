import React from "react";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";

export default function ExpandableResource({ name, type, details }) {
  const [{ expanded }, setState] = React.useState({ expanded: false });

  return (
    <Paper>
      <div>
        {name}
        <Button
          onClick={() =>
            setState(oldState => ({ ...oldState, expanded: !expanded }))
          }
        >
          {expanded ? "-" : "+"}
        </Button>
      </div>
      {expanded && details}
    </Paper>
  );
}

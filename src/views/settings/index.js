import React from "reactn";
import TextField from "@material-ui/core/TextField";
import useSettings from "../../hooks/useSettings";

const newLine = `
`;

//C:\Users\jim\dev\mb\count-me-in\package.json

export default function Settings() {
  const { setProjectPaths, projectPaths } = useSettings();

  const onChange = React.useCallback(
    e => {
      const text = e.target.value;
      const paths = text.split(newLine);
      console.log(">>settings/index::", "e", text.split(newLine)); //TRACE
      setProjectPaths(paths.filter(f => f));
    },
    [setProjectPaths]
  );

  return (
    <div>
      <TextField
        id="outlined-dense-multiline"
        label="Projects"
        onChange={onChange}
        defaultValue={projectPaths ? projectPaths.join(newLine) : newLine}
        margin="dense"
        variant="outlined"
        multiline
        fullWidth
        helperText="Drop package.json file here"
      />
    </div>
  );
}

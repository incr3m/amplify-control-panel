import React from "react";
import { WorkspaceContext } from "../../contexts/Workspace";

export default function EnvSelector() {
  const { projectState } = React.useContext(WorkspaceContext);
  console.log(">>EnvSelector/index::", "selectedProject", projectState); //TRACE
  return null;
}

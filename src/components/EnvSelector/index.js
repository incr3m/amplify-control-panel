import React from "react";
import useWorkspace from "../../hooks/useWorkspace";

export default function EnvSelector() {
  const { projectState } = useWorkspace();
  console.log(">>EnvSelector/index::", "selectedProject", projectState); //TRACE
  return null;
}

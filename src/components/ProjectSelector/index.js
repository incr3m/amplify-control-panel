import React, { createProvider } from "reactn";
import Select from "react-select";
import useProjectSelector from "./../../hooks/useProjectSelector";

export default function ProjectSelector() {
  const {
    projects,
    selectedProjectName,
    setSelectedProjectName
  } = useProjectSelector();

  const opts = React.useMemo(() => {
    return Object.values(projects).map(p => {
      return { value: p.name, label: p.name };
    });
  }, [projects]);

  const onSelect = React.useCallback(opt => {
    setSelectedProjectName(opt.value);
  }, []);
  const val = React.useMemo(
    () => ({ value: selectedProjectName, label: selectedProjectName }),
    [selectedProjectName]
  );
  return (
    <div style={{ minWidth: 200, display: "inline-block", marginLeft: 10 }}>
      <Select options={opts} value={val} onChange={onSelect} />
    </div>
  );
}

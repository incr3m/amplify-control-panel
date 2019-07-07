import React, { createProvider } from "reactn";

const LS_PROJECT_PATH_KEY = "projectPaths";

const SettingsProvider = createProvider({
  projectPath: JSON.parse(localStorage.getItem(LS_PROJECT_PATH_KEY) || "[]")
});

export default function useSettings() {
  const [projectPaths, _setProjectPaths] = SettingsProvider.useGlobal(
    "projectPath"
  );

  const setProjectPaths = React.useCallback(projectPaths => {
    _setProjectPaths(projectPaths);
    localStorage.setItem(
      LS_PROJECT_PATH_KEY,
      JSON.stringify(projectPaths || [])
    );
  }, []);

  return { setProjectPaths, projectPaths };
}

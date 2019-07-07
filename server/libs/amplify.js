const shell = require("shelljs");
const Promise = require("bluebird");
const path = require("path");

const teamProviderInfoPath = "amplify\\team-provider-info.json";

function getEnvProfiles() {
  const envProfiles = shell
    .cat("amplify\\.config\\local-aws-info.json")
    .toString();
  return JSON.parse(envProfiles);
}
function getEnvs() {
  const team = shell.cat(teamProviderInfoPath).toString();
  return JSON.parse(team);
}

function getPkgJsonInfo() {
  const pkgRaw = shell.cat("package.json").toString();
  const { name, version } = JSON.parse(pkgRaw || {});
  return { name, version };
}

async function getProjectMetaData(projPath) {
  const projectDir = path.dirname(projPath);
  console.log(">>libs/amplify::", "projectDir", projectDir); //TRACE
  if (!projectDir) throw new Error("Invalid Project Dir! " + projectDir);
  shell.cd(projectDir);
  // var version = shell.exec("amplify env list --json", { silent: true }).stdout;
  // console.log(">>libs/amplify::", "version", version); //TRACE

  return {
    ...getPkgJsonInfo(),
    envs: getEnvs(),
    profiles: getEnvProfiles()
  };
}

module.exports = {
  getProjectMetaData
};

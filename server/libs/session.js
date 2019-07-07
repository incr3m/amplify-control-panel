const os = require("os");
const fs = require("fs");
const path = require("path");
const aws = require("aws-sdk");

const awsCredsPath = path.join(os.homedir(), ".aws", "credentials");
let selectedProfile = "mb-jim";

function setSelectedProfile(name) {
  selectedProfile = name;
  var credentials = new aws.SharedIniFileCredentials({
    profile: selectedProfile
  });
  aws.config.credentials = credentials;
}

function getProfileList() {
  const str = fs.readFileSync(awsCredsPath, "utf8");
  const profiles = str
    .match(/\[[^[]+\]|\[.+?\]([^[])+\]/g)
    .map(s => s.replace(/[\[\]']+/g, ""));
  return profiles;
}

module.exports = {
  getProfileList,
  setSelectedProfile
};

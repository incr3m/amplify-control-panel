import React, { useGlobal } from "reactn";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import set from "lodash/fp/set";

const REGIONS = {
  "us-east-1": "US East (N. Virginia)",
  "us-east-2": "US East (Ohio)",
  "us-west-1": "US West (N. California)",
  "us-west-2": "US West (Oregon)",
  "ca-central-1": "Canada (Central)",
  "eu-west-1": "EU (Ireland)",
  "eu-central-1": "EU (Frankfurt)",
  "eu-west-2": "EU (London)",
  "eu-west-3": "EU (Paris)",
  "eu-north-1": "EU (Stockholm)",
  "ap-northeast-1": "Asia Pacific (Tokyo)",
  "ap-northeast-2": "Asia Pacific (Seoul)",
  "ap-southeast-1": "Asia Pacific (Singapore)",
  "ap-southeast-2": "Asia Pacific (Sydney)",
  "ap-south-1": "Asia Pacific (Mumbai)",
  "sa-east-1": "South America (São Paulo)",
  "us-gov-west-1": "US Gov West 1",
  "us-gov-east-1": "US Gov East 1"
};

export default function CredInput(props) {
  const [creds, setCreds] = useGlobal("creds");

  React.useEffect(() => {
    const { accessKeyId, secretAccessKey, region } = creds;
    localStorage.setItem("accessKeyId", accessKeyId);
    localStorage.setItem("secretAccessKey", secretAccessKey);
    localStorage.setItem("region", region);
  }, [creds]);

  console.log(">>components/CredInput::", "creds", creds); //TRACE

  return (
    <div>
      <TextField
        label="Access Key"
        value={creds.accessKeyId || ""}
        onChange={e => {
          setCreds({
            ...creds,
            accessKeyId: e.target.value
          });
        }}
        margin="normal"
      />
      <TextField
        label="Secret Key"
        value={creds.secretAccessKey || ""}
        style={{ marginLeft: 10 }}
        onChange={e => {
          setCreds({
            ...creds,
            secretAccessKey: e.target.value
          });
        }}
        margin="normal"
      />
      <TextField
        label="Region"
        select
        value={creds.region || ""}
        style={{ marginLeft: 10 }}
        onChange={e => {
          setCreds({
            ...creds,
            region: e.target.value
          });
        }}
        margin="normal"
      >
        {Object.entries(REGIONS).map(e => {
          const [key, val] = e;
          return (
            <MenuItem key={key} value={key}>
              {val}
            </MenuItem>
          );
        })}
      </TextField>
    </div>
  );
}

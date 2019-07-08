import React, { useGlobal } from "reactn";
import groupBy from "lodash/groupBy";
import Button from "@material-ui/core/Button";
import Badge from "@material-ui/core/Badge";
import Chip from "@material-ui/core/Chip";
import Avatar from "@material-ui/core/Avatar";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  root: {
    "& > div": {
      margin: 5
    }
  }
}));

export default function ResourceTypes() {
  const [resourceMap] = useGlobal("resourceMap");
  const [typeFilter, setTypeFilter] = useGlobal("typeFilter");
  const [{ typeGroups, allGroups }, setState] = React.useState({
    typeGroups: {},
    allGroups: []
  });

  const classes = useStyles();

  React.useEffect(() => {
    const typeGroups = groupBy(Object.values(resourceMap), "ResourceType");
    setState(oldState => ({ ...oldState, typeGroups }));
  }, [resourceMap]);
  const onClick = React.useCallback(e => {
    const btn = e.target.closest('div[role="button"]');
    console.log(">>home/ResourceTypes::", "btn", btn); //TRACE
    const name = btn.getAttribute("name");
    console.log(">>home/ResourceTypes::", "name", name); //TRACE
    setTypeFilter(name);
  }, []);

  React.useEffect(() => {
    const g = Object.entries(typeGroups);
    g.unshift(["", Object.values(resourceMap)]);
    setState(oldState => ({
      ...oldState,
      allGroups: g.sort((a, b) => {
        return b[1].length - a[1].length;
      })
    }));
  }, [typeGroups, resourceMap]);

  return (
    <div className={classes.root}>
      {allGroups.map(entry => {
        const [rType, resources] = entry;
        return (
          <Chip
            key={rType}
            variant="outlined"
            size="small"
            name={rType}
            avatar={<Avatar>{resources.length}</Avatar>}
            label={rType === "" ? "All" : rType.replace("AWS::", "")}
            clickable
            onClick={onClick}
            // className={classes.chip}
            color={typeFilter === rType ? "primary" : "default"}
            // onDelete={handleDelete}
            // deleteIcon={<DoneIcon />}
          />
        );
      })}
    </div>
  );
}

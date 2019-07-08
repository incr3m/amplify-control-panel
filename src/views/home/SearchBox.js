import React, { useGlobal } from "reactn";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Menu";
import CloseIcon from "@material-ui/icons/Close";
import DirectionsIcon from "@material-ui/icons/Directions";
import debounce from "lodash/debounce";

const useStyles = makeStyles({
  root: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    width: 400
  },
  input: {
    marginLeft: 8,
    flex: 1
  },
  iconButton: {
    padding: 10
  },
  divider: {
    width: 1,
    height: 28,
    margin: 4
  }
});

export default function SearchBox() {
  const classes = useStyles();
  const [search, setSearch] = useGlobal("search");
  const inputRef = React.useRef(null);

  const updateSearchText = debounce(txt => {
    setSearch({ text: txt });
  }, 250);
  const handleSearchText = React.useCallback(e => {
    const { value } = e.target;
    updateSearchText(value);
  }, []);

  return (
    <Paper className={classes.root}>
      {/* <IconButton className={classes.iconButton} aria-label="Menu">
        <MenuIcon />
      </IconButton> */}
      <InputBase
        className={classes.input}
        placeholder="Search Resources.."
        inputProps={{ "aria-label": "Search Google Maps" }}
        onChange={handleSearchText}
        inputRef={inputRef}
      />
      <IconButton
        onClick={() => {
          setSearch({ text: "" });
          inputRef.current.value = "";
        }}
        className={classes.iconButton}
        aria-label="Search"
      >
        <CloseIcon />
      </IconButton>
      {/* <Divider className={classes.divider} />
      <IconButton
        color="primary"
        className={classes.iconButton}
        aria-label="Directions"
      >
        <DirectionsIcon />
      </IconButton> */}
    </Paper>
  );
}

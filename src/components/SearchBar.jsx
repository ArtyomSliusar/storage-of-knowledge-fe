import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    alignItems: "center"
  },
  input: {
    marginLeft: theme.spacing(2),
    flex: 1
  },
  iconButton: {
    padding: 10
  },
  divider: {
    height: 28,
    margin: 4,
    width: 1
  }
}));

export default function SearchBar({
  searchQuery,
  setSearchQuery,
  handleSearchRequest
}) {
  const classes = useStyles();

  const keyPress = event => {
    if (event.keyCode === 13) {
      handleSearchRequest(event);
    } else {
      console.log("suggestion call");
    }
  };

  return (
    <Paper className={classes.root}>
      <InputBase
        className={classes.input}
        placeholder="Search"
        inputProps={{ "aria-label": "search" }}
        value={searchQuery}
        onChange={event => setSearchQuery(event.target.value)}
        onKeyDown={keyPress}
      />
      <Divider className={classes.divider} orientation="vertical" />
      <IconButton
        className={classes.iconButton}
        aria-label="search"
        onClick={handleSearchRequest}
      >
        <SearchIcon />
      </IconButton>
    </Paper>
  );
}
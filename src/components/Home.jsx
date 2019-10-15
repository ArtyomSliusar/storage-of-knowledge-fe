import React from "react";
import SearchBar from "./SearchBar";
import Filter from "./Filter";
import SearchResults from "./SearchResults";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexFlow: "row wrap",
    justifyContent: "center"
  },
  search: {
    [theme.breakpoints.up("sm")]: {
      marginRight: theme.spacing(3),
      width: 400
    },
    [theme.breakpoints.down("xs")]: {
      flex: "1 0 100%"
    }
  },
  filter: {
    [theme.breakpoints.down("xs")]: {
      margin: theme.spacing(2, 0)
    }
  },
  results: {
    flex: "1 0 100%"
  }
}));

export default function Home() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div className={classes.search}>
        <SearchBar />
      </div>
      <div className={classes.filter}>
        <Filter />
      </div>
      <div className={classes.results}>
        <SearchResults />
      </div>
    </div>
  );
}

import React from "react";
import { Router, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";

import Navbar from "./NavBar";
import Home from "./Home";
import MobileLoginRegister from "./mobile/LoginRegister";
import history from "../history";
import MobileContact from "./mobile/Contact";
import Logout from "./Logout";
import { makeStyles } from "@material-ui/core";
import MobileFilters from "./mobile/Filters";

const useStyles = makeStyles(theme => ({
  wrapper: {
    display: "flex",
    flexFlow: "row wrap",
    "& > *": {
      /* We tell all items to be 100% width, via flex-basis */
      flex: "1 100%"
    }
  },
  main: {
    "& > *": {
      [theme.breakpoints.up("sm")]: {
        padding: theme.spacing(2, 3)
      },
      [theme.breakpoints.down("xs")]: {
        padding: theme.spacing(1, 2)
      }
    }
  }
}));

export default function App() {
  const classes = useStyles();
  return (
    <Router history={history}>
      <div className={classes.wrapper}>
        <Navbar className={classes.header} />

        <div className={classes.main}>
          <Route exact path="/" component={Home} />
          <Route
            exact
            path="/login"
            render={props => <MobileLoginRegister {...props} tab={0} />}
          />
          <Route
            exact
            path="/register"
            render={props => <MobileLoginRegister {...props} tab={1} />}
          />
          <Route exact path="/logout" component={Logout} />
          <Route exact path="/contact" component={MobileContact} />
          <Route exact path="/filters" component={MobileFilters} />
        </div>
      </div>
    </Router>
  );
}

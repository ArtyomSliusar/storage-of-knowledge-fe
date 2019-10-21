import React, { Component } from "react";
import { Router, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";

import Navbar from "./NavBar";
import Home from "./Home";
import LoginRegister from "./mobile/LoginRegister";
import history from "../history";
import Contact from "./mobile/Contact";
import Logout from "./Logout";
import { withStyles } from "@material-ui/core";
import Filters from "./mobile/Filters";

const styles = theme => ({
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
});

class App extends Component {
  render() {
    const { classes } = this.props;
    return (
      <Router history={history}>
        <div className={classes.wrapper}>
          <Navbar className={classes.header} />

          <div className={classes.main}>
            <Route exact path="/" component={Home} />
            <Route
              exact
              path="/login"
              render={props => <LoginRegister {...props} tab={0} />}
            />
            <Route
              exact
              path="/register"
              render={props => <LoginRegister {...props} tab={1} />}
            />
            <Route exact path="/logout" component={Logout} />
            <Route exact path="/contact" component={Contact} />
            <Route exact path="/filters" component={Filters} />
          </div>
        </div>
      </Router>
    );
  }
}

export default withStyles(styles)(App);

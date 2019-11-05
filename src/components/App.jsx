import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";

import Navbar from "./NavBar";
import Home from "./Home";
import MobileLoginRegister from "./mobile/LoginRegister";
import MobileNoteDelete from "./mobile/NoteDelete";
import MobileLinkDelete from "./mobile/LinkDelete";
import history from "../history";
import MobileContact from "./mobile/Contact";
import Logout from "./Logout";
import { makeStyles } from "@material-ui/core";
import MobileFilters from "./mobile/Filters";
import NoteShow from "./NoteShow";
import NoteEdit from "./NoteEdit";
import CustomSnackbar from "./CustomSnackbar";
import LinkShow from "./LinkShow";
import LinkEdit from "./LinkEdit";
import NoteCreate from "./NoteCreate";
import LinkCreate from "./LinkCreate";

const useStyles = makeStyles(theme => ({
  wrapper: {
    display: "flex",
    height: "100vh",
    flexFlow: "row wrap",
    "& > *": {
      /* We tell all items to be 100% width, via flex-basis */
      flex: "1 100%"
    }
  },
  header: {
    height: "10vh"
  },
  main: {
    height: "90vh",
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
        <CustomSnackbar />

        <div className={classes.main}>
          <Switch>
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
            <Route exact path="/notes/new" component={NoteCreate} />
            <Route exact path="/links/new" component={LinkCreate} />
            <Route exact path="/notes/:id" component={NoteShow} />
            <Route exact path="/notes/edit/:id" component={NoteEdit} />
            <Route
              exact
              path="/notes/delete/:id"
              component={MobileNoteDelete}
            />
            <Route exact path="/links/:id" component={LinkShow} />
            <Route exact path="/links/edit/:id" component={LinkEdit} />
            <Route
              exact
              path="/links/delete/:id"
              component={MobileLinkDelete}
            />
          </Switch>
        </div>
      </div>
    </Router>
  );
}

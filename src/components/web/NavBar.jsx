import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";

import logo from "../../logo.svg";
import UserMenu from "./UserMenu";
import Contact from "./Contact";
import history from "../../history";
import { setRefreshNeeded } from "../../actions";
import { connect } from "react-redux";

const useStyles = makeStyles(theme => ({
  appbar: {
    zIndex: 8 // to hide behind SimpleMDE editor fullscreen
  },
  toolbar: {
    height: "100%"
  },
  navButton: {
    marginRight: theme.spacing(2),
    color: theme.palette.primary.contrastText,
    "&:hover": {
      color: theme.palette.primary.contrastText
    },
    "&:last-child": {
      marginRight: 0
    }
  },
  separator: {
    flexGrow: 1
  }
}));

function WebNavBar(props) {
  const { items, loggedIn, setRefreshNeeded } = props;
  const [contactModalOpen, setContactModalOpen] = React.useState(false);
  const classes = useStyles();

  const LogInOut = () => {
    if (!loggedIn) {
      return (
        <Button
          onClick={() => history.push("/login")}
          className={classes.navButton}
        >
          Log in
        </Button>
      );
    } else {
      return <UserMenu classes={classes} items={items} />;
    }
  };

  return (
    <React.Fragment>
      <AppBar position="static" className={classes.appbar}>
        <Toolbar className={classes.toolbar}>
          <Button
            onClick={() => {
              setRefreshNeeded(true);
              history.push("/");
            }}
            className={classes.navButton}
          >
            <img alt="Logo" src={logo} />
          </Button>
          <span className={classes.separator} />
          <Button
            onClick={() => setContactModalOpen(true)}
            className={classes.navButton}
          >
            Contact
          </Button>

          <LogInOut />
        </Toolbar>
      </AppBar>
      <Contact
        open={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
      />
    </React.Fragment>
  );
}

export default connect(
  null,
  { setRefreshNeeded }
)(WebNavBar);

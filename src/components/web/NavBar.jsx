import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";

import logo from "../../logo.svg";
import AdapterLink from "../AdapterLink";
import UserMenu from "./UserMenu";
import LoginRegister from "./LoginRegister";
import Contact from "./Contact";

const useStyles = makeStyles(theme => ({
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
  icon: {
    marginRight: theme.spacing(2)
  },
  separator: {
    flexGrow: 1
  }
}));

export default function WebNavBar(props) {
  const { items, loggedIn } = props;
  const [loginModalOpen, setLoginModalOpen] = React.useState(false);
  const [contactModalOpen, setContactModalOpen] = React.useState(false);
  const classes = useStyles();

  const LogInOut = () => {
    if (!loggedIn) {
      return (
        <Button
          onClick={() => setLoginModalOpen(true)}
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
      <AppBar position="static">
        <Toolbar>
          <img alt="Logo" src={logo} className={classes.icon} />
          <Button component={AdapterLink} to="/" className={classes.navButton}>
            Home
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
      <LoginRegister
        open={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />
      <Contact
        open={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
      />
    </React.Fragment>
  );
}

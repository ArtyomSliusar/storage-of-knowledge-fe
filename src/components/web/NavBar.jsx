import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";

import logo from "../../logo.svg";
import UserMenu from "./UserMenu";
import Contact from "./Contact";
import AdapterLink from "../AdapterLink";
import history from "../../history";

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
  separator: {
    flexGrow: 1
  }
}));

export default function WebNavBar(props) {
  const { items, loggedIn } = props;
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
      <AppBar position="static">
        <Toolbar>
          <Button component={AdapterLink} to="/" className={classes.navButton}>
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

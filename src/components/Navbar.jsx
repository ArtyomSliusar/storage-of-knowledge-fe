import React from "react";
import { Link } from "react-router-dom";
import logo from "../logo.svg";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import LoginRegister from "./LoginRegister";
import Contact from "./Contact";
import ModalPopup from "./Popup";

// Logo Home (page) ------------------------- My storage (page) Contact (pop-up) Profile (My account (page) | Log out)
// Logo Home (page) ------------------------- Contact (pop-up) Log in (pop-up) (Register | Log in)

const useStyles = makeStyles(theme => ({
  bar: {
    color: "#04090e",
    backgroundColor: "#878eff",
    width: "100%"
  },
  icon: {
    marginRight: theme.spacing(2)
  },
  button: {
    marginRight: theme.spacing(2),
    "&:hover": {
      color: "white"
    }
  },
  separator: {
    flexGrow: 1
  }
}));

const AdapterLink = React.forwardRef((props, ref) => (
  <Link innerRef={ref} {...props} />
));

function Navbar() {
  const classes = useStyles();

  return (
    <AppBar position="static" className={classes.bar}>
      <Toolbar>
        <img alt="Logo" src={logo} className={classes.icon} />
        <Button
          color="primary"
          variant="contained"
          component={AdapterLink}
          to="/"
          className={classes.button}
        >
          Home
        </Button>

        <span className={classes.separator} />

        <ModalPopup
          label="Contact"
          variant="contained"
          color="primary"
          className={classes.button}
        >
          <Contact />
        </ModalPopup>

        <ModalPopup
          label="Log in"
          variant="contained"
          color="primary"
          className={classes.button}
        >
          <LoginRegister />
        </ModalPopup>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;

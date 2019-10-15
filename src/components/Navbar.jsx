import React, { useEffect } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import MenuIcon from "@material-ui/icons/Menu";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import logo from "../logo.svg";
import ListItem from "@material-ui/core/ListItem";
import IconButton from "@material-ui/core/IconButton";
import { connect } from "react-redux";
import { getUser } from "../actions";
import AdapterLink from "./AdapterLink";
import UserMenu from "./UserMenu";

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  drawer: {
    [theme.breakpoints.up("sm")]: {
      display: "none"
    }
  },
  drawerPaper: {
    width: drawerWidth,
    "& a": {
      width: "100%"
    }
  },
  drawerButton: {
    marginLeft: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none"
    }
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
  mobileHidden: {
    [theme.breakpoints.down("xs")]: {
      display: "none"
    }
  },
  icon: {
    marginRight: theme.spacing(2)
  },
  separator: {
    flexGrow: 1
  }
}));

function Navbar(props) {
  const { container, username, userId, loggedIn, getUser } = props;
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const userMenuItems = {
    Profile: "/",
    "My storage": "/",
    "Log out": "/logout"
  };

  useEffect(() => {
    if (userId) {
      getUser(userId);
    }
  }, [userId, getUser]);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const LogInOut = () => {
    if (!loggedIn && !isMobile) {
      return (
        <Button
          component={AdapterLink}
          to="/login"
          className={classes.navButton}
        >
          Log in
        </Button>
      );
    } else if (!loggedIn && isMobile) {
      return (
        <ListItem>
          <Button component={AdapterLink} to="/login">
            Log in
          </Button>
        </ListItem>
      );
    } else if (loggedIn && !isMobile) {
      return (
        <UserMenu
          classes={classes}
          items={userMenuItems}
          username={username || "user"}
        />
      );
    } else if (loggedIn && isMobile) {
      return (
        <React.Fragment>
          {Object.keys(userMenuItems).map(key => {
            return (
              <ListItem key={key}>
                <Button component={AdapterLink} to={userMenuItems[key]}>
                  {key}
                </Button>
              </ListItem>
            );
          })}
        </React.Fragment>
      );
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
            component={AdapterLink}
            to="/contact"
            className={`${classes.navButton} ${classes.mobileHidden}`}
          >
            Contact
          </Button>

          <span className={classes.mobileHidden}>
            <LogInOut />
          </span>

          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="end"
            onClick={handleDrawerToggle}
            className={classes.drawerButton}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <nav className={classes.drawer} aria-label="drawer content">
        <Drawer
          container={container}
          variant="temporary"
          anchor="right"
          open={drawerOpen}
          onClose={handleDrawerToggle}
          classes={{
            paper: classes.drawerPaper
          }}
          ModalProps={{
            keepMounted: true // Better open performance on mobile.
          }}
        >
          <div>
            <List>
              <ListItem>
                <Button component={AdapterLink} to="/contact">
                  Contact
                </Button>
              </ListItem>
            </List>

            <Divider />

            <List>
              <LogInOut />
            </List>

            <Divider />
          </div>
        </Drawer>
      </nav>
    </React.Fragment>
  );
}

const mapStateToProps = state => {
  return {
    loggedIn: state.auth.user.loggedIn,
    userId: state.auth.user.id,
    username: state.auth.user.username
  };
};

export default connect(
  mapStateToProps,
  { getUser }
)(Navbar);

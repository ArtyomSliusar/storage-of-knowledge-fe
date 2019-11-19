import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import MenuIcon from "@material-ui/icons/Menu";

import logo from "../../logo.svg";
import ListItem from "@material-ui/core/ListItem";
import IconButton from "@material-ui/core/IconButton";
import AdapterLink from "../AdapterLink";

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  toolbar: {
    height: "100%"
  },
  drawerPaper: {
    width: drawerWidth,
    "& a": {
      width: "100%"
    }
  },
  drawerButton: {
    marginLeft: theme.spacing(2)
  },
  icon: {
    marginRight: theme.spacing(2)
  },
  separator: {
    flexGrow: 1
  }
}));

export default function MobileNavBar(props) {
  const { container, items, loggedIn } = props;
  const classes = useStyles();
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const LogInOut = () => {
    if (!loggedIn) {
      return (
        <ListItem>
          <Button
            component={AdapterLink}
            to="/login"
            onClick={handleDrawerToggle}
          >
            Log in
          </Button>
        </ListItem>
      );
    } else {
      return (
        <React.Fragment>
          {Object.keys(items).map(key => {
            return (
              <ListItem key={key}>
                <Button
                  component={AdapterLink}
                  to={items[key]}
                  onClick={handleDrawerToggle}
                >
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
        <Toolbar className={classes.toolbar}>
          <Button
            component={AdapterLink}
            to={{
              pathname: "/",
              state: {
                refresh: true
              }
            }}
          >
            <img alt="Logo" src={logo} />
          </Button>
          <span className={classes.separator} />

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

      <nav aria-label="drawer content">
        <Drawer
          container={container}
          variant="temporary"
          anchor="right"
          open={drawerOpen}
          onClose={handleDrawerToggle}
          classes={{
            paper: classes.drawerPaper
          }}
        >
          <div>
            <List>
              <ListItem>
                <Button
                  component={AdapterLink}
                  to="/contact"
                  onClick={handleDrawerToggle}
                >
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

import React, { useEffect } from "react";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import { connect } from "react-redux";
import { getUser } from "../actions";
import MobileNavBar from "./mobile/NavBar";
import WebNavBar from "./web/NavBar";

function NavBar({ userId, getUser, loggedIn }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
  const userMenuItems = {
    Profile: "/profile",
    "My storage": "/my-storage",
    "Log out": "/logout"
  };

  useEffect(() => {
    if (userId) {
      getUser(userId);
    }
  }, [userId, getUser]);

  return isMobile ? (
    <MobileNavBar items={userMenuItems} loggedIn={loggedIn} />
  ) : (
    <WebNavBar items={userMenuItems} loggedIn={loggedIn} />
  );
}

const mapStateToProps = state => {
  return {
    loggedIn: state.auth.user.loggedIn,
    userId: state.auth.user.id
  };
};

export default connect(
  mapStateToProps,
  { getUser }
)(NavBar);

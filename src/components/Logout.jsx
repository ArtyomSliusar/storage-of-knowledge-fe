import React from "react";
import { connect } from "react-redux";
import { logout, setRefreshNeeded } from "../actions";
import history from "../history";

class Logout extends React.Component {
  componentDidMount() {
    this.props.logout().then(() => {
      this.props.setRefreshNeeded(true);
      history.replace("/");
    });
  }

  render() {
    return <div>Logging out ...</div>;
  }
}

export default connect(
  null,
  { logout, setRefreshNeeded }
)(Logout);

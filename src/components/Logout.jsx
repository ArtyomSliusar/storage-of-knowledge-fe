import React from "react";
import { connect } from "react-redux";
import { logout } from "../actions";

class Logout extends React.Component {
  componentDidMount() {
    this.props.logout();
  }

  render() {
    return <div>Logging out ...</div>;
  }
}

export default connect(
  null,
  { logout }
)(Logout);

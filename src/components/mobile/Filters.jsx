import React from "react";
import AvailableFilters from "../AvailableFilters";
import history from "../../history";
import { connect } from "react-redux";
import { setRefreshNeeded } from "../../actions";

function Filters({ setRefreshNeeded }) {
  return (
    <AvailableFilters
      onCancel={history.goBack}
      onApplyCallback={() => {
        setRefreshNeeded(true);
        history.push("/");
      }}
    />
  );
}

export default connect(
  null,
  { setRefreshNeeded }
)(Filters);

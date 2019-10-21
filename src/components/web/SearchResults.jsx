import React, { useEffect } from "react";
import { connect } from "react-redux";
import { getNotes } from "../../actions";

function SearchResults({ getNotes, items }) {
  return <div></div>;
}

const mapStateToProps = state => {
  return {
    items: state.notes
  };
};

export default connect(
  mapStateToProps,
  { getNotes }
)(SearchResults);

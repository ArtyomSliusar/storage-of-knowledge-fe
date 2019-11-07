import React from "react";
import { connect } from "react-redux";
import "easymde/dist/easymde.min.css";

import { LINKS } from "../constants";
import ItemShow from "./ItemShow";

function LinkShow({ linkId }) {
  return <ItemShow itemId={linkId} itemType={LINKS} />;
}

const mapStateToProps = (state, ownProps) => {
  return {
    linkId: ownProps.match.params.id,
    ...ownProps
  };
};

export default connect(
  mapStateToProps,
  {}
)(LinkShow);

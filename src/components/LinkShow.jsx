import React from "react";
import { connect } from "react-redux";
import "easymde/dist/easymde.min.css";

import { getLink } from "../actions";
import { LINKS } from "../constants";
import ItemShow from "./ItemShow";

function LinkShow({ getLink, linkId, linkDetails, user }) {
  return (
    <ItemShow
      getItem={getLink}
      itemId={linkId}
      itemDetails={linkDetails}
      itemType={LINKS}
      user={user}
    />
  );
}

const mapStateToProps = (state, ownProps) => {
  return {
    linkDetails: state.links.linkDetails,
    linkId: ownProps.match.params.id,
    user: state.auth.user,
    ...ownProps
  };
};

export default connect(
  mapStateToProps,
  { getLink }
)(LinkShow);

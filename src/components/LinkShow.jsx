import React from "react";
import { connect } from "react-redux";
import "easymde/dist/easymde.min.css";

import { getLinkLikes, addLinkLike, getLink, deleteLinkLike } from "../actions";
import { LINKS } from "../constants";
import ItemShow from "./ItemShow";

function LinkShow({
  getLink,
  getLinkLikes,
  addLinkLike,
  deleteLinkLike,
  linkId,
  linkDetails,
  user
}) {
  return (
    <ItemShow
      getItem={getLink}
      getItemLikes={getLinkLikes}
      likeItem={addLinkLike}
      dislikeItem={deleteLinkLike}
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
  { getLink, getLinkLikes, addLinkLike, deleteLinkLike }
)(LinkShow);

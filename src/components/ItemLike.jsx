import React, { useEffect } from "react";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";

import history from "../history";
import { addItemLike, deleteItemLike, getItemLike } from "../actions";

function ItemLike({
  getItemLike,
  addItemLike,
  deleteItemLike,
  itemLike,
  itemId,
  itemType,
  loggedIn
}) {
  useEffect(() => {
    getItemLike(itemId, itemType);
  }, []);

  const toggleLike = () => {
    if (!loggedIn) {
      history.push("/login");
    } else {
      if (!itemLike) {
        addItemLike(itemId, itemType);
      } else {
        deleteItemLike(itemId, itemType, itemLike.id);
      }
    }
  };

  return (
    <Button
      variant={itemLike ? "contained" : "outlined"}
      color="primary"
      size="medium"
      startIcon={<ThumbUpAltIcon />}
      onClick={toggleLike}
    >
      Like
    </Button>
  );
}

const mapStateToProps = (state, ownProps) => {
  return {
    itemLike: state.openedItem.like,
    loggedIn: state.auth.user.loggedIn,
    ...ownProps
  };
};

export default connect(
  mapStateToProps,
  { getItemLike, addItemLike, deleteItemLike }
)(ItemLike);

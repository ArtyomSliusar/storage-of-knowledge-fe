import React, { useEffect } from "react";
import { connect } from "react-redux";
import { addItemLike, deleteItemLike, getItemLike } from "../actions";
import Button from "@material-ui/core/Button";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";

function ItemLike({
  getItemLike,
  addItemLike,
  deleteItemLike,
  itemLike,
  itemId,
  itemType
}) {
  useEffect(() => {
    getItemLike(itemId, itemType);
  }, []);

  const toggleLike = () => {
    if (!itemLike) {
      addItemLike(itemId, itemType);
    } else {
      deleteItemLike(itemId, itemType, itemLike.id);
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
    ...ownProps
  };
};

export default connect(
  mapStateToProps,
  { getItemLike, addItemLike, deleteItemLike }
)(ItemLike);

import React, { useEffect } from "react";
import { connect } from "react-redux";
import TextField from "@material-ui/core/TextField";
import { Button, makeStyles } from "@material-ui/core";

import { addItemComment, deleteItemComment, getItemComments } from "../actions";
import CommentList from "./CommentList";
import history from "../history";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    width: "100%",
    flexFlow: "column wrap"
  },
  commentsList: {
    display: "flex",
    maxWidth: "100%",
    overflowX: "auto",
    paddingTop: theme.spacing(2),
    "& ul": {
      width: "100%"
    }
  },
  commentCard: {
    width: "100%",
    "& > form": {
      margin: theme.spacing(2, 1)
    }
  },
  nestedReplies: {
    borderLeft: "2px dotted black",
    marginLeft: theme.spacing(2)
  },
  textField: {
    width: "100%"
  },
  actionButtons: {
    display: "flex",
    justifyContent: "flex-end",
    "& > *": {
      marginLeft: theme.spacing(2)
    }
  }
}));

function ItemComments({
  getItemComments,
  addItemComment,
  deleteItemComment,
  itemComments,
  itemId,
  itemType,
  user
}) {
  const classes = useStyles();
  const prefixId = "reply-for-";

  useEffect(() => {
    getItemComments(itemId, itemType);
  }, []);

  useEffect(() => {
    // instead of locally updating comments tree structure, just download it
    // again after ADD_ITEM_COMMENT or DELETE_ITEM_COMMENT actions
    if (itemComments === null) {
      getItemComments(itemId, itemType);
    }
  }, [itemComments]);

  const handleCommentSubmit = e => {
    e.preventDefault();
    const value = e.target.elements.comment.value;
    const parentId = e.target.id.substr(prefixId.length) || null;
    if (value) {
      addItemComment(itemId, itemType, value, parentId);
      e.currentTarget.reset();
    }
  };

  const handleCommentDelete = id => {
    deleteItemComment(itemId, itemType, id);
  };

  const handleFormOpen = formId => {
    if (user.loggedIn) {
      document.getElementById(formId).hidden = false;
    } else {
      history.push("/login");
    }
  };

  const handleFormClose = e => {
    handleFormClear(e);
    e.currentTarget.parentNode.parentNode.hidden = true;
  };

  const handleFormClear = e => {
    e.currentTarget.parentNode.parentNode.reset();
  };

  const renderForm = (parentId, handleCancel, hidden = false) => {
    if (user.loggedIn) {
      return (
        <form
          id={`${prefixId}${parentId}`}
          hidden={hidden}
          className={classes.form}
          autoComplete="off"
          onSubmit={handleCommentSubmit}
        >
          <div>
            <TextField
              id="comment"
              label="Comment"
              multiline
              rows="4"
              className={classes.textField}
              margin="normal"
              variant="outlined"
            />
          </div>
          <div className={classes.actionButtons}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="small"
            >
              Add
            </Button>
            <Button variant="contained" size="small" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </form>
      );
    } else {
      return null;
    }
  };

  const renderCommentsList = () => {
    if (itemComments && itemComments.length > 0) {
      return (
        <CommentList
          username={user.username}
          comments={itemComments}
          classes={classes}
          prefixId={prefixId}
          renderForm={renderForm}
          handleFormOpen={handleFormOpen}
          handleFormClose={handleFormClose}
          handleCommentDelete={handleCommentDelete}
        />
      );
    }
  };

  return (
    <div className={classes.root}>
      {renderForm("", handleFormClear)}
      <div className={classes.commentsList}>{renderCommentsList()}</div>
    </div>
  );
}

const mapStateToProps = (state, ownProps) => {
  return {
    itemComments: state.openedItem.comments,
    user: state.auth.user,
    ...ownProps
  };
};

export default connect(
  mapStateToProps,
  { getItemComments, addItemComment, deleteItemComment }
)(ItemComments);

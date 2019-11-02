import React from "react";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";
import "easymde/dist/easymde.min.css";

import { deleteLink, deleteNote, openSnackbar } from "../actions";
import history from "../history";
import { ERROR, LINKS, NOTES, SUCCESS } from "../constants";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  question: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2)
  },
  actions: {
    textAlign: "right",
    "& > *": {
      margin: theme.spacing(2, 1)
    }
  }
}));

function ItemDelete({
  deleteNote,
  deleteLink,
  openSnackbar,
  onClose,
  itemId,
  itemType
}) {
  const classes = useStyles();

  const reprItemType = () => {
    if (itemType === NOTES) {
      return "note";
    } else if (itemType === LINKS) {
      return "link";
    }
  };

  const handleDelete = () => {
    if (itemType === NOTES) {
      deleteNote(itemId)
        .then(() => {
          openSnackbar("Note deleted", SUCCESS);
          history.push("/");
        })
        .catch(error => {
          openSnackbar(error.toString(), ERROR);
        });
    } else if (itemType === LINKS) {
      deleteLink(itemId)
        .then(() => {
          openSnackbar("Link deleted", SUCCESS);
          history.push("/");
        })
        .catch(error => {
          openSnackbar(error.toString(), ERROR);
        });
    }
  };

  return (
    <div className={classes.root}>
      <div
        className={classes.question}
      >{`Are you sure you want to delete current ${reprItemType()}?`}</div>

      <div className={classes.actions}>
        <Button
          onClick={handleDelete}
          color="secondary"
          size="medium"
          variant="contained"
        >
          Yes
        </Button>
        <Button
          onClick={onClose}
          color="default"
          variant="contained"
          size="medium"
          autoFocus
        >
          No
        </Button>
      </div>
    </div>
  );
}

const mapStateToProps = (state, ownProps) => {
  return {
    ...ownProps
  };
};

export default connect(
  mapStateToProps,
  { deleteNote, deleteLink, openSnackbar }
)(ItemDelete);

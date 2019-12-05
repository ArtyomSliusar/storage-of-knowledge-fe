import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import "easymde/dist/easymde.min.css";
import CircularProgress from "@material-ui/core/CircularProgress";

import history from "../history";
import ItemForm from "./ItemForm";
import { getItem, openSnackbar, updateItem } from "../actions";
import { NOTES, SUCCESS } from "../constants";

const useStyles = makeStyles(theme => ({
  loader: {
    textAlign: "center"
  }
}));

function NoteEdit({
  noteId,
  noteDetails,
  currentUser,
  getItem,
  updateItem,
  openSnackbar
}) {
  const classes = useStyles();

  useEffect(() => {
    getItem(noteId, NOTES);
  }, []);

  const handleSave = formValues => {
    return updateItem(noteId, formValues, NOTES);
  };

  const handleSaveSuccess = () => {
    openSnackbar("Note changes saved", SUCCESS);
    history.goBack();
  };

  const handleCancel = () => {
    history.goBack();
  };

  const renderNote = () => {
    if (
      noteDetails &&
      currentUser.loggedIn &&
      currentUser.id === noteDetails.author
    ) {
      return (
        <ItemForm
          onSubmit={handleSave}
          onClose={handleCancel}
          onFormSuccess={handleSaveSuccess}
          initialValues={{ itemType: NOTES, ...noteDetails }}
        />
      );
    } else {
      return (
        <div className={classes.loader}>
          <CircularProgress />
        </div>
      );
    }
  };

  return <React.Fragment>{renderNote()}</React.Fragment>;
}

const mapStateToProps = (state, ownProps) => {
  return {
    noteDetails: state.openedItem.details,
    noteId: ownProps.match.params.id,
    currentUser: state.auth.user,
    ...ownProps
  };
};

export default connect(
  mapStateToProps,
  { getItem, updateItem, openSnackbar }
)(NoteEdit);

import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import "easymde/dist/easymde.min.css";
import CircularProgress from "@material-ui/core/CircularProgress";

import history from "../history";
import ItemForm from "./ItemForm";
import { getNote, openSnackbar, updateNote } from "../actions";
import { NOTES, SUCCESS } from "../constants";

const useStyles = makeStyles(theme => ({
  loader: {
    textAlign: "center"
  }
}));

function NoteEdit({
  noteId,
  noteDetails,
  user,
  getNote,
  updateNote,
  openSnackbar
}) {
  const classes = useStyles();

  useEffect(() => {
    getNote(noteId);
  }, []);

  const handleSave = formValues => {
    return updateNote(noteId, formValues);
  };

  const handleSaveSuccess = () => {
    openSnackbar("Note changes saved", SUCCESS);
    history.goBack();
  };

  const handleCancel = () => {
    history.goBack();
  };

  const renderNote = () => {
    if (noteDetails && user.loggedIn && user.username === noteDetails.user) {
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
    noteDetails: state.notes.noteDetails,
    noteId: ownProps.match.params.id,
    user: state.auth.user,
    ...ownProps
  };
};

export default connect(
  mapStateToProps,
  { getNote, updateNote, openSnackbar }
)(NoteEdit);

import React from "react";
import { connect } from "react-redux";
import "easymde/dist/easymde.min.css";

import history from "../history";
import ItemForm from "./ItemForm";
import { createNote, openSnackbar } from "../actions";
import { NOTES, SUCCESS } from "../constants";

function NoteCreate({ user, createNote, openSnackbar }) {
  const handleSave = formValues => {
    return createNote(formValues);
  };

  const handleSaveSuccess = response => {
    openSnackbar("Note created", SUCCESS);
    history.replace(`/notes/${response.data.id}`);
  };

  const handleCancel = () => {
    history.goBack();
  };

  const renderNoteForm = () => {
    if (user.loggedIn) {
      return (
        <ItemForm
          onSubmit={handleSave}
          onClose={handleCancel}
          onFormSuccess={handleSaveSuccess}
          initialValues={{ itemType: NOTES, subjects: [] }}
        />
      );
    } else {
      history.goBack();
    }
  };

  return <React.Fragment>{renderNoteForm()}</React.Fragment>;
}

const mapStateToProps = state => {
  return {
    user: state.auth.user
  };
};

export default connect(
  mapStateToProps,
  { createNote, openSnackbar }
)(NoteCreate);

import React from "react";
import { connect } from "react-redux";
import "easymde/dist/easymde.min.css";

import history from "../history";
import ItemForm from "./ItemForm";
import { createItem, openSnackbar, setRefreshNeeded } from "../actions";
import { NOTES, SUCCESS } from "../constants";

function NoteCreate({ loggedIn, createItem, openSnackbar, setRefreshNeeded }) {
  const handleSave = formValues => {
    return createItem(formValues, NOTES);
  };

  const handleSaveSuccess = response => {
    openSnackbar("Note created", SUCCESS);
    setRefreshNeeded(true);
    history.replace(`/notes/${response.data.id}`);
  };

  const handleCancel = () => {
    history.goBack();
  };

  const renderNoteForm = () => {
    if (loggedIn) {
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
    loggedIn: state.auth.user.loggedIn
  };
};

export default connect(
  mapStateToProps,
  { createItem, openSnackbar, setRefreshNeeded }
)(NoteCreate);

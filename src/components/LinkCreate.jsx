import React from "react";
import { connect } from "react-redux";
import "easymde/dist/easymde.min.css";

import history from "../history";
import ItemForm from "./ItemForm";
import { createLink, openSnackbar } from "../actions";
import { LINKS, SUCCESS } from "../constants";

function LinkCreate({ user, createLink, openSnackbar }) {
  const handleSave = formValues => {
    return createLink(formValues);
  };

  const handleSaveSuccess = response => {
    openSnackbar("Link created", SUCCESS);
    history.replace(`/links/${response.data.id}`);
  };

  const handleCancel = () => {
    history.goBack();
  };

  const renderLinkForm = () => {
    if (user.loggedIn) {
      return (
        <ItemForm
          onSubmit={handleSave}
          onClose={handleCancel}
          onFormSuccess={handleSaveSuccess}
          initialValues={{ itemType: LINKS, subjects: [] }}
        />
      );
    } else {
      history.goBack();
    }
  };

  return <React.Fragment>{renderLinkForm()}</React.Fragment>;
}

const mapStateToProps = state => {
  return {
    user: state.auth.user
  };
};

export default connect(
  mapStateToProps,
  { createLink, openSnackbar }
)(LinkCreate);

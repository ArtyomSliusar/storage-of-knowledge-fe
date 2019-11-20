import React from "react";
import { connect } from "react-redux";
import "easymde/dist/easymde.min.css";

import history from "../history";
import ItemForm from "./ItemForm";
import { createItem, openSnackbar, setRefreshNeeded } from "../actions";
import { LINKS, SUCCESS } from "../constants";

function LinkCreate({ loggedIn, createItem, openSnackbar, setRefreshNeeded }) {
  const handleSave = formValues => {
    return createItem(formValues, LINKS);
  };

  const handleSaveSuccess = response => {
    openSnackbar("Link created", SUCCESS);
    setRefreshNeeded(true);
    history.replace(`/links/${response.data.id}`);
  };

  const handleCancel = () => {
    history.goBack();
  };

  const renderLinkForm = () => {
    if (loggedIn) {
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
    loggedIn: state.auth.user.loggedIn
  };
};

export default connect(
  mapStateToProps,
  { createItem, openSnackbar, setRefreshNeeded }
)(LinkCreate);

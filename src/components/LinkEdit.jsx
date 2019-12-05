import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import "easymde/dist/easymde.min.css";
import CircularProgress from "@material-ui/core/CircularProgress";

import history from "../history";
import { getItem, openSnackbar, updateItem } from "../actions";
import { LINKS, SUCCESS } from "../constants";
import ItemForm from "./ItemForm";

const useStyles = makeStyles(theme => ({
  loader: {
    textAlign: "center"
  }
}));

function LinkEdit({
  linkId,
  linkDetails,
  currentUser,
  getItem,
  updateItem,
  openSnackbar
}) {
  const classes = useStyles();

  useEffect(() => {
    getItem(linkId, LINKS);
  }, []);

  const handleSave = formValues => {
    return updateItem(linkId, formValues, LINKS);
  };

  const handleSaveSuccess = () => {
    openSnackbar("Link changes saved", SUCCESS);
    history.goBack();
  };

  const handleCancel = () => {
    history.goBack();
  };

  const renderLink = () => {
    if (
      linkDetails &&
      currentUser.loggedIn &&
      currentUser.id === linkDetails.author
    ) {
      return (
        <ItemForm
          onSubmit={handleSave}
          onClose={handleCancel}
          onFormSuccess={handleSaveSuccess}
          initialValues={{ itemType: LINKS, ...linkDetails }}
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

  return <React.Fragment>{renderLink()}</React.Fragment>;
}

const mapStateToProps = (state, ownProps) => {
  return {
    linkDetails: state.openedItem.details,
    linkId: ownProps.match.params.id,
    currentUser: state.auth.user,
    ...ownProps
  };
};

export default connect(
  mapStateToProps,
  { getItem, updateItem, openSnackbar }
)(LinkEdit);

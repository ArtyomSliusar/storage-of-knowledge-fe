import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import "easymde/dist/easymde.min.css";
import CircularProgress from "@material-ui/core/CircularProgress";

import history from "../history";
import { getLink, openSnackbar, updateLink } from "../actions";
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
  user,
  getLink,
  updateLink,
  openSnackbar
}) {
  const classes = useStyles();

  useEffect(() => {
    getLink(linkId);
  }, []);

  const handleSave = formValues => {
    return updateLink(linkId, formValues);
  };

  const handleSaveSuccess = () => {
    openSnackbar("Link changes saved", SUCCESS);
    history.goBack();
  };

  const handleCancel = () => {
    history.goBack();
  };

  const renderLink = () => {
    if (linkDetails && user.loggedIn && user.username === linkDetails.user) {
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
    linkDetails: state.links.linkDetails,
    linkId: ownProps.match.params.id,
    user: state.auth.user,
    ...ownProps
  };
};

export default connect(
  mapStateToProps,
  { getLink, updateLink, openSnackbar }
)(LinkEdit);

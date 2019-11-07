import React from "react";
import Snackbar from "@material-ui/core/Snackbar";
import { connect } from "react-redux";

import { closeSnackbar } from "../actions";
import SnackbarContentWrapper from "./SnackbarContentWrapper";

function CustomSnackbar({ open, message, type, closeSnackbar }) {
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    closeSnackbar();
  };

  return (
    <div>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left"
        }}
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
      >
        <SnackbarContentWrapper
          onClose={handleClose}
          type={type}
          message={message}
        />
      </Snackbar>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    open: state.snackbar.open,
    message: state.snackbar.message,
    type: state.snackbar.type
  };
};

export default connect(
  mapStateToProps,
  { closeSnackbar }
)(CustomSnackbar);

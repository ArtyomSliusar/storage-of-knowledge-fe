import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import PropTypes from "prop-types";

export default function Modal(props) {
  const { onClose, open } = props;

  const handleClose = () => {
    onClose();
  };

  const OptionalTitle = () => {
    if (props.title) {
      return <DialogTitle id="form-dialog-title">{props.title}</DialogTitle>;
    }
    return null;
  };

  const OptionalActions = () => {
    if (props.actions) {
      return <DialogActions>{props.actions}</DialogActions>;
    }
    return null;
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <OptionalTitle />
        <DialogContent>{props.children}</DialogContent>
        <OptionalActions />
      </Dialog>
    </div>
  );
}

Modal.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired
};

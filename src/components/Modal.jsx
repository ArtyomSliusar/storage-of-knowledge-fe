import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

export default function Modal(props) {
  const handleClose = () => {
    props.onClose();
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
        open={props.open}
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

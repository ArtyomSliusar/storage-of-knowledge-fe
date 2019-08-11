import React from "react";
import Popup from "reactjs-popup";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  close: {
    cursor: "pointer",
    position: "absolute",
    display: "block",
    padding: "2px 5px",
    lineHeight: "20px",
    right: "-10px",
    top: "-10px",
    fontSize: "24px",
    background: "#ffffff",
    borderRadius: "18px",
    border: "1px solid #cfcece"
  }
}));

function ModalPopup(props) {
  const classes = useStyles();

  return (
    <Popup
      modal
      trigger={<Button {...props}>{props.label}</Button>}
      closeOnDocumentClick
    >
      {close => (
        <div>
          <a className={classes.close} onClick={close}>
            &times;
          </a>
          <span>{props.children}</span>
        </div>
      )}
    </Popup>
  );
}

export default ModalPopup;

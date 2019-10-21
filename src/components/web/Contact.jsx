import React from "react";
import { makeStyles } from "@material-ui/core";
import Modal from "../Modal";
import ContactForm from "../ContactForm";

// TODO: move to form style
const useStyles = makeStyles(theme => ({
  textField: {
    width: "100%"
  },
  actionButton: {
    marginRight: theme.spacing(2),
    marginBottom: theme.spacing(1)
  }
}));

export default function Contact(props) {
  const classes = useStyles();

  return (
    <Modal open={props.open} onClose={props.onClose} title="Contact Form">
      <ContactForm
        classes={classes}
        onClose={props.onClose}
        onFormSuccess={props.onClose}
      />
    </Modal>
  );
}

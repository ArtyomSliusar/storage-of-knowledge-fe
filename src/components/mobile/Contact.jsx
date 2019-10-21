import React from "react";
import { makeStyles } from "@material-ui/core";
import history from "../../history";
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
  const handleClose = () => {
    history.goBack();
  };

  return (
    <div>
      <h4>Contact Form</h4>
      <ContactForm
        classes={classes}
        onClose={handleClose}
        onFormSuccess={handleClose}
      />
    </div>
  );
}

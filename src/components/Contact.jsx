import React from "react";
import { Button, withStyles } from "@material-ui/core";
import { Field, reduxForm, SubmissionError } from "redux-form";
import { renderTextField } from "../utils/formUtils";
import { contact } from "../utils/apiUtils";
import Modal from "./Modal";
import history from "../history";
import { popUrl } from "../utils/otherUtils";

const styles = theme => ({
  textField: {
    width: "100%"
  },
  actionButton: {
    marginRight: theme.spacing(2),
    marginBottom: theme.spacing(1)
  }
});

class ContactForm extends React.Component {
  onSubmit = ({ name, email, message }) => {
    return contact(name, email, message)
      .then(history.goBack())
      .catch(error => {
        if (error.response) {
          const status = error.response.status;
          if (status >= 400 && status < 500) {
            throw new SubmissionError({
              ...error.response.data,
              _error: error.response.data.detail
            });
          } else {
            throw new SubmissionError({
              _error: error.response.statusText
            });
          }
        }
        alert(error);
      });
  };

  render() {
    const { handleSubmit, classes, error, onClose } = this.props;
    return (
      <form onSubmit={handleSubmit(this.onSubmit)} autoComplete="off">
        <div>
          <Field
            name="name"
            component={renderTextField}
            label="Name"
            className={classes.textField}
            margin="normal"
          />
        </div>

        <div>
          <Field
            name="email"
            component={renderTextField}
            label="Email"
            className={classes.textField}
            margin="normal"
          />
        </div>

        <div>
          <Field
            name="message"
            component={renderTextField}
            label="Message"
            className={classes.textField}
            margin="normal"
            multiline
            rows={10}
          />
        </div>

        <div style={{ color: "red" }}>{error}</div>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="medium"
          className={classes.actionButton}
        >
          Send
        </Button>
        <Button
          variant="contained"
          size="medium"
          onClick={onClose}
          className={classes.actionButton}
        >
          Cancel
        </Button>
      </form>
    );
  }
}

const validate = values => {
  const errors = {};
  ["name", "email", "message"].forEach(field => {
    if (!values[field]) {
      errors[field] = "Required";
    }
  });
  if (
    values.email &&
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
  ) {
    errors.email = "Invalid email address";
  }
  return errors;
};

const ContactFormWrapped = reduxForm({
  form: "contactForm",
  validate
})(ContactForm);

class Contact extends React.Component {
  handleModalClose = () => {
    history.push(popUrl(history.location.pathname));
  };

  render() {
    const { classes } = this.props;

    return (
      <Modal open={true} onClose={this.handleModalClose} title="Contact Form">
        <ContactFormWrapped classes={classes} onClose={this.handleModalClose} />
      </Modal>
    );
  }
}

export default withStyles(styles)(Contact);

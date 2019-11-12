import React from "react";
import { Button, withStyles } from "@material-ui/core";
import { Field, reduxForm, SubmissionError } from "redux-form";
import { renderRecaptchaField, renderTextField } from "../utils/formUtils";
import { contact } from "../utils/apiUtils";
import { connect } from "react-redux";
import { openSnackbar } from "../actions";
import { ERROR } from "../constants";

const styles = theme => ({
  textField: {
    width: "100%"
  },
  actionButton: {
    margin: theme.spacing(2, 1)
  }
});

class ContactForm extends React.Component {
  onSubmit = ({ name, email, message, recaptcha }) => {
    return contact(name, email, message, recaptcha)
      .then(() => {
        this.props.onFormSuccess();
      })
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
        this.props.openSnackbar(error.toString(), ERROR);
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

        <div>
          <Field
            name="recaptcha"
            component={renderRecaptchaField}
            margin="normal"
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
  ["name", "email", "message", "recaptcha"].forEach(field => {
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

const formWrapped = reduxForm({
  form: "contactForm",
  validate
})(ContactForm);

export default withStyles(styles)(
  connect(
    null,
    { openSnackbar }
  )(formWrapped)
);

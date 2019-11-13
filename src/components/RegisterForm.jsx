import React from "react";
import { Button, withStyles } from "@material-ui/core";
import { Field, reduxForm, SubmissionError } from "redux-form";
import {
  renderRecaptchaField,
  renderTextField,
  renderTimezoneField
} from "../utils/formUtils";
import { connect } from "react-redux";
import { openSnackbar, register } from "../actions";
import { ERROR } from "../constants";

const styles = theme => ({
  textField: {
    width: "100%"
  },
  customField: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1)
  },
  timezoneField: {
    width: "100%",
    "& ul": {
      zIndex: 1,
      background: "rgba(252, 252, 252, 1) !important"
    }
  },
  actionButton: {
    margin: theme.spacing(2, 1)
  }
});

class RegisterForm extends React.Component {
  onSubmit = ({ username, email, password, timezone, recaptcha }) => {
    return this.props
      .register(username, email, password, timezone, recaptcha)
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
            name="username"
            component={renderTextField}
            label="Username"
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
            name="password"
            type="password"
            component={renderTextField}
            className={classes.textField}
            label="Password"
            margin="normal"
          />
        </div>

        <div>
          <Field
            name="timezone"
            classes={classes}
            component={renderTimezoneField}
            className={classes.customField}
            margin="normal"
          />
        </div>

        <div>
          <Field
            name="recaptcha"
            component={renderRecaptchaField}
            className={classes.customField}
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
          Sign up
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
  ["username", "email", "password", "recaptcha"].forEach(field => {
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
  form: "registerForm",
  validate
})(RegisterForm);

export default withStyles(styles)(
  connect(
    null,
    { register, openSnackbar }
  )(formWrapped)
);

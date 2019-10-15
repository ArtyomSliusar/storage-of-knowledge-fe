import React from "react";
import { Button } from "@material-ui/core";
import { Field, reduxForm, SubmissionError } from "redux-form";
import { renderTextField } from "../utils/formUtils";
import { connect } from "react-redux";
import { register } from "../actions";

class Register extends React.Component {
  onSubmit = ({ username, email, password }) => {
    return this.props.register(username, email, password).catch(error => {
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
  ["username", "email", "password"].forEach(field => {
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
})(Register);

export default connect(
  null,
  { register }
)(formWrapped);

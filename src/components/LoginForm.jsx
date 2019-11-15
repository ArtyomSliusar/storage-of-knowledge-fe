import React from "react";
import { connect } from "react-redux";
import { Button, withStyles } from "@material-ui/core";
import { Field, reduxForm, SubmissionError } from "redux-form";
import { login, openSnackbar } from "../actions";
import { renderTextField } from "../utils/formUtils";
import { ERROR } from "../constants";
import history from "../history";

const styles = theme => ({
  textField: {
    width: "100%"
  },
  actionButton: {
    margin: theme.spacing(2, 1)
  }
});

class LoginForm extends React.Component {
  onSubmit = ({ username, password }) => {
    return this.props
      .login(username, password)
      .then(() => {
        this.onFormSuccess();
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

  onFormSuccess = () => {
    history.push("/");
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
          Log in
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
  ["username", "password"].forEach(field => {
    if (!values[field]) {
      errors[field] = "Required";
    }
  });
  return errors;
};

const formWrapped = reduxForm({
  form: "loginForm",
  validate
})(LoginForm);

export default withStyles(styles)(
  connect(
    null,
    { login, openSnackbar }
  )(formWrapped)
);

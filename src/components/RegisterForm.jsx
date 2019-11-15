import React from "react";
import { Button, makeStyles, useTheme } from "@material-ui/core";
import { Field, reduxForm, SubmissionError } from "redux-form";
import {
  renderRecaptchaField,
  renderTextField,
  renderTimezoneField
} from "../utils/formUtils";
import { connect } from "react-redux";
import { openSnackbar, register } from "../actions";
import { ERROR, INFO } from "../constants";
import history from "../history";
import { Link } from "react-router-dom";
import useMediaQuery from "@material-ui/core/useMediaQuery/useMediaQuery";

const useStyles = makeStyles(theme => ({
  textField: {
    width: "100%"
  },
  customField: {
    margin: theme.spacing(2, 0)
  },
  timezoneField: {
    width: "100%",
    "& ul": {
      zIndex: 1,
      background: "rgba(252, 252, 252, 1) !important"
    }
  },
  actionButton: {
    flexGrow: 1,
    margin: theme.spacing(2, 0),
    "& button": {
      margin: theme.spacing(0, 1)
    }
  }
}));

function RegisterForm({
  handleSubmit,
  error,
  onClose,
  openSnackbar,
  register
}) {
  const theme = useTheme();
  const classes = useStyles();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

  const onSubmit = ({ username, email, password, timezone, recaptcha }) => {
    return register(username, email, password, timezone, recaptcha)
      .then(() => {
        onFormSuccess();
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
        openSnackbar(error.toString(), ERROR);
      });
  };

  const onFormSuccess = () => {
    openSnackbar("Activation code was sent", INFO);
    history.push("/activate-user");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
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
          size={isMobile ? "compact" : "normal"}
          component={renderRecaptchaField}
          className={classes.customField}
          margin="normal"
        />
      </div>

      <div style={{ color: "red" }}>{error}</div>

      <Link to="/activate-user">Already registered and need activation</Link>

      <div className={classes.actionButton}>
        <Button type="submit" variant="contained" color="primary" size="medium">
          Sign up
        </Button>
        <Button variant="contained" size="medium" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  );
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

export default connect(
  null,
  { register, openSnackbar }
)(formWrapped);

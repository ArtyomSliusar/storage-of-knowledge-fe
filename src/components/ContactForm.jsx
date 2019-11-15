import React from "react";
import { Button, makeStyles, useTheme, withStyles } from "@material-ui/core";
import { Field, reduxForm, SubmissionError } from "redux-form";
import { renderRecaptchaField, renderTextField } from "../utils/formUtils";
import { contact } from "../utils/apiUtils";
import { connect } from "react-redux";
import { openSnackbar } from "../actions";
import { ERROR } from "../constants";
import Box from "@material-ui/core/Box";
import useMediaQuery from "@material-ui/core/useMediaQuery/useMediaQuery";

const useStyles = makeStyles(theme => ({
  box: {
    padding: theme.spacing(3)
  },
  textField: {
    width: "100%"
  },
  actionButton: {
    margin: theme.spacing(2, 1)
  }
}));

function ContactForm({
  handleSubmit,
  error,
  onClose,
  onFormSuccess,
  openSnackbar
}) {
  const theme = useTheme();
  const classes = useStyles();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

  const onSubmit = ({ name, email, message, recaptcha }) => {
    return contact(name, email, message, recaptcha)
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

  return (
    <Box className={classes.box}>
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
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
            size={isMobile ? "compact" : "normal"}
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
    </Box>
  );
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

export default connect(
  null,
  { openSnackbar }
)(formWrapped);

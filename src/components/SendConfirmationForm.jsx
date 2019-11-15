import React from "react";
import { connect } from "react-redux";
import { Button, makeStyles, useTheme } from "@material-ui/core";
import { Field, reduxForm, SubmissionError } from "redux-form";
import Box from "@material-ui/core/Box";
import useMediaQuery from "@material-ui/core/useMediaQuery/useMediaQuery";

import { openSnackbar } from "../actions";
import { renderRecaptchaField, renderTextField } from "../utils/formUtils";
import { ACTIVATION, ERROR, INFO, PASSWORD_RESET } from "../constants";
import { sendConfirmation } from "../utils/apiUtils";
import history from "../history";

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 600,
    margin: "auto"
  },
  box: {
    padding: theme.spacing(3)
  },
  textField: {
    width: "100%"
  },
  customField: {
    margin: theme.spacing(2, 0)
  },
  actionButton: {
    flexGrow: 1,
    margin: theme.spacing(2, 0),
    "& button": {
      margin: theme.spacing(0, 1)
    }
  }
}));

function SendConfirmationForm({
  handleSubmit,
  error,
  openSnackbar,
  confirmationType
}) {
  const theme = useTheme();
  const classes = useStyles();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

  const onSubmit = ({ usernameEmail, recaptcha }) => {
    return sendConfirmation(usernameEmail, confirmationType, recaptcha)
      .then(() => {
        onFormSuccess();
      })
      .catch(error => {
        if (error.response) {
          const status = error.response.status;
          if (status >= 400 && status < 500) {
            throw new SubmissionError({
              _error: error.response.data
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
    if (confirmationType === ACTIVATION) {
      openSnackbar("Activation code was sent", INFO);
      history.goBack();
    } else if (confirmationType === PASSWORD_RESET) {
      openSnackbar("Reset code was sent", INFO);
      history.replace("/reset-password");
    }
  };

  return (
    <div className={classes.root}>
      <Box className={classes.box}>
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <div>
            <Field
              name="usernameEmail"
              component={renderTextField}
              label="Username or email"
              className={classes.textField}
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

          <div className={classes.actionButton}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="medium"
            >
              Send code
            </Button>
            <Button
              variant="contained"
              size="medium"
              onClick={() => history.goBack()}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Box>
    </div>
  );
}

const validate = values => {
  const errors = {};
  ["usernameEmail", "recaptcha"].forEach(field => {
    if (!values[field]) {
      errors[field] = "Required";
    }
  });
  return errors;
};

const formWrapped = reduxForm({
  form: "confirmationForm",
  validate
})(SendConfirmationForm);

const mapStateToProps = (state, ownProps) => {
  return {
    confirmationType: ownProps.match.params.type,
    ...ownProps
  };
};

export default connect(
  mapStateToProps,
  { openSnackbar }
)(formWrapped);

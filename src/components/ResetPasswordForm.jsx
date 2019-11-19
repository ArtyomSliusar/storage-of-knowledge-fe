import React from "react";
import { connect } from "react-redux";
import { Button, makeStyles, useTheme } from "@material-ui/core";
import { Field, reduxForm, SubmissionError } from "redux-form";
import Box from "@material-ui/core/Box";
import InfoIcon from "@material-ui/icons/Info";
import FormHelperText from "@material-ui/core/FormHelperText";
import InputAdornment from "@material-ui/core/InputAdornment";
import useMediaQuery from "@material-ui/core/useMediaQuery/useMediaQuery";

import { openSnackbar } from "../actions";
import { renderTextField } from "../utils/formUtils";
import { ERROR, SUCCESS } from "../constants";
import { resetPassword } from "../utils/apiUtils";
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
  actionButton: {
    flexGrow: 1,
    margin: theme.spacing(2, 0),
    "& button": {
      margin: theme.spacing(0, 1)
    }
  }
}));

function ResetPasswordForm({ handleSubmit, error, openSnackbar }) {
  const theme = useTheme();
  const classes = useStyles();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
  const helperText = "check your email for reset password code";

  const onSubmit = ({ usernameEmail, newPassword, resetPasswordCode }) => {
    return resetPassword(usernameEmail, newPassword, resetPasswordCode)
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
    openSnackbar("Password successfully set", SUCCESS);
    history.replace("/login");
  };

  const renderResetPasswordCodeField = () => {
    if (isMobile) {
      return (
        <React.Fragment>
          <Field
            name="resetPasswordCode"
            type="password"
            component={renderTextField}
            className={classes.textField}
            label="Reset password code"
            margin="normal"
          />
          <FormHelperText>
            <InfoIcon
              fontSize="small"
              color="primary"
              titleAccess={helperText}
              style={{ marginRight: theme.spacing(1) }}
            />
            <span>{helperText}</span>
          </FormHelperText>
        </React.Fragment>
      );
    } else {
      return (
        <Field
          name="resetPasswordCode"
          type="password"
          component={renderTextField}
          className={classes.textField}
          label="Reset password code"
          margin="normal"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <InfoIcon
                  fontSize="small"
                  color="primary"
                  titleAccess={helperText}
                />
              </InputAdornment>
            )
          }}
        />
      );
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
              name="newPassword"
              type="password"
              component={renderTextField}
              className={classes.textField}
              label="New password"
              margin="normal"
            />
          </div>

          <div>
            <Field
              name="newPasswordConfirm"
              type="password"
              component={renderTextField}
              className={classes.textField}
              label="New password repeat"
              margin="normal"
            />
          </div>

          <div>{renderResetPasswordCodeField()}</div>

          <div style={{ color: "red" }}>{error}</div>

          <div className={classes.actionButton}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="medium"
            >
              Save
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
  [
    "usernameEmail",
    "newPassword",
    "newPasswordConfirm",
    "resetPasswordCode"
  ].forEach(field => {
    if (!values[field]) {
      errors[field] = "Required";
    }
  });
  if (values.newPassword !== values.newPasswordConfirm) {
    errors.newPasswordConfirm = "Passwords do not match";
  }
  return errors;
};

const formWrapped = reduxForm({
  form: "resetPasswordForm",
  validate
})(ResetPasswordForm);

export default connect(
  null,
  { openSnackbar }
)(formWrapped);

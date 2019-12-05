import React from "react";
import { connect } from "react-redux";
import { Button, makeStyles, useTheme } from "@material-ui/core";
import { Field, reduxForm, SubmissionError } from "redux-form";
import Box from "@material-ui/core/Box";
import InfoIcon from "@material-ui/icons/Info";

import { openSnackbar } from "../actions";
import { renderTextField } from "../utils/formUtils";
import { ACTIVATION, ERROR, SUCCESS } from "../constants";
import { activateUser } from "../utils/apiUtils";
import history from "../history";
import FormHelperText from "@material-ui/core/FormHelperText";
import InputAdornment from "@material-ui/core/InputAdornment";
import useMediaQuery from "@material-ui/core/useMediaQuery/useMediaQuery";
import { Link } from "react-router-dom";

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
  link: {
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

function ActivateUserForm({ handleSubmit, error, openSnackbar }) {
  const theme = useTheme();
  const classes = useStyles();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
  const helperText = "check your email for activation code";

  const onSubmit = ({ usernameEmail, activationCode }) => {
    return activateUser(usernameEmail, activationCode)
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
    openSnackbar("User successfully activated", SUCCESS);
    history.replace("/login");
  };

  const renderActivationCodeField = () => {
    if (isMobile) {
      return (
        <React.Fragment>
          <Field
            name="activationCode"
            type="password"
            component={renderTextField}
            className={classes.textField}
            label="Activation code"
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
          name="activationCode"
          type="password"
          component={renderTextField}
          className={classes.textField}
          label="Activation code"
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

          <div>{renderActivationCodeField()}</div>

          <div style={{ color: "red" }}>{error}</div>

          <div className={classes.link}>
            <Link to={`/send-confirmation/${ACTIVATION}`}>Resend code</Link>
          </div>

          <div className={classes.actionButton}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="medium"
            >
              Activate
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
  ["usernameEmail", "activationCode"].forEach(field => {
    if (!values[field]) {
      errors[field] = "Required";
    }
  });
  return errors;
};

const formWrapped = reduxForm({
  form: "activationForm",
  validate
})(ActivateUserForm);

export default connect(
  null,
  { openSnackbar }
)(formWrapped);

import React, { useEffect, useState } from "react";
import * as _ from "lodash";
import { connect } from "react-redux";
import { Button, makeStyles } from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import { Field, reduxForm, SubmissionError } from "redux-form";
import MenuItem from "@material-ui/core/MenuItem";

import {
  renderSelectField,
  renderSimpleMDE,
  renderSwitchField,
  renderTextField
} from "../utils/formUtils";
import { getSubjects } from "../utils/apiUtils";
import { ERROR, LINKS, NOTES } from "../constants";
import { openSnackbar } from "../actions";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%"
  },
  simpleMde: {
    display: "grid"
  },
  field: {
    marginBottom: theme.spacing(2)
  },
  actions: {
    display: "flex",
    margin: theme.spacing(3, 1)
  },
  separator: {
    flexGrow: 1
  },
  selectForm: {
    minWidth: 90
  },
  chips: {
    display: "flex",
    flexWrap: "wrap"
  },
  menuProps: {
    maxHeight: theme.spacing(6) * 4.5 + theme.spacing(1),
    width: 250
  },
  chip: {
    backgroundColor: theme.palette.primary.main,
    marginTop: theme.spacing(2),
    marginRight: theme.spacing(1)
  }
}));

const getMainFieldName = itemType => {
  if (itemType === NOTES) {
    return "body";
  } else if (itemType === LINKS) {
    return "link";
  }
};

function ItemForm({
  handleSubmit,
  error,
  onSubmit,
  onClose,
  onFormSuccess,
  openSnackbar,
  initialValues
}) {
  const classes = useStyles();
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const itemType = initialValues.itemType;

  useEffect(() => {
    getSubjects()
      .then(response => {
        let subjectsNames = response.data.map(subject => subject.name);
        setAvailableSubjects(subjectsNames);
      })
      .catch(error => {
        openSnackbar(error.toString(), ERROR);
      });
  }, []);

  const submit = formValues => {
    return onSubmit(formValues)
      .then(response => {
        onFormSuccess(response);
      })
      .catch(error => {
        if (error.response) {
          const status = error.response.status;
          if (status >= 400 && status < 500) {
            throw new SubmissionError({
              ...error.response.data,
              _error: error.response.data.non_field_errors
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

  const renderMainFieldComponent = () => {
    if (itemType === NOTES) {
      return (
        <Field
          name="body"
          classes={classes}
          component={renderSimpleMDE}
          margin="normal"
          options={{
            spellChecker: false
          }}
        />
      );
    } else if (itemType === LINKS) {
      return (
        <Field
          fullWidth
          name="link"
          component={renderTextField}
          label="Link"
          margin="normal"
        />
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit(submit)}
      autoComplete="off"
      className={classes.root}
    >
      <div className={classes.field}>
        <Field
          fullWidth
          name="title"
          component={renderTextField}
          label="Title"
          className={classes.textField}
          margin="normal"
        />
      </div>

      <div className={classes.field}>
        <Field
          name="private"
          label="private"
          color="primary"
          component={renderSwitchField}
          margin="normal"
        />
      </div>

      <div className={classes.field}>
        <Field
          classes={classes}
          name="subjects"
          component={renderSelectField}
          label="Subjects"
        >
          {availableSubjects.map(name => (
            <MenuItem key={name} value={name}>
              {name}
            </MenuItem>
          ))}
        </Field>
      </div>

      <div className={classes.field}>{renderMainFieldComponent()}</div>

      <div style={{ color: "red" }}>{error}</div>

      <div className={classes.actions}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="medium"
          startIcon={<SaveIcon />}
        >
          Save
        </Button>
        <span className={classes.separator} />
        <Button
          variant="contained"
          color="secondary"
          size="medium"
          onClick={onClose}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

const validate = values => {
  const errors = {};
  const mainField = getMainFieldName(values.itemType);
  ["title", mainField].forEach(field => {
    if (!values[field]) {
      errors[field] = "Required";
    }
  });
  if (_.isEmpty(values["subjects"])) {
    errors["subjects"] = "Required";
  }
  return errors;
};

const formWrapped = reduxForm({
  form: "itemForm",
  validate
})(ItemForm);

const mapStateToProps = (state, ownProps) => {
  return {
    ...ownProps
  };
};

export default connect(
  mapStateToProps,
  { openSnackbar }
)(formWrapped);

import TextField from "@material-ui/core/TextField";
import React from "react";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { Switch } from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import FormHelperText from "@material-ui/core/FormHelperText";
import Chip from "@material-ui/core/Chip";
import SimpleMDE from "react-simplemde-editor";
import { RECAPTCHA_PUBLIC_KEY } from "../constants";
import ReCAPTCHA from "react-google-recaptcha";

const renderTextField = ({
  label,
  input,
  meta: { touched, invalid, error },
  ...custom
}) => (
  <TextField
    label={label}
    placeholder={label}
    error={touched && invalid}
    helperText={touched && error}
    {...input}
    {...custom}
  />
);

const renderSimpleMDE = ({ input, classes, meta: { error }, ...custom }) => (
  <div>
    <SimpleMDE
      value={input.value}
      onChange={input.onChange}
      className={classes.simpleMde}
      {...custom}
    />
    <div style={{ color: "red" }}>{error}</div>
  </div>
);

const renderSwitchField = ({ input, label, color }) => (
  <FormControlLabel
    control={
      <Switch
        checked={input.value ? true : false}
        onChange={input.onChange}
        color={color}
      />
    }
    label={label}
  />
);

const renderRecaptchaField = ({ input, meta: { touched, error } }) => (
  <div>
    <ReCAPTCHA sitekey={RECAPTCHA_PUBLIC_KEY} onChange={input.onChange} />
    <div style={{ color: "red" }}>{touched ? error : ""}</div>
  </div>
);

const renderFromHelper = ({ touched, error }) => {
  if (!(touched && error)) {
    return;
  } else {
    return <FormHelperText>{touched && error}</FormHelperText>;
  }
};

const renderSelectField = ({
  input,
  label,
  classes,
  meta: { touched, error },
  children,
  ...custom
}) => {
  return (
    <FormControl error={error && touched} className={classes.selectForm}>
      <InputLabel htmlFor={`${label}-select`}>{label}</InputLabel>
      <Select
        multiple
        {...input}
        {...custom}
        renderValue={selected => (
          <div className={classes.chips}>
            {selected.map(value => (
              <Chip key={value} label={value} className={classes.chip} />
            ))}
          </div>
        )}
        MenuProps={{
          PaperProps: {
            className: classes.menuProps
          }
        }}
        inputProps={{
          name: label,
          id: `${label}-select`
        }}
      >
        {children}
      </Select>
      {renderFromHelper({ touched, error })}
    </FormControl>
  );
};

export {
  renderTextField,
  renderSwitchField,
  renderSelectField,
  renderSimpleMDE,
  renderRecaptchaField
};

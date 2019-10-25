import React, { useEffect } from "react";
import Chip from "@material-ui/core/Chip";
import { Button, makeStyles } from "@material-ui/core";
import { connect } from "react-redux";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

import { getSubjects } from "../utils/apiUtils";
import { applyFilters } from "../actions";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(1)
    }
  },
  header: {
    flex: "1 0 100%"
  },
  chips: {
    display: "flex",
    flexWrap: "wrap",
    flex: "1 0 100%"
  },
  formControl: {
    flex: "1 0 100%"
  },
  chip: {
    margin: theme.spacing(0.5)
  },
  separator: {
    flexGrow: 1
  }
}));

const itemTypes = ["Note", "Link"];

function AvailableFilters(props) {
  const classes = useStyles();
  const [subjects, setSubjects] = React.useState([]);
  const [selectedSubjects, setSelectedSubjects] = React.useState([
    ...props.selectedSubjects
  ]);
  const [selectedType, setSelectedType] = React.useState(props.selectedType);

  const onApply = () => {
    props.applyFilters({
      subjects: selectedSubjects,
      type: selectedType
    });
    props.onApplyCallback();
  };

  const IsSubjectEnabled = subject => {
    return selectedSubjects.includes(subject);
  };

  const resetFilters = () => {
    setSelectedSubjects([]);
    setSelectedType("Note");
  };

  const toggleSubject = subject => {
    if (IsSubjectEnabled(subject)) {
      setSelectedSubjects(chips => chips.filter(chip => chip !== subject));
    } else {
      setSelectedSubjects(chips => [...chips, subject]);
    }
  };

  const handleTypeChange = event => {
    setSelectedType(event.target.value);
  };

  useEffect(() => {
    getSubjects()
      .then(response => {
        let subjectsNames = response.data.map(subject => subject.name);
        setSubjects(subjectsNames);
      })
      .catch(error => {
        alert(error);
      });
  }, []);

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <h5>Subjects</h5>
      </div>
      <div className={classes.chips}>
        {subjects.map(subject => (
          <Chip
            label={subject}
            key={subject}
            color="primary"
            variant={IsSubjectEnabled(subject) ? "default" : "outlined"}
            className={classes.chip}
            onClick={() => toggleSubject(subject)}
          />
        ))}
      </div>

      <div className={classes.header}>
        <h5>Type</h5>
      </div>
      <FormControl className={classes.formControl}>
        <Select value={selectedType} onChange={handleTypeChange} name="type">
          {itemTypes.map(item => {
            return (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            );
          })}
        </Select>
        <FormHelperText>Records type</FormHelperText>
      </FormControl>

      <Button
        variant="contained"
        color="primary"
        size="medium"
        onClick={onApply}
      >
        Apply
      </Button>

      <Button variant="contained" size="medium" onClick={props.onCancel}>
        Cancel
      </Button>

      <span className={classes.separator} />

      <Button
        variant="contained"
        size="medium"
        color="secondary"
        onClick={resetFilters}
      >
        Reset
      </Button>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    selectedSubjects: state.filters.subjects,
    selectedType: state.filters.type
  };
};

export default connect(
  mapStateToProps,
  { applyFilters }
)(AvailableFilters);

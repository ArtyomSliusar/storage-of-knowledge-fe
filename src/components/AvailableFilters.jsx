import React, { useEffect } from "react";
import Chip from "@material-ui/core/Chip";
import { Button, makeStyles } from "@material-ui/core";
import { connect } from "react-redux";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

import { applyFilters, getSubjects } from "../actions";
import { LINKS, NOTES } from "../constants";

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

const itemTypes = [NOTES, LINKS];

function AvailableFilters(props) {
  const classes = useStyles();
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
    setSelectedType(NOTES);
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
    props.getSubjects();
  }, []);

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <h5>Subjects</h5>
      </div>
      <div className={classes.chips}>
        {props.subjects.allIds.map(subjectId => (
          <Chip
            label={props.subjects.byId[subjectId].name}
            key={subjectId}
            color="primary"
            variant={IsSubjectEnabled(subjectId) ? "default" : "outlined"}
            className={classes.chip}
            onClick={() => toggleSubject(subjectId)}
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

const mapStateToProps = (state, ownProps) => {
  return {
    selectedSubjects: state.filters.subjects,
    selectedType: state.filters.type,
    subjects: state.subjects,
    ...ownProps
  };
};

export default connect(
  mapStateToProps,
  { applyFilters, getSubjects }
)(AvailableFilters);

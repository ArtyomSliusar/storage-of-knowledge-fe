import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import { connect } from "react-redux";
import Autosuggest from "react-autosuggest";
import TextField from "@material-ui/core/TextField";
import { getSuggestions } from "../utils/apiUtils";
import MenuItem from "@material-ui/core/MenuItem";
import { ERROR } from "../constants";
import { openSnackbar } from "../actions";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    justifyContent: "center"
  },
  container: {
    flex: 1,
    position: "relative"
  },
  suggestionsContainerOpen: {
    position: "absolute",
    zIndex: 1,
    marginTop: theme.spacing(1),
    left: 0,
    right: 0
  },
  suggestion: {
    display: "block",
    overflowWrap: "break-word",
    wordWrap: "break-word"
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: "none"
  },
  input: {
    padding: theme.spacing(1),
    "& input": {
      marginLeft: theme.spacing(1)
    }
  },
  iconButton: {
    padding: theme.spacing(1)
  },
  divider: {
    height: 28,
    margin: 4,
    width: 1
  }
}));

function renderInputComponent(inputProps) {
  const { classes, inputRef = () => {}, ref, ...other } = inputProps;

  return (
    <TextField
      className={classes.input}
      fullWidth
      InputProps={{
        inputRef: node => {
          ref(node);
          inputRef(node);
        }
      }}
      {...other}
    />
  );
}

function renderSuggestion(suggestion) {
  return (
    <MenuItem component="div" style={{ whiteSpace: "normal" }}>
      <div>{suggestion}</div>
    </MenuItem>
  );
}

function getSuggestionValue(suggestion) {
  return suggestion;
}

function SearchBar({
  searchQuery,
  setSearchQuery,
  handleSearchRequest,
  filters,
  openSnackbar
}) {
  const classes = useStyles();
  const [suggestions, setSuggestions] = React.useState([]);

  const keyPress = event => {
    if (event.keyCode === 13) {
      handleSearchRequest(event);
    }
  };

  const handleChange = (event, { newValue, method }) => {
    setSearchQuery(newValue);
  };

  const handleSuggestionsFetchRequested = ({ value }) => {
    if (value && value.length > 1) {
      getSuggestions(filters, value)
        .then(response => {
          setSuggestions(response.data.suggestions);
        })
        .catch(error => {
          openSnackbar(error.toString(), ERROR);
        });
    }
  };

  const handleSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  return (
    <div className={classes.root}>
      <Autosuggest
        suggestions={suggestions}
        getSuggestionValue={getSuggestionValue}
        onSuggestionsFetchRequested={handleSuggestionsFetchRequested}
        onSuggestionsClearRequested={handleSuggestionsClearRequested}
        renderInputComponent={renderInputComponent}
        renderSuggestion={renderSuggestion}
        inputProps={{
          classes,
          id: "react-autosuggest-simple",
          placeholder: "Search",
          value: searchQuery,
          onChange: handleChange,
          onKeyDown: keyPress
        }}
        theme={{
          container: classes.container,
          suggestionsContainerOpen: classes.suggestionsContainerOpen,
          suggestionsList: classes.suggestionsList,
          suggestion: classes.suggestion
        }}
        renderSuggestionsContainer={options => (
          <Paper {...options.containerProps} square>
            {options.children}
          </Paper>
        )}
      />

      <Divider className={classes.divider} orientation="vertical" />
      <IconButton
        className={classes.iconButton}
        aria-label="search"
        onClick={handleSearchRequest}
      >
        <SearchIcon />
      </IconButton>
    </div>
  );
}

const mapStateToProps = (state, ownProps) => {
  return {
    filters: state.filters,
    ...ownProps
  };
};

export default connect(
  mapStateToProps,
  { openSnackbar }
)(SearchBar);

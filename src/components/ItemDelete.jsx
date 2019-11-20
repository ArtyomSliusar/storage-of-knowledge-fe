import React from "react";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";
import "easymde/dist/easymde.min.css";

import { deleteItem, openSnackbar, setRefreshNeeded } from "../actions";
import history from "../history";
import { ERROR, SUCCESS } from "../constants";
import { makeStyles } from "@material-ui/core";
import { getFilterTypeSingular } from "../utils/otherUtils";

const useStyles = makeStyles(theme => ({
  question: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2)
  },
  actions: {
    textAlign: "right",
    "& > *": {
      margin: theme.spacing(2, 1)
    }
  }
}));

function ItemDelete({
  deleteItem,
  openSnackbar,
  setRefreshNeeded,
  onClose,
  itemId,
  itemType
}) {
  const classes = useStyles();

  const handleDelete = () => {
    deleteItem(itemId, itemType)
      .then(() => {
        openSnackbar(`${getFilterTypeSingular(true)} deleted`, SUCCESS);
        setRefreshNeeded(true);
        history.push("/");
      })
      .catch(error => {
        openSnackbar(error.toString(), ERROR);
      });
  };

  return (
    <div className={classes.root}>
      <div
        className={classes.question}
      >{`Are you sure you want to delete current ${getFilterTypeSingular()}?`}</div>

      <div className={classes.actions}>
        <Button
          onClick={handleDelete}
          color="secondary"
          size="medium"
          variant="contained"
        >
          Yes
        </Button>
        <Button
          onClick={onClose}
          color="default"
          variant="contained"
          size="medium"
          autoFocus
        >
          No
        </Button>
      </div>
    </div>
  );
}

const mapStateToProps = (state, ownProps) => {
  return {
    ...ownProps
  };
};

export default connect(
  mapStateToProps,
  { deleteItem, openSnackbar, setRefreshNeeded }
)(ItemDelete);

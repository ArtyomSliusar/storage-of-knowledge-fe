import React, { useEffect } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { connect } from "react-redux";
import SimpleMDE from "react-simplemde-editor";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import PersonSharpIcon from "@material-ui/icons/PersonSharp";
import LockIcon from "@material-ui/icons/Lock";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import Avatar from "@material-ui/core/Avatar";
import Paper from "@material-ui/core/Paper";
import "easymde/dist/easymde.min.css";

import { getNote } from "../actions";
import AdapterLink from "./AdapterLink";
import useMediaQuery from "@material-ui/core/useMediaQuery/useMediaQuery";
import history from "../history";
import Modal from "./Modal";
import ItemDelete from "./ItemDelete";
import { NOTES } from "../constants";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%"
  },
  title: {
    margin: theme.spacing(2)
  },
  paper: {
    padding: theme.spacing(2),
    backgroundColor: "#fafafa"
  },
  simpleMde: {
    display: "grid"
  },
  meta: {
    marginBottom: theme.spacing(2)
  },
  actions: {
    display: "flex",
    margin: theme.spacing(3, 1)
  },
  separator: {
    flexGrow: 1
  },
  chip: {
    marginTop: theme.spacing(2),
    marginRight: theme.spacing(1)
  },
  loader: {
    textAlign: "center"
  },
  icon: {
    margin: "auto",
    display: "block",
    maxWidth: "100%",
    maxHeight: "100%"
  }
}));

function NoteShow({ getNote, noteId, noteDetails, user }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
  const [modalOpen, setModalOpen] = React.useState(false);
  const classes = useStyles();

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const getIntance = instance => {
    // disable edit mode for simplemde instance.
    instance.togglePreview();
  };

  useEffect(() => {
    getNote(noteId);
  }, []);

  const renderPrivate = () => {
    return (
      <Grid item className={classes.icon}>
        {noteDetails.private === true ? (
          <LockIcon fontSize="large" />
        ) : (
          <LockOpenIcon fontSize="large" />
        )}
      </Grid>
    );
  };

  const renderDeleteConfirmation = () => {
    if (isMobile) {
      history.push(`/notes/delete/${noteId}`);
    } else {
      setModalOpen(true);
    }
  };

  const renderActions = () => {
    if (user.loggedIn && user.username === noteDetails.user) {
      return (
        <div className={classes.actions}>
          <Button
            variant="contained"
            color="primary"
            size="medium"
            component={AdapterLink}
            to={`/notes/edit/${noteId}`}
          >
            Edit
          </Button>
          <span className={classes.separator} />
          <Button
            variant="contained"
            color="secondary"
            size="medium"
            onClick={renderDeleteConfirmation}
          >
            Delete
          </Button>
        </div>
      );
    }
    return null;
  };

  const renderNote = () => {
    if (noteDetails) {
      return (
        <div className={classes.root}>
          <div className={classes.meta}>
            <Grid container alignItems="center">
              <Grid item xs>
                <Typography className={classes.title} variant="h4">
                  {noteDetails.title}
                </Typography>
                <Paper className={classes.paper}>
                  <Grid container spacing={2}>
                    <Grid item className={classes.icon}>
                      <Avatar>
                        <PersonSharpIcon />
                      </Avatar>
                    </Grid>
                    <Grid item xs={12} sm container>
                      <Grid item xs container direction="column" spacing={2}>
                        <Grid item xs>
                          <Typography variant="subtitle1">
                            {noteDetails.user}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {noteDetails.date_modified}
                          </Typography>
                        </Grid>
                      </Grid>
                      {renderPrivate()}
                    </Grid>
                  </Grid>

                  <div>
                    {noteDetails.subjects.map(subject => (
                      <Chip
                        className={classes.chip}
                        color="primary"
                        label={subject}
                        key={subject}
                      />
                    ))}
                  </div>
                </Paper>
              </Grid>
            </Grid>
          </div>

          <div className={classes.body}>
            <SimpleMDE
              getMdeInstance={getIntance}
              value={noteDetails.body}
              options={{ toolbar: false }}
              className={classes.simpleMde}
            />
          </div>

          {renderActions()}
        </div>
      );
    } else {
      return (
        <div className={classes.loader}>
          <CircularProgress />
        </div>
      );
    }
  };

  return (
    <React.Fragment>
      {renderNote()}
      <Modal open={modalOpen} title="Confirmation" onClose={handleModalClose}>
        <ItemDelete
          onClose={handleModalClose}
          itemId={noteId}
          itemType={NOTES}
        />
      </Modal>
    </React.Fragment>
  );
}

const mapStateToProps = (state, ownProps) => {
  return {
    noteDetails: state.notes.noteDetails,
    noteId: ownProps.match.params.id,
    user: state.auth.user,
    ...ownProps
  };
};

export default connect(
  mapStateToProps,
  { getNote }
)(NoteShow);

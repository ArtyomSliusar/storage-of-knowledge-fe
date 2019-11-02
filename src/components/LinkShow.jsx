import React, { useEffect } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { connect } from "react-redux";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import PersonSharpIcon from "@material-ui/icons/PersonSharp";
import LockIcon from "@material-ui/icons/Lock";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import Avatar from "@material-ui/core/Avatar";
import Paper from "@material-ui/core/Paper";
import Link from "@material-ui/core/Link";
import useMediaQuery from "@material-ui/core/useMediaQuery/useMediaQuery";
import "easymde/dist/easymde.min.css";

import { getLink } from "../actions";
import AdapterLink from "./AdapterLink";
import history from "../history";
import Modal from "./Modal";
import ItemDelete from "./ItemDelete";
import { LINKS } from "../constants";

// TODO: move elements that are the same as in notes to a separate elements

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

function LinkShow({ getLink, linkId, linkDetails, user }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
  const [modalOpen, setModalOpen] = React.useState(false);
  const classes = useStyles();

  const handleModalClose = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    getLink(linkId);
  }, []);

  const renderPrivate = () => {
    return (
      <Grid item className={classes.icon}>
        {linkDetails.private === true ? (
          <LockIcon fontSize="large" />
        ) : (
          <LockOpenIcon fontSize="large" />
        )}
      </Grid>
    );
  };

  const renderDeleteConfirmation = () => {
    if (isMobile) {
      history.push(`/links/delete/${linkId}`);
    } else {
      setModalOpen(true);
    }
  };

  const renderActions = () => {
    if (user.loggedIn && user.username === linkDetails.user) {
      return (
        <div className={classes.actions}>
          <Button
            variant="contained"
            color="primary"
            size="medium"
            component={AdapterLink}
            to={`/links/edit/${linkId}`}
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

  const renderLink = () => {
    if (linkDetails) {
      return (
        <div className={classes.root}>
          <div className={classes.meta}>
            <Grid container alignItems="center">
              <Grid item xs>
                <Typography className={classes.title} variant="h4">
                  {linkDetails.title}
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
                            {linkDetails.user}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {linkDetails.date_modified}
                          </Typography>
                        </Grid>
                      </Grid>
                      {renderPrivate()}
                    </Grid>
                  </Grid>

                  <div>
                    {linkDetails.subjects.map(subject => (
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
            <Link
              target="_blank"
              href={linkDetails.link}
              className={classes.link}
            >
              Follow the link
            </Link>
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
      {renderLink()}
      <Modal open={modalOpen} title="Confirmation" onClose={handleModalClose}>
        <ItemDelete
          onClose={handleModalClose}
          itemId={linkId}
          itemType={LINKS}
        />
      </Modal>
    </React.Fragment>
  );
}

const mapStateToProps = (state, ownProps) => {
  return {
    linkDetails: state.links.linkDetails,
    linkId: ownProps.match.params.id,
    user: state.auth.user,
    ...ownProps
  };
};

export default connect(
  mapStateToProps,
  { getLink }
)(LinkShow);

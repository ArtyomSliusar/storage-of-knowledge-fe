import React, { useEffect } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import PersonSharpIcon from "@material-ui/icons/PersonSharp";
import LockIcon from "@material-ui/icons/Lock";
import DeleteIcon from "@material-ui/icons/Delete";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import EditIcon from "@material-ui/icons/Edit";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import Avatar from "@material-ui/core/Avatar";
import Paper from "@material-ui/core/Paper";
import Link from "@material-ui/core/Link";
import useMediaQuery from "@material-ui/core/useMediaQuery/useMediaQuery";
import "easymde/dist/easymde.min.css";

import AdapterLink from "./AdapterLink";
import history from "../history";
import Modal from "./Modal";
import ItemDelete from "./ItemDelete";
import { LINKS, NOTES } from "../constants";
import SimpleMDE from "react-simplemde-editor";

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

export default function ItemShow({
  getItem,
  getItemLikes,
  likeItem,
  dislikeItem,
  itemId,
  itemType,
  itemDetails,
  user
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
  const [modalOpen, setModalOpen] = React.useState(false);
  const [likeId, setLikeId] = React.useState(null);
  const classes = useStyles();

  const handleModalClose = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    getItem(itemId);
    getItemLikes({ id: itemId, userOnly: true }).then(response => {
      if (response.data.length > 0) {
        const userLike = response.data[0]; // take first like (theoretically there should be only one)
        setLikeId(userLike.id);
      }
    });
  }, []);

  const getIntance = instance => {
    // disable edit mode for simplemde instance.
    instance.togglePreview();
  };

  const renderPrivate = () => {
    return (
      <Grid item className={classes.icon}>
        {itemDetails.private === true ? (
          <LockIcon fontSize="large" />
        ) : (
          <LockOpenIcon fontSize="large" />
        )}
      </Grid>
    );
  };

  const renderDeleteConfirmation = () => {
    if (isMobile) {
      history.push(`/${itemType}/delete/${itemId}`);
    } else {
      setModalOpen(true);
    }
  };

  const toggleLike = () => {
    if (likeId === null) {
      likeItem(itemId).then(response => {
        setLikeId(response.data.id);
      });
    } else {
      dislikeItem({ id: itemId, likeId: likeId }).then(() => {
        setLikeId(null);
      });
    }
  };

  const renderActions = () => {
    if (user.loggedIn && user.username === itemDetails.username) {
      return (
        <div className={classes.actions}>
          <Button
            variant="contained"
            color="primary"
            size="medium"
            startIcon={<EditIcon />}
            component={AdapterLink}
            to={`/${itemType}/edit/${itemId}`}
          >
            Edit
          </Button>
          <span className={classes.separator} />
          <Button
            variant="contained"
            color="secondary"
            size="medium"
            startIcon={<DeleteIcon />}
            onClick={renderDeleteConfirmation}
          >
            Delete
          </Button>
        </div>
      );
    } else if (user.loggedIn && user.username !== itemDetails.username) {
      return (
        <div className={classes.actions}>
          <Button
            variant={likeId !== null ? "contained" : "outlined"}
            color="primary"
            size="medium"
            startIcon={<ThumbUpAltIcon />}
            onClick={toggleLike}
          >
            Like
          </Button>
        </div>
      );
    }
    return null;
  };

  const renderMainFieldComponent = () => {
    if (itemType === NOTES) {
      return (
        <SimpleMDE
          getMdeInstance={getIntance}
          value={itemDetails.body}
          options={{ toolbar: false }}
          className={classes.simpleMde}
        />
      );
    } else if (itemType === LINKS) {
      return (
        <Link target="_blank" href={itemDetails.link} className={classes.link}>
          Follow the link
        </Link>
      );
    }
  };

  const renderItem = () => {
    if (itemDetails) {
      return (
        <div className={classes.root}>
          <div className={classes.meta}>
            <Grid container alignItems="center">
              <Grid item xs>
                <Typography className={classes.title} variant="h4">
                  {itemDetails.title}
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
                            {itemDetails.username}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {itemDetails.date_modified}
                          </Typography>
                        </Grid>
                      </Grid>
                      {renderPrivate()}
                    </Grid>
                  </Grid>

                  <div>
                    {itemDetails.subjects.map(subject => (
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

          <div className={classes.body}>{renderMainFieldComponent()}</div>

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
      {renderItem()}
      <Modal open={modalOpen} title="Confirmation" onClose={handleModalClose}>
        <ItemDelete
          onClose={handleModalClose}
          itemId={itemId}
          itemType={itemType}
        />
      </Modal>
    </React.Fragment>
  );
}

import React from "react";
import InfiniteScroll from "react-infinite-scroller";
import { connect } from "react-redux";
import List from "@material-ui/core/List";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import NoteIcon from "@material-ui/icons/Note";
import LinkIcon from "@material-ui/icons/Link";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";

import { getMoreNotes, getMoreLinks } from "../../actions";
import { LINKS, NOTES } from "../../constants";
import history from "../../history";

const useStyles = makeStyles(theme => ({
  loader: {
    textAlign: "center"
  },
  likes: {
    textAlign: "center",
    fontSize: "small"
  },
  listItem: {
    minWidth: theme.spacing(4)
  }
}));

function SearchResults({ getMoreNotes, getMoreLinks, notes, links, filters }) {
  const classes = useStyles();

  const handleItemClick = (event, id) => {
    history.push(`${filters.type}/${id}`);
  };

  const renderNotes = () => {
    if (notes.results) {
      return notes.results.map(note => (
        <ListItem key={note.id} dense={true} button={true}>
          <ListItemAvatar className={classes.listItem}>
            <NoteIcon fontSize="small" />
          </ListItemAvatar>
          <ListItemText
            onClick={event => handleItemClick(event, note.id)}
            primary={note.title}
            secondary={`${note.user} | ${note.date_modified}`}
          />
          <ListItemSecondaryAction>
            <IconButton edge="end" size="small">
              <ThumbUpIcon fontSize="small" />
            </IconButton>
            <div className={classes.likes}>{note.likes_count}</div>
          </ListItemSecondaryAction>
        </ListItem>
      ));
    } else {
      return [];
    }
  };

  const renderLinks = () => {
    if (links.results) {
      return links.results.map(link => (
        <ListItem key={link.id} dense={true} button={true}>
          <ListItemAvatar className={classes.listItem}>
            <LinkIcon fontSize="small" />
          </ListItemAvatar>
          <ListItemText
            onClick={event => handleItemClick(event, link.id)}
            primary={link.title}
            secondary={`${link.user} | ${link.date_modified}`}
          />
          <ListItemSecondaryAction>
            <IconButton edge="end" size="small">
              <ThumbUpIcon fontSize="small" />
            </IconButton>
            <div className={classes.likes}>{link.likes_count}</div>
          </ListItemSecondaryAction>
        </ListItem>
      ));
    } else {
      return [];
    }
  };

  const renderResults = () => {
    if (filters.type === NOTES) {
      return renderNotes();
    } else if (filters.type === LINKS) {
      return renderLinks();
    }
  };

  const loadMoreItems = () => {
    if (filters.type === NOTES) {
      return getMoreNotes(notes.next);
    } else if (filters.type === LINKS) {
      return getMoreLinks(links.next);
    }
  };

  const loader = (
    <div className={classes.loader}>
      <CircularProgress />
    </div>
  );

  const hasMoreItems = () => {
    if (filters.type === NOTES) {
      return notes.results && notes.count > notes.results.length;
    } else if (filters.type === LINKS) {
      return links.results && links.count > links.results.length;
    }
  };

  return (
    <InfiniteScroll
      pageStart={0}
      loadMore={loadMoreItems}
      hasMore={hasMoreItems()}
      loader={loader}
    >
      <List>{renderResults()}</List>
    </InfiniteScroll>
  );
}

const mapStateToProps = state => {
  return {
    notes: state.notes,
    links: state.links,
    filters: state.filters
  };
};

export default connect(
  mapStateToProps,
  { getMoreNotes, getMoreLinks }
)(SearchResults);

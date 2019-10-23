import React, { useEffect } from "react";
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
import Avatar from "@material-ui/core/Avatar";
import NoteIcon from "@material-ui/icons/Note";
import LinkIcon from "@material-ui/icons/Link";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";

import { getMoreNotes, getMoreLinks, getNotes, getLinks } from "../../actions";
import { LINK, NOTE } from "../../constants";

const useStyles = makeStyles(theme => ({
  loader: {
    textAlign: "center"
  },
  likes: {
    textAlign: "center",
    fontSize: "small"
  }
}));

function SearchResults({
  getMoreNotes,
  getMoreLinks,
  getNotes,
  getLinks,
  notes,
  links,
  filters
}) {
  const classes = useStyles();

  useEffect(() => {
    if (filters.type === NOTE) {
      getNotes({ filters });
    } else if (filters.type === LINK) {
      getLinks({ filters });
    }
  }, [filters]);

  const renderNotes = () => {
    if (notes.results) {
      return notes.results.map(note => (
        <ListItem key={note.id} dense={true} button={true}>
          <ListItemAvatar>
            <Avatar>
              <NoteIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
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
          <ListItemAvatar>
            <Avatar>
              <LinkIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
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
    if (filters.type === NOTE) {
      return renderNotes();
    } else if (filters.type === LINK) {
      return renderLinks();
    }
  };

  const loadMoreItems = () => {
    if (filters.type === NOTE) {
      return getMoreNotes(notes.next);
    } else if (filters.type === LINK) {
      return getMoreLinks(links.next);
    }
  };

  const loader = (
    <div className={classes.loader}>
      <CircularProgress />
    </div>
  );

  const hasMoreItems = () => {
    if (filters.type === NOTE) {
      return notes.results && notes.count > notes.results.length;
    } else if (filters.type === LINK) {
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
  { getMoreNotes, getMoreLinks, getNotes, getLinks }
)(SearchResults);

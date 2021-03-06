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

import { getMoreItems } from "../../actions";
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

function SearchResults({
  getMoreItems,
  items,
  filters,
  users,
  itemsNext,
  itemsCount
}) {
  const classes = useStyles();

  const handleItemClick = (event, id) => {
    history.push(`${filters.type}/${id}`);
  };

  const renderItems = () => {
    if (items.allIds) {
      return items.allIds.map(itemId => {
        const item = items.byId[itemId];
        const username = users.byId[item.author].username;
        return (
          <ListItem key={itemId} dense={true} button={true}>
            <ListItemAvatar className={classes.listItem}>
              {renderItemIcon()}
            </ListItemAvatar>
            <ListItemText
              onClick={event => handleItemClick(event, itemId)}
              primary={item.title}
              secondary={`${username} | ${item.date_modified}`}
            />
            <ListItemSecondaryAction>
              <IconButton edge="end" size="small">
                <ThumbUpIcon fontSize="small" />
              </IconButton>
              <div className={classes.likes}>{item.likes_count}</div>
            </ListItemSecondaryAction>
          </ListItem>
        );
      });
    } else {
      return [];
    }
  };

  const renderItemIcon = () => {
    if (filters.type === NOTES) {
      return <NoteIcon fontSize="small" />;
    } else if (filters.type === LINKS) {
      return <LinkIcon fontSize="small" />;
    }
  };

  const loadMoreItems = () => {
    return getMoreItems(itemsNext);
  };

  const loader = (
    <div className={classes.loader}>
      <CircularProgress />
    </div>
  );

  const hasMoreItems = () => {
    return items.allIds && itemsCount > items.allIds.length;
  };

  return (
    <InfiniteScroll
      pageStart={0}
      loadMore={loadMoreItems}
      hasMore={hasMoreItems()}
      loader={loader}
    >
      <List>{renderItems()}</List>
    </InfiniteScroll>
  );
}

const mapStateToProps = state => {
  return {
    items: state.items,
    filters: state.filters,
    users: state.users,
    itemsNext: state.itemsMeta.next,
    itemsCount: state.itemsMeta.count
  };
};

export default connect(
  mapStateToProps,
  { getMoreItems }
)(SearchResults);

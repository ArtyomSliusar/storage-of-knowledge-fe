import React, { useEffect, useState } from "react";
import { makeStyles, useTheme } from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery/useMediaQuery";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";
import Badge from "@material-ui/core/Badge";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";

import history from "../history";
import {
  changeItemsDisplay,
  getItems,
  initializeItems,
  setRefreshNeeded
} from "../actions";
import SearchBar from "./SearchBar";
import MobileResults from "./mobile/SearchResults";
import WebResults from "./web/SearchResults";
import Modal from "./Modal";
import AvailableFilters from "./AvailableFilters";
import { getFilterTypeSingular } from "../utils/otherUtils";
import { defaultState } from "../store";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexFlow: "row wrap",
    justifyContent: "center",
    height: "100%"
  },
  controlPanel: {
    display: "flex",
    flexFlow: "row wrap",
    width: "100%",
    justifyContent: "center",
    [theme.breakpoints.down("xs")]: {
      height: "20%"
    },
    [theme.breakpoints.between("sm", "md")]: {
      height: "15%"
    },
    [theme.breakpoints.up("md")]: {
      height: "10%"
    }
  },
  results: {
    flex: "1 0 auto",
    width: "100%",
    [theme.breakpoints.down("xs")]: {
      height: "80%"
    },
    [theme.breakpoints.between("sm", "md")]: {
      height: "85%"
    },
    [theme.breakpoints.up("md")]: {
      height: "90%"
    }
  },
  search: {
    [theme.breakpoints.down("xs")]: {
      flex: "1 0 100%"
    },
    [theme.breakpoints.between("sm", "md")]: {
      marginRight: theme.spacing(3),
      marginLeft: "auto"
    },
    [theme.breakpoints.up("md")]: {
      marginRight: theme.spacing(3),
      marginLeft: "auto",
      width: 400
    }
  },
  filter: {
    [theme.breakpoints.up("sm")]: {
      marginRight: "auto"
    }
  },
  mobileAdd: {
    position: "fixed",
    zIndex: 1,
    bottom: theme.spacing(2),
    right: theme.spacing(2)
  }
}));

function Home({
  filters,
  loggedIn,
  initializeItems,
  itemsInitialized,
  refreshNeeded,
  changeItemsDisplay,
  setRefreshNeeded,
  getItems,
  location
}) {
  const theme = useTheme();
  const classes = useStyles();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
  const filtersCount = filters.subjects.length;
  const [modalOpen, setModalOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // download items only on first start OR refresh
    if (refreshNeeded) {
      handleRefresh();
    } else if (!itemsInitialized) {
      downloadItems();
      initializeItems();
    }
  }, [location.key]);

  const downloadItems = () => {
    getItems(searchQuery, filters.type);
    if (!isMobile) {
      changeItemsDisplay({ page: 0 });
    }
  };

  const handleRefresh = () => {
    setSearchQuery("");
    if (isMobile) {
      downloadItems();
    } else {
      downloadItems();
      changeItemsDisplay(defaultState.itemsMeta.display);
    }
    setRefreshNeeded(false);
  };

  const handleSearchRequest = () => {
    changeItemsDisplay({ orderBy: "" });
    downloadItems();
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const callbackOnModalApply = () => {
    handleModalClose();
    setSearchQuery("");
  };

  const handleFiltersClick = () => {
    if (isMobile) {
      history.push("/filters");
    } else {
      setModalOpen(true);
    }
  };

  const handleAddClick = () => {
    history.push(`${filters.type}/new`);
  };

  const renderAddItem = () => {
    if (loggedIn && isMobile) {
      return (
        <Fab
          aria-label="Add"
          className={classes.mobileAdd}
          color="primary"
          onClick={handleAddClick}
        >
          <AddIcon />
        </Fab>
      );
    } else if (loggedIn && !isMobile) {
      return (
        <div>
          <Button
            startIcon={<AddIcon />}
            size="medium"
            variant="contained"
            color="primary"
            onClick={handleAddClick}
          >
            {getFilterTypeSingular()}
          </Button>
        </div>
      );
    } else {
      return null;
    }
  };

  return (
    <div className={classes.root}>
      <div className={classes.controlPanel}>
        <div className={classes.search}>
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleSearchRequest={handleSearchRequest}
          />
        </div>

        <div className={classes.filter}>
          <Badge color="secondary" badgeContent={filtersCount}>
            <Button
              variant="contained"
              color="primary"
              size="medium"
              onClick={handleFiltersClick}
            >
              Filters
            </Button>
          </Badge>
        </div>

        {renderAddItem()}
      </div>

      <div className={classes.results}>
        {isMobile ? (
          <MobileResults />
        ) : (
          <WebResults downloadItems={downloadItems} />
        )}
      </div>

      <Modal open={modalOpen} onClose={handleModalClose}>
        <AvailableFilters
          onCancel={handleModalClose}
          onApplyCallback={callbackOnModalApply}
        />
      </Modal>
    </div>
  );
}

const mapStateToProps = (state, ownProps) => {
  return {
    filters: state.filters,
    itemsInitialized: state.itemsMeta.initialized,
    refreshNeeded: state.itemsMeta.refreshNeeded,
    loggedIn: state.auth.user.loggedIn,
    ...ownProps
  };
};

export default connect(
  mapStateToProps,
  { getItems, initializeItems, changeItemsDisplay, setRefreshNeeded }
)(Home);

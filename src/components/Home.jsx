import React, { useEffect, useState } from "react";
import { makeStyles, useTheme } from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery/useMediaQuery";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";
import Badge from "@material-ui/core/Badge";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";

import history from "../history";
import { getLinks, getNotes } from "../actions";
import SearchBar from "./SearchBar";
import MobileResults from "./mobile/SearchResults";
import WebResults from "./web/SearchResults";
import Modal from "./Modal";
import AvailableFilters from "./AvailableFilters";
import { LINKS, NOTES } from "../constants";
import { getFilterTypeSingular } from "../utils/otherUtils";

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
    height: "20%",
    width: "100%",
    justifyContent: "center",
    [theme.breakpoints.up("sm")]: {
      height: "8%"
    }
  },
  search: {
    [theme.breakpoints.up("sm")]: {
      marginRight: theme.spacing(3),
      marginLeft: "auto",
      width: 400
    },
    [theme.breakpoints.down("xs")]: {
      flex: "1 0 100%"
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
  },
  results: {
    flex: "1 0 auto",
    width: "100%",
    height: "80%",
    [theme.breakpoints.up("sm")]: {
      height: "92%"
    }
  }
}));

function Home({ filters, loggedIn, getNotes, getLinks }) {
  const theme = useTheme();
  const classes = useStyles();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
  const filtersCount = filters.subjects.length;
  const [modalOpen, setModalOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("title");
  const [rowsPerPage, setRowsPerPage] = React.useState(15);
  const [page, setPage] = React.useState(0);

  const downloadItems = () => {
    if (filters.type === NOTES) {
      getNotes({
        filters,
        orderBy,
        order,
        limit: rowsPerPage,
        search: searchQuery
      });
    } else if (filters.type === LINKS) {
      getLinks({
        filters,
        orderBy,
        order,
        limit: rowsPerPage,
        search: searchQuery
      });
    }
    setPage(0);
  };

  useEffect(() => {
    downloadItems();
  }, [filters, orderBy, order, rowsPerPage, loggedIn]);

  const handleSearchRequest = event => {
    // remove ordering and initiate its value change, in order for useEffect
    // to be called
    setOrderBy(orderBy === "" ? null : "");
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
          <WebResults
            page={page}
            order={order}
            orderBy={orderBy}
            rowsPerPage={rowsPerPage}
            setPage={setPage}
            setOrder={setOrder}
            setOrderBy={setOrderBy}
            setRowsPerPage={setRowsPerPage}
          />
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

const mapStateToProps = state => {
  return {
    filters: state.filters,
    loggedIn: state.auth.user.loggedIn
  };
};

export default connect(
  mapStateToProps,
  { getNotes, getLinks }
)(Home);

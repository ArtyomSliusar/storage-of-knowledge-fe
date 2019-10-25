import React, { useEffect, useState } from "react";
import { makeStyles, useTheme } from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery/useMediaQuery";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";

import SearchBar from "./SearchBar";
import MobileResults from "./mobile/SearchResults";
import WebResults from "./web/SearchResults";
import AdapterLink from "./AdapterLink";
import Modal from "./Modal";
import AvailableFilters from "./AvailableFilters";
import { LINK, NOTE } from "../constants";
import { getLinks, getNotes } from "../actions";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexFlow: "row wrap",
    justifyContent: "center"
  },
  search: {
    [theme.breakpoints.up("sm")]: {
      marginRight: theme.spacing(3),
      width: 400
    },
    [theme.breakpoints.down("xs")]: {
      flex: "1 0 100%"
    }
  },
  filter: {
    [theme.breakpoints.down("xs")]: {
      margin: theme.spacing(2, 0)
    }
  },
  results: {
    flex: "1 0 100%"
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
    if (filters.type === NOTE) {
      getNotes({
        filters,
        orderBy,
        order,
        limit: rowsPerPage,
        search: searchQuery
      });
    } else if (filters.type === LINK) {
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

  return (
    <div className={classes.root}>
      <div className={classes.search}>
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearchRequest={handleSearchRequest}
        />
      </div>

      <div className={classes.filter}>
        {isMobile ? (
          <Button
            variant="contained"
            color="primary"
            size="medium"
            component={AdapterLink}
            to="/filters"
          >
            {`Filters ${filtersCount ? "(" + filtersCount + ")" : ""}`}
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            size="medium"
            onClick={() => setModalOpen(true)}
          >
            {`Filters ${filtersCount ? "(" + filtersCount + ")" : ""}`}
          </Button>
        )}
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

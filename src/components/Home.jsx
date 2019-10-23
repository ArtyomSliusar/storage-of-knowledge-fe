import React from "react";
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

function Home({ filters }) {
  const theme = useTheme();
  const classes = useStyles();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
  const filtersCount = filters.subjects.length;
  const [modalOpen, setModalOpen] = React.useState(false);

  return (
    <div className={classes.root}>
      <div className={classes.search}>
        <SearchBar />
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
        {isMobile ? <MobileResults /> : <WebResults />}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <AvailableFilters
          onCancel={() => setModalOpen(false)}
          afterApply={() => setModalOpen(false)}
        />
      </Modal>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    filters: state.filters
  };
};

export default connect(
  mapStateToProps,
  {}
)(Home);

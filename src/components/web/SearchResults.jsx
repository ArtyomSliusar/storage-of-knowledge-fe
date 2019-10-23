import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableFooter from "@material-ui/core/TableFooter";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import CircularProgress from "@material-ui/core/CircularProgress";
import { connect } from "react-redux";

import { getMoreNotes, getMoreLinks, getNotes, getLinks } from "../../actions";
import CustomTableHead from "../CustomTableHead";
import TablePaginationActions from "../TablePaginationActions";
import { LINK, NOTE } from "../../constants";

const headCells = [
  {
    id: "title",
    align: "left",
    label: "Title",
    isSortable: true
  },
  { id: "subjects", align: "right", label: "Subjects", isSortable: false },
  { id: "user", align: "right", label: "User", isSortable: true },
  { id: "likes_count", align: "right", label: "Likes", isSortable: true },
  {
    id: "date_modified",
    align: "right",
    label: "Last update",
    isSortable: true
  }
];

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(3)
  },
  table: {
    minWidth: 500
  },
  tableWrapper: {
    overflowX: "auto"
  }
}));

function SearchResults(props) {
  const {
    notes,
    links,
    filters,
    getNotes,
    getLinks,
    getMoreNotes,
    getMoreLinks,
    loggedIn
  } = props;
  const classes = useStyles();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("title");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(15);

  useEffect(() => {
    if (filters.type === NOTE) {
      getNotes({ filters, orderBy, order, limit: rowsPerPage });
    } else if (filters.type === LINK) {
      getLinks({ filters, orderBy, order, limit: rowsPerPage });
    }
    setPage(0);
  }, [filters, orderBy, order, rowsPerPage, loggedIn]);

  const handleRequestSort = (event, property) => {
    const isDesc = orderBy === property && order === "desc";
    setOrder(isDesc ? "asc" : "desc");
    setOrderBy(property);
  };

  const handleClick = (event, name) => {
    // TODO: redirect to item's page
    console.log(`open item ${name}`);
  };

  const handleChangePage = (event, newPage) => {
    const requestedItems = newPage * rowsPerPage + rowsPerPage;

    if (filters.type === NOTE && notes.results.length < requestedItems) {
      getMoreNotes(notes.next);
    } else if (filters.type === LINK && links.results.length < requestedItems) {
      getMoreLinks(links.next);
    }

    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const renderTable = () => {
    let items = {};
    if (filters.type === NOTE) {
      items = notes;
    } else if (filters.type === LINK) {
      items = links;
    }
    if (items.results) {
      return (
        <Table className={classes.table} aria-label="results table">
          <CustomTableHead
            classes={classes}
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
            headCells={headCells}
          />
          <TableBody>
            {items.results
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map(item => (
                <TableRow
                  key={item.id}
                  hover
                  onClick={event => handleClick(event, item.id)}
                >
                  <TableCell component="th" scope="row">
                    {item.title}
                  </TableCell>
                  <TableCell align="right">{item.subjects}</TableCell>
                  <TableCell align="right">{item.user}</TableCell>
                  <TableCell align="right">{item.likes_count}</TableCell>
                  <TableCell align="right">{item.date_modified}</TableCell>
                </TableRow>
              ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[15, 25, 50]}
                colSpan={headCells.length}
                count={items.count || 0}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: { "aria-label": "rows per page" },
                  native: true
                }}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      );
    } else {
      return null;
    }
  };

  return (
    <Paper className={classes.root}>
      <div className={classes.tableWrapper}>
        {renderTable() || <CircularProgress />}
      </div>
    </Paper>
  );
}

const mapStateToProps = state => {
  return {
    notes: state.notes,
    links: state.links,
    filters: state.filters,
    loggedIn: state.auth.user.loggedIn
  };
};

export default connect(
  mapStateToProps,
  { getMoreNotes, getMoreLinks, getNotes, getLinks }
)(SearchResults);

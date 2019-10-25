import React from "react";
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

import { getMoreNotes, getMoreLinks } from "../../actions";
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

function SearchResults({
  notes,
  links,
  filters,
  getMoreNotes,
  getMoreLinks,
  page,
  order,
  orderBy,
  rowsPerPage,
  setPage,
  setOrder,
  setOrderBy,
  setRowsPerPage
}) {
  const classes = useStyles();

  const handleRowClick = (event, name) => {
    // TODO: redirect to item's page
    console.log(`open item ${name}`);
  };

  const handleSortChange = (event, property) => {
    const isDesc = orderBy === property && order === "desc";
    setOrder(isDesc ? "asc" : "desc");
    setOrderBy(property);
    setPage(0);
  };

  const handleRowsPerPageChange = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handlePageChange = (event, newPage) => {
    const requestedItems = newPage * rowsPerPage + rowsPerPage;

    if (filters.type === NOTE && notes.results.length < requestedItems) {
      getMoreNotes(notes.next);
    } else if (filters.type === LINK && links.results.length < requestedItems) {
      getMoreLinks(links.next);
    }

    setPage(newPage);
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
            onRequestSort={handleSortChange}
            headCells={headCells}
          />
          <TableBody>
            {items.results
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map(item => (
                <TableRow
                  key={item.id}
                  hover
                  onClick={event => handleRowClick(event, item.id)}
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
                onChangePage={handlePageChange}
                onChangeRowsPerPage={handleRowsPerPageChange}
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

const mapStateToProps = (state, ownProps) => {
  return {
    notes: state.notes,
    links: state.links,
    filters: state.filters,
    ...ownProps
  };
};

export default connect(
  mapStateToProps,
  { getMoreNotes, getMoreLinks }
)(SearchResults);
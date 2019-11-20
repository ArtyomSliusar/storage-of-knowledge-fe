import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import CircularProgress from "@material-ui/core/CircularProgress";
import { connect } from "react-redux";

import { getMoreItems, changeItemsDisplay } from "../../actions";
import CustomTableHead from "../CustomTableHead";
import TablePaginationActions from "../TablePaginationActions";
import { LINKS, NOTES } from "../../constants";
import NoteIcon from "@material-ui/icons/Note";
import LinkIcon from "@material-ui/icons/Link";
import history from "../../history";

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
    display: "flex",
    height: "100%",
    justifyContent: "center"
  },
  wrapper: {
    flex: 1,
    display: "flex",
    flexDirection: "column"
  },
  tableWrapper: {
    overflowY: "auto",
    flex: 2
  },
  table: {
    minWidth: 500,
    "& tbody tr": {
      cursor: "pointer"
    }
  },
  tableFooter: {
    flex: 0.15,
    "& > *": {
      height: "100%"
    }
  },
  itemIcon: {
    marginRight: theme.spacing(1)
  }
}));

function SearchResults({
  items,
  filters,
  itemsMeta,
  users,
  subjects,
  getMoreItems,
  changeItemsDisplay,
  downloadItems
}) {
  const classes = useStyles();
  const { orderBy, order, limit, page } = itemsMeta.display;
  const [justMounted, setJustMounted] = useState(true);

  useEffect(() => {
    // download items only on dependencies update
    if (!justMounted) {
      downloadItems();
    }
    setJustMounted(false);
  }, [filters, orderBy, order, limit]);

  const handleRowClick = (event, id) => {
    history.push(`${filters.type}/${id}`);
  };

  const handleSortChange = (event, property) => {
    const isDesc = orderBy === property && order === "desc";
    changeItemsDisplay({
      order: isDesc ? "asc" : "desc",
      orderBy: property,
      page: 0
    });
  };

  const handleRowsPerPageChange = event => {
    changeItemsDisplay({ limit: parseInt(event.target.value, 10), page: 0 });
  };

  const handlePageChange = (event, newPage) => {
    const requestedItems = newPage * limit + limit;

    if (items.allIds.length < requestedItems) {
      getMoreItems(itemsMeta.next);
    }

    changeItemsDisplay({ page: newPage });
  };

  const renderTable = () => {
    let icon;
    if (filters.type === NOTES) {
      icon = <NoteIcon fontSize="small" className={classes.itemIcon} />;
    } else if (filters.type === LINKS) {
      icon = <LinkIcon fontSize="small" className={classes.itemIcon} />;
    }
    if (items.allIds) {
      return (
        <div className={classes.wrapper}>
          <div className={classes.tableWrapper}>
            <Table
              stickyHeader
              className={classes.table}
              aria-label="results table"
            >
              <CustomTableHead
                classes={classes}
                order={order}
                orderBy={orderBy}
                onRequestSort={handleSortChange}
                headCells={headCells}
              />
              <TableBody>
                {items.allIds
                  .slice(page * limit, page * limit + limit)
                  .map(itemId => {
                    const item = items.byId[itemId];
                    const username = users.byId[item.author].username;
                    const itemSubjects = item.subjects.map(
                      id => subjects.byId[id].name
                    );
                    return (
                      <TableRow
                        key={itemId}
                        hover
                        onClick={event => handleRowClick(event, itemId)}
                      >
                        <TableCell align="left">
                          {icon}
                          {item.title}
                        </TableCell>
                        <TableCell align="right">
                          {itemSubjects.join(" | ")}
                        </TableCell>
                        <TableCell align="right">{username}</TableCell>
                        <TableCell align="right">{item.likes_count}</TableCell>
                        <TableCell align="right">
                          {item.date_modified}
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </div>
          <TablePagination
            className={classes.tableFooter}
            component="div"
            rowsPerPageOptions={[15, 25, 50]}
            colSpan={headCells.length}
            count={itemsMeta.count || 0}
            rowsPerPage={limit}
            page={page}
            SelectProps={{
              inputProps: { "aria-label": "rows per page" },
              native: true
            }}
            onChangePage={handlePageChange}
            onChangeRowsPerPage={handleRowsPerPageChange}
            ActionsComponent={TablePaginationActions}
          />
        </div>
      );
    } else {
      return <CircularProgress />;
    }
  };

  return <Paper className={classes.root}>{renderTable()}</Paper>;
}

const mapStateToProps = (state, ownProps) => {
  return {
    items: state.items,
    filters: state.filters,
    itemsMeta: state.itemsMeta,
    users: state.users,
    subjects: state.subjects,
    ...ownProps
  };
};

export default connect(
  mapStateToProps,
  { getMoreItems, changeItemsDisplay }
)(SearchResults);

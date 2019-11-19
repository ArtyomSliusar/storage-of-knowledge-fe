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

import { getMoreNotes, getMoreLinks, changeItemsDisplay } from "../../actions";
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
  notes,
  links,
  filters,
  itemsDisplay,
  getMoreNotes,
  getMoreLinks,
  changeItemsDisplay,
  downloadItems
}) {
  const classes = useStyles();
  const { orderBy, order, limit, page } = itemsDisplay;
  const [justMounted, setJustMounted] = useState(true);

  useEffect(() => {
    // download items only on dependencies update
    if (!justMounted) {
      console.log("web results useEffect");
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

    if (filters.type === NOTES && notes.results.length < requestedItems) {
      getMoreNotes(notes.next);
    } else if (
      filters.type === LINKS &&
      links.results.length < requestedItems
    ) {
      getMoreLinks(links.next);
    }

    changeItemsDisplay({ page: newPage });
  };

  const renderTable = () => {
    let items = {};
    let icon;
    if (filters.type === NOTES) {
      items = notes;
      icon = <NoteIcon fontSize="small" className={classes.itemIcon} />;
    } else if (filters.type === LINKS) {
      items = links;
      icon = <LinkIcon fontSize="small" className={classes.itemIcon} />;
    }
    if (items.results) {
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
                {items.results
                  .slice(page * limit, page * limit + limit)
                  .map(item => (
                    <TableRow
                      key={item.id}
                      hover
                      onClick={event => handleRowClick(event, item.id)}
                    >
                      <TableCell align="left">
                        {icon}
                        {item.title}
                      </TableCell>
                      <TableCell align="right">
                        {item.subjects.join(" | ")}
                      </TableCell>
                      <TableCell align="right">{item.user}</TableCell>
                      <TableCell align="right">{item.likes_count}</TableCell>
                      <TableCell align="right">{item.date_modified}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
          <TablePagination
            className={classes.tableFooter}
            component="div"
            rowsPerPageOptions={[15, 25, 50]}
            colSpan={headCells.length}
            count={items.count || 0}
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
    notes: state.notes,
    links: state.links,
    filters: state.filters,
    itemsDisplay: state.itemsMeta.display,
    ...ownProps
  };
};

export default connect(
  mapStateToProps,
  { getMoreNotes, getMoreLinks, changeItemsDisplay }
)(SearchResults);

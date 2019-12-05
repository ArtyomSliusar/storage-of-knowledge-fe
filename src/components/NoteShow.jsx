import React from "react";
import { connect } from "react-redux";
import "easymde/dist/easymde.min.css";
import { NOTES } from "../constants";
import ItemShow from "./ItemShow";

function NoteShow({ noteId }) {
  return <ItemShow itemId={noteId} itemType={NOTES} />;
}

const mapStateToProps = (state, ownProps) => {
  return {
    noteId: ownProps.match.params.id,
    ...ownProps
  };
};

export default connect(
  mapStateToProps,
  {}
)(NoteShow);

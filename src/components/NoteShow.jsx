import React from "react";
import { connect } from "react-redux";
import "easymde/dist/easymde.min.css";

import { getNote } from "../actions";
import { NOTES } from "../constants";
import ItemShow from "./ItemShow";

function NoteShow({ getNote, noteId, noteDetails, user }) {
  return (
    <ItemShow
      getItem={getNote}
      itemId={noteId}
      itemDetails={noteDetails}
      itemType={NOTES}
      user={user}
    />
  );
}

const mapStateToProps = (state, ownProps) => {
  return {
    noteDetails: state.notes.noteDetails,
    noteId: ownProps.match.params.id,
    user: state.auth.user,
    ...ownProps
  };
};

export default connect(
  mapStateToProps,
  { getNote }
)(NoteShow);

import React from "react";
import ItemDelete from "../ItemDelete";
import history from "../../history";
import { NOTES } from "../../constants";

export default function NoteDelete(props) {
  const noteId = props.match.params.id;
  return (
    <ItemDelete onClose={history.goBack} itemId={noteId} itemType={NOTES} />
  );
}

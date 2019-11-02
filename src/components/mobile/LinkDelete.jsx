import React from "react";
import ItemDelete from "../ItemDelete";
import history from "../../history";
import { LINKS } from "../../constants";

export default function LinkDelete(props) {
  const linkId = props.match.params.id;
  return (
    <ItemDelete onClose={history.goBack} itemId={linkId} itemType={LINKS} />
  );
}

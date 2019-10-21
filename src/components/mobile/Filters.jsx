import React from "react";
import AvailableFilters from "../AvailableFilters";
import history from "../../history";

export default function Filters() {
  return (
    <AvailableFilters onCancel={history.goBack} afterApply={history.goBack} />
  );
}

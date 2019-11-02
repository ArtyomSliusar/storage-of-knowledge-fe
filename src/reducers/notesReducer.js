import * as _ from "lodash";

import {
  DELETE_NOTE,
  GET_MORE_NOTES,
  GET_NOTE_DETAILS,
  GET_NOTES,
  UPDATE_NOTE
} from "../constants";

export default (state = {}, action) => {
  switch (action.type) {
    case GET_NOTES:
      return action.payload.data;
    case GET_MORE_NOTES:
      return {
        ...action.payload.data,
        results: [...state.results, ...action.payload.data.results]
      };
    case GET_NOTE_DETAILS:
      return {
        ...state,
        noteDetails: action.payload.data
      };
    case UPDATE_NOTE:
      return {
        ...state,
        noteDetails: action.payload.data
      };
    case DELETE_NOTE:
      return {
        ..._.omit(state, "noteDetails")
      };
    default:
      return state;
  }
};

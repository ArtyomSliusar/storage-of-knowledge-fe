import {
  GET_LINKS,
  GET_MORE_LINKS,
  GET_LINK_DETAILS,
  DELETE_LINK,
  UPDATE_LINK
} from "../constants";
import * as _ from "lodash";

export default (state = {}, action) => {
  switch (action.type) {
    case GET_LINKS:
      return action.payload.data;
    case GET_MORE_LINKS:
      return {
        ...action.payload.data,
        results: [...state.results, ...action.payload.data.results]
      };
    case GET_LINK_DETAILS:
      return {
        ...state,
        linkDetails: action.payload.data
      };
    case UPDATE_LINK:
      return {
        ...state,
        linkDetails: action.payload.data
      };
    case DELETE_LINK:
      return {
        ..._.omit(state, "linkDetails")
      };
    default:
      return state;
  }
};

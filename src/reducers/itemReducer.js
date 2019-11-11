import {
  GET_ITEM_DETAILS,
  UPDATE_ITEM,
  DELETE_ITEM,
  ADD_ITEM_LIKE,
  DELETE_ITEM_LIKE,
  GET_ITEM_COMMENTS,
  DELETE_ITEM_COMMENT,
  ADD_ITEM_COMMENT
} from "../constants";
import * as _ from "lodash";

export default (state = {}, action) => {
  switch (action.type) {
    case GET_ITEM_DETAILS:
      return {
        ...state,
        details: action.payload.data
      };
    case GET_ITEM_COMMENTS:
      return {
        ...state,
        comments: action.payload.data
      };
    case UPDATE_ITEM:
      return {
        ...state,
        details: action.payload.data
      };
    case DELETE_ITEM:
      return {};
    case ADD_ITEM_LIKE:
      return {
        ...state,
        like: action.payload.data
      };
    case ADD_ITEM_COMMENT:
      return {
        ...state,
        comments: null // refresh tree structure needed
      };
    case DELETE_ITEM_LIKE:
      return _.omit(state, "like");
    case DELETE_ITEM_COMMENT:
      return {
        ...state,
        comments: null // refresh tree structure needed
      };
    default:
      return state;
  }
};

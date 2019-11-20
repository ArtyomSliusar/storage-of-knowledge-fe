import {
  GET_ITEM_DETAILS,
  DELETE_ITEM,
  ADD_ITEM_LIKE,
  DELETE_ITEM_LIKE,
  GET_ITEM_COMMENTS,
  DELETE_ITEM_COMMENT,
  ADD_ITEM_COMMENT,
  GET_ITEM_LIKE
} from "../constants";
import * as _ from "lodash";

export default (state = {}, action) => {
  switch (action.type) {
    case GET_ITEM_DETAILS:
      return {
        ...state,
        details: action.payload.details
      };
    case GET_ITEM_COMMENTS:
      return {
        ...state,
        comments: action.payload.data
      };
    case DELETE_ITEM:
      return {};
    case GET_ITEM_LIKE:
      if (action.payload.data.length > 0) {
        return {
          ...state,
          like: action.payload.data[0] // with user filter we should have only one like per item
        };
      } else {
        return _.omit(state, "like");
      }
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

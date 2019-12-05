import {
  GET_ITEM_DETAILS,
  GET_ITEMS,
  GET_MORE_ITEMS,
  GET_USER
} from "../constants";
import { combineReducers } from "redux";

function usersById(state = {}, action) {
  switch (action.type) {
    case GET_USER:
    case GET_ITEMS:
    case GET_MORE_ITEMS:
    case GET_ITEM_DETAILS:
      return {
        ...state,
        ...action.payload.users
      };
    default:
      return state;
  }
}

export default combineReducers({
  byId: usersById
});

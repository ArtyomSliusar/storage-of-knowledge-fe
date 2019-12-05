import {
  GET_ITEM_DETAILS,
  GET_ITEMS,
  GET_MORE_ITEMS,
  GET_SUBJECTS
} from "../constants";
import { combineReducers } from "redux";

function subjectsById(state = {}, action) {
  switch (action.type) {
    case GET_SUBJECTS:
      return action.payload.byId || {};
    case GET_ITEMS:
    case GET_MORE_ITEMS:
    case GET_ITEM_DETAILS:
      return {
        ...state,
        ...action.payload.subjects
      };
    default:
      return state;
  }
}

function allSubjects(state = [], action) {
  switch (action.type) {
    case GET_SUBJECTS:
      return action.payload.allIds;
    default:
      return state;
  }
}

export default combineReducers({
  byId: subjectsById,
  allIds: allSubjects
});

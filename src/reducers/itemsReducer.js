import * as _ from "lodash";

import {
  GET_MORE_ITEMS,
  GET_ITEMS,
  UPDATE_ITEM,
  ADD_ITEM_LIKE,
  DELETE_ITEM_LIKE
} from "../constants";
import { combineReducers } from "redux";

function itemsById(state = {}, action) {
  switch (action.type) {
    case GET_ITEMS:
      return action.payload.byId || {};
    case GET_MORE_ITEMS:
      return {
        ...state,
        ...action.payload.byId
      };
    case ADD_ITEM_LIKE:
      if (state[action.payload.itemId]) {
        let currentLikesCount = state[action.payload.itemId].likes_count;
        return {
          ...state,
          [action.payload.itemId]: {
            ...state[action.payload.itemId],
            likes_count: currentLikesCount + 1
          }
        };
      } else {
        return state;
      }
    case DELETE_ITEM_LIKE:
      if (state[action.payload.itemId]) {
        let currentLikesCount = state[action.payload.itemId].likes_count;
        return {
          ...state,
          [action.payload.itemId]: {
            ...state[action.payload.itemId],
            likes_count: currentLikesCount - 1
          }
        };
      } else {
        return state;
      }
    case UPDATE_ITEM:
      const id = action.payload.data.id;
      if (state[id]) {
        return {
          ...state,
          [id]: {
            ...state[id],
            ..._.pick(action.payload.data, Object.keys(state[id]))
          }
        };
      } else {
        return state;
      }
    default:
      return state;
  }
}

function allItems(state = [], action) {
  switch (action.type) {
    case GET_ITEMS:
      return action.payload.allIds;
    case GET_MORE_ITEMS:
      return [...state, ...action.payload.allIds];
    default:
      return state;
  }
}

export default combineReducers({
  byId: itemsById,
  allIds: allItems
});

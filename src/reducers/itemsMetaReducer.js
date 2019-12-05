import {
  CHANGE_ITEMS_DISPLAY,
  GET_ITEMS,
  GET_MORE_ITEMS,
  INITIALIZE_ITEMS,
  SET_REFRESH_NEEDED
} from "../constants";

export default (state = {}, action) => {
  switch (action.type) {
    case INITIALIZE_ITEMS:
      return {
        ...state,
        initialized: true
      };
    case CHANGE_ITEMS_DISPLAY:
      return {
        ...state,
        display: { ...state.display, ...action.payload.display }
      };
    case GET_ITEMS:
    case GET_MORE_ITEMS:
      return {
        ...state,
        ...action.payload.meta
      };
    case SET_REFRESH_NEEDED:
      return {
        ...state,
        refreshNeeded: action.payload.value
      };
    default:
      return state;
  }
};

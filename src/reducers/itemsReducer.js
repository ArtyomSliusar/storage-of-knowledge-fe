import { CHANGE_ITEMS_DISPLAY, INITIALIZE_ITEMS } from "../constants";

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
    default:
      return state;
  }
};

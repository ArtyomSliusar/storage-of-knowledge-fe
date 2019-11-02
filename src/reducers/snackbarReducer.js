import { OPEN_SNACKBAR, CLOSE_SNACKBAR, INFO } from "../constants";

export default (state = {}, action) => {
  switch (action.type) {
    case OPEN_SNACKBAR:
      return {
        open: true,
        ...action.payload
      };
    case CLOSE_SNACKBAR:
      return {
        open: false,
        message: "",
        type: INFO
      };
    default:
      return state;
  }
};

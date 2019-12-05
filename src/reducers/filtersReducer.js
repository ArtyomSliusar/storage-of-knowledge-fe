import { APPLY_FILTERS } from "../constants";

export default (state = {}, action) => {
  switch (action.type) {
    case APPLY_FILTERS:
      return {
        subjects: action.payload.filters.subjects,
        type: action.payload.filters.type
      };
    default:
      return state;
  }
};

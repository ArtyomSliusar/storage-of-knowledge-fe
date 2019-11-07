import { GET_MORE_NOTES, GET_NOTES } from "../constants";

export default (state = {}, action) => {
  switch (action.type) {
    case GET_NOTES:
      return action.payload.data;
    case GET_MORE_NOTES:
      return {
        ...action.payload.data,
        results: [...state.results, ...action.payload.data.results]
      };
    default:
      return state;
  }
};

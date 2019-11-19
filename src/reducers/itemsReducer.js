import { GET_MORE_ITEMS, GET_ITEMS } from "../constants";

export default (state = {}, action) => {
  switch (action.type) {
    case GET_ITEMS:
      return action.payload.data;
    case GET_MORE_ITEMS:
      return {
        ...action.payload.data,
        results: [...state.results, ...action.payload.data.results]
      };
    default:
      return state;
  }
};

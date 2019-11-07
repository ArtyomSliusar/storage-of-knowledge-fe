import { GET_LINKS, GET_MORE_LINKS } from "../constants";

export default (state = {}, action) => {
  switch (action.type) {
    case GET_LINKS:
      return action.payload.data;
    case GET_MORE_LINKS:
      return {
        ...action.payload.data,
        results: [...state.results, ...action.payload.data.results]
      };
    default:
      return state;
  }
};

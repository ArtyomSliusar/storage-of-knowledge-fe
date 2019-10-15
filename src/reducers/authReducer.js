import { LOGIN, LOGOUT, GET_USER, REFRESH_TOKENS } from "../actions/types";
import { getTokenPayload } from "../utils/otherUtils";

export default (state = {}, action) => {
  switch (action.type) {
    case LOGIN:
      const tokenPayload = getTokenPayload(action.payload.data.access);
      return {
        ...state,
        tokens: {
          ...state.tokens,
          access: action.payload.data.access,
          refresh: action.payload.data.refresh
        },
        user: {
          ...state.user,
          id: tokenPayload["user_id"],
          loggedIn: true
        }
      };
    case GET_USER:
      return {
        ...state,
        user: {
          ...state.user,
          username: action.payload.data.username,
          email: action.payload.data.email
        }
      };
    case LOGOUT:
      return { ...state, tokens: {}, user: {} };
    case REFRESH_TOKENS:
      return {
        ...state,
        tokens: {
          ...state.tokens,
          access: action.payload.data.access,
          refresh: action.payload.data.refresh
        }
      };
    default:
      return state;
  }
};

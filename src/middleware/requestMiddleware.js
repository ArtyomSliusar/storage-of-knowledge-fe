import * as _ from "lodash";

import backend from "../apis/backend";
import { getTokenPayload } from "../utils/otherUtils";
import { LOGOUT, REFRESH_TOKENS } from "../actions/types";
import history from "../history";

async function refreshTokens(refreshToken) {
  return await backend.post("/refresh/", {
    refresh: refreshToken
  });
}

/**
 * Common middleware for outgoing requests.
 */
export function requestMiddleware() {
  return ({ dispatch, getState }) => next => action => {
    // TODO: improve check
    if (typeof action !== "function") {
      return next(action);
    }

    const { tokens } = getState().auth;

    if (_.isEmpty(tokens)) {
      return next(action);
    }

    const accessToken = getTokenPayload(tokens.access);

    if (tokens.refresh && Date.now() / 1000 > accessToken["exp"]) {
      refreshTokens(tokens.refresh)
        .then(response => {
          dispatch({ type: REFRESH_TOKENS, payload: { data: response.data } });
          return action(dispatch, getState);
        })
        .catch(error => {
          console.log(error);
          dispatch({ type: LOGOUT });
          history.push("/login");
        });
    } else {
      return action(dispatch, getState);
    }
  };
}

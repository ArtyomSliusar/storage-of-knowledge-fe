import * as _ from "lodash";

import backend from "../apis/backend";
import { getTokenPayload } from "../utils/otherUtils";
import { LOGOUT, REFRESH_TOKENS } from "../constants";
import history from "../history";

let refreshInProgress = false;
let callbackQueue = [];

function refreshTokens(refreshToken) {
  refreshInProgress = true;
  return backend.post("/refresh/", {
    refresh: refreshToken
  });
}

/**
 * Common middleware for outgoing requests.
 */
export function requestMiddleware() {
  return ({ dispatch, getState }) => next => action => {
    if (typeof action !== "function") {
      return next(action);
    }

    const { tokens } = getState().auth;

    if (_.isEmpty(tokens)) {
      return next(action);
    }

    const accessToken = getTokenPayload(tokens.access);

    if (tokens.refresh && Date.now() / 1000 > accessToken["exp"]) {
      if (refreshInProgress === true) {
        // FIXME: potential bug may be here, when caller expects promise to be
        // returned, but we return undefined instead
        callbackQueue.push(action);
      } else {
        return refreshTokens(tokens.refresh)
          .then(response => {
            dispatch({
              type: REFRESH_TOKENS,
              payload: { data: response.data }
            });
            refreshInProgress = false;
            setTimeout(function() {
              while (callbackQueue.length > 0) {
                const action = callbackQueue.shift();
                action(dispatch, getState);
              }
            }, 0);
            return action(dispatch, getState);
          })
          .catch(error => {
            console.log(error);
            dispatch({ type: LOGOUT });
            refreshInProgress = false;
            history.push("/login");
          });
      }
    } else {
      return action(dispatch, getState);
    }
  };
}

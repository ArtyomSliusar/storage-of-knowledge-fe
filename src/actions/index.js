import backend from "../apis/backend";
import { GET_USER, LOGIN, LOGOUT, REGISTER } from "./types";
import history from "../history";

export const login = (username, password) => async dispatch => {
  const response = await backend.post(
    "/token/",
    {
      username: username,
      password: password
    },
    {
      headers: {
        "Content-Type": "application/json"
      }
    }
  );

  dispatch({
    type: LOGIN,
    payload: { data: response.data }
  });

  history.push("/");
};

export const logout = () => async (dispatch, getState) => {
  await backend
    .post(
      "/logout/",
      {
        refresh: getState().auth.tokens.refresh
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getState().auth.tokens.access}`
        }
      }
    )
    .catch(error => {
      console.log(error);
    });

  dispatch({
    type: LOGOUT
  });

  history.push("/");
};

export const register = (username, email, password) => async dispatch => {
  await backend.post(
    "/users/",
    {
      username: username,
      email: email,
      password: password
    },
    {
      headers: {
        "Content-Type": "application/json"
      }
    }
  );

  dispatch({
    type: REGISTER
  });

  history.push("/login");
};

export const getUser = userId => async (dispatch, getState) => {
  const response = await backend.get(`/users/${userId}/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getState().auth.tokens.access}`
    }
  });

  dispatch({
    type: GET_USER,
    payload: { data: response.data }
  });
};

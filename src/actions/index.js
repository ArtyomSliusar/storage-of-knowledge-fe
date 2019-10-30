import backend from "../apis/backend";
import {
  APPLY_FILTERS,
  GET_LINKS,
  GET_MORE_LINKS,
  GET_MORE_NOTES,
  GET_NOTES,
  GET_USER,
  LOGIN,
  LOGOUT,
  REGISTER
} from "../constants";
import history from "../history";
import axios from "axios";

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

export const applyFilters = filters => {
  return {
    type: APPLY_FILTERS,
    payload: { filters: filters }
  };
};

export const getNotes = ({
  filters,
  search,
  orderBy,
  limit = 15,
  order = "asc"
} = {}) => async (dispatch, getState) => {
  const limitQuery = `limit=${limit}`;

  const searchQuery = search ? `&search=${search}` : "";

  const filtersQuery =
    filters.subjects.length > 0
      ? `&subjects=in:${filters.subjects.join(",")}`
      : "";

  const orderQuery = orderBy
    ? `&ordering=${order === "desc" ? "-" + orderBy : orderBy}`
    : "";

  const response = await backend.get(
    `/notes/?${limitQuery}${filtersQuery}${searchQuery}${orderQuery}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: getState().auth.user.loggedIn
          ? `Bearer ${getState().auth.tokens.access}`
          : ""
      }
    }
  );

  dispatch({
    type: GET_NOTES,
    payload: { data: response.data }
  });
};

export const getMoreNotes = url => async (dispatch, getState) => {
  if (url) {
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: getState().auth.user.loggedIn
          ? `Bearer ${getState().auth.tokens.access}`
          : ""
      }
    });

    dispatch({
      type: GET_MORE_NOTES,
      payload: { data: response.data }
    });
  }
};

export const getLinks = ({
  filters,
  search,
  orderBy,
  limit = 15,
  order = "asc"
} = {}) => async (dispatch, getState) => {
  const limitQuery = `limit=${limit}`;

  const searchQuery = search ? `&search=${search}` : "";

  const filtersQuery =
    filters.subjects.length > 0
      ? `&subjects=in:${filters.subjects.join(",")}`
      : "";

  const orderQuery = orderBy
    ? `&ordering=${order === "desc" ? "-" + orderBy : orderBy}`
    : "";

  const response = await backend.get(
    `/links/?${limitQuery}${filtersQuery}${searchQuery}${orderQuery}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: getState().auth.user.loggedIn
          ? `Bearer ${getState().auth.tokens.access}`
          : ""
      }
    }
  );

  dispatch({
    type: GET_LINKS,
    payload: { data: response.data }
  });
};

export const getMoreLinks = url => async (dispatch, getState) => {
  if (url) {
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: getState().auth.user.loggedIn
          ? `Bearer ${getState().auth.tokens.access}`
          : ""
      }
    });

    dispatch({
      type: GET_MORE_LINKS,
      payload: { data: response.data }
    });
  }
};

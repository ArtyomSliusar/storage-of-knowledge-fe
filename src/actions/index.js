import backend from "../apis/backend";
import {
  APPLY_FILTERS,
  GET_LINKS,
  GET_MORE_LINKS,
  GET_MORE_NOTES,
  GET_NOTE_DETAILS,
  GET_NOTES,
  GET_USER,
  LOGIN,
  LOGOUT,
  OPEN_SNACKBAR,
  CLOSE_SNACKBAR,
  REGISTER,
  UPDATE_NOTE,
  DELETE_NOTE,
  GET_LINK_DETAILS,
  DELETE_LINK,
  UPDATE_LINK,
  ADD_NOTE,
  ADD_LINK,
  GET_NOTE_LIKES,
  ADD_NOTE_LIKE,
  DELETE_NOTE_LIKE,
  GET_LINK_LIKES,
  ADD_LINK_LIKE,
  DELETE_LINK_LIKE
} from "../constants";
import history from "../history";
import axios from "axios";

// TODO: DRY

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
      console.error(error);
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

export const openSnackbar = (message, type) => {
  return {
    type: OPEN_SNACKBAR,
    payload: { message: message, type: type }
  };
};

export const closeSnackbar = () => {
  return {
    type: CLOSE_SNACKBAR
  };
};

export const getNotes = ({
  filters,
  search,
  orderBy,
  limit,
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
  limit,
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

export const getNote = id => async (dispatch, getState) => {
  const response = await backend.get(`/notes/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: getState().auth.user.loggedIn
        ? `Bearer ${getState().auth.tokens.access}`
        : ""
    }
  });

  dispatch({
    type: GET_NOTE_DETAILS,
    payload: { data: response.data }
  });
};

export const updateNote = (noteId, noteData) => async (dispatch, getState) => {
  const response = await backend.put(
    `/notes/${noteId}`,
    {
      title: noteData.title,
      subjects: noteData.subjects,
      private: noteData.private,
      user: getState().auth.user.username,
      body: noteData.body
    },
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
    type: UPDATE_NOTE,
    payload: { data: response.data }
  });
};

export const updateLink = (linkId, linkData) => async (dispatch, getState) => {
  const response = await backend.put(
    `/links/${linkId}`,
    {
      title: linkData.title,
      subjects: linkData.subjects,
      private: linkData.private,
      user: getState().auth.user.username,
      link: linkData.link
    },
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
    type: UPDATE_LINK,
    payload: { data: response.data }
  });
};

export const deleteNote = noteId => async (dispatch, getState) => {
  await backend.delete(`/notes/${noteId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: getState().auth.user.loggedIn
        ? `Bearer ${getState().auth.tokens.access}`
        : ""
    }
  });

  dispatch({
    type: DELETE_NOTE
  });
};

export const deleteLink = linkId => async (dispatch, getState) => {
  await backend.delete(`/links/${linkId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: getState().auth.user.loggedIn
        ? `Bearer ${getState().auth.tokens.access}`
        : ""
    }
  });

  dispatch({
    type: DELETE_LINK
  });
};

export const getLink = id => async (dispatch, getState) => {
  const response = await backend.get(`/links/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: getState().auth.user.loggedIn
        ? `Bearer ${getState().auth.tokens.access}`
        : ""
    }
  });

  dispatch({
    type: GET_LINK_DETAILS,
    payload: { data: response.data }
  });
};

export const createNote = noteData => async (dispatch, getState) => {
  const response = await backend.post(
    `/notes/`,
    {
      title: noteData.title,
      subjects: noteData.subjects,
      private: noteData.private,
      user: getState().auth.user.username,
      body: noteData.body
    },
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
    type: ADD_NOTE,
    payload: { data: response.data }
  });

  return response;
};

export const createLink = linkData => async (dispatch, getState) => {
  const response = await backend.post(
    `/links/`,
    {
      title: linkData.title,
      subjects: linkData.subjects,
      private: linkData.private,
      user: getState().auth.user.username,
      link: linkData.link
    },
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
    type: ADD_LINK,
    payload: { data: response.data }
  });

  return response;
};

export const getNoteLikes = ({ id, userOnly = false } = {}) => async (
  dispatch,
  getState
) => {
  const userFilter = userOnly ? `?user=${getState().auth.user.id}` : "";

  const response = await backend.get(`/notes/${id}/likes/${userFilter}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: getState().auth.user.loggedIn
        ? `Bearer ${getState().auth.tokens.access}`
        : ""
    }
  });

  dispatch({
    type: GET_NOTE_LIKES,
    payload: { data: response.data }
  });

  return response;
};

export const addNoteLike = id => async (dispatch, getState) => {
  const response = await backend.post(
    `/notes/${id}/likes/`,
    {},
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
    type: ADD_NOTE_LIKE,
    payload: { data: response.data }
  });

  return response;
};

export const deleteNoteLike = ({ id, likeId }) => async (
  dispatch,
  getState
) => {
  await backend.delete(`/notes/${id}/likes/${likeId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: getState().auth.user.loggedIn
        ? `Bearer ${getState().auth.tokens.access}`
        : ""
    }
  });

  dispatch({
    type: DELETE_NOTE_LIKE
  });
};

export const getLinkLikes = ({ id, userOnly = false } = {}) => async (
  dispatch,
  getState
) => {
  const userFilter = userOnly ? `?user=${getState().auth.user.id}` : "";

  const response = await backend.get(`/links/${id}/likes/${userFilter}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: getState().auth.user.loggedIn
        ? `Bearer ${getState().auth.tokens.access}`
        : ""
    }
  });

  dispatch({
    type: GET_LINK_LIKES,
    payload: { data: response.data }
  });

  return response;
};

export const addLinkLike = id => async (dispatch, getState) => {
  const response = await backend.post(
    `/links/${id}/likes/`,
    {},
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
    type: ADD_LINK_LIKE,
    payload: { data: response.data }
  });

  return response;
};

export const deleteLinkLike = ({ id, likeId }) => async (
  dispatch,
  getState
) => {
  await backend.delete(`/links/${id}/likes/${likeId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: getState().auth.user.loggedIn
        ? `Bearer ${getState().auth.tokens.access}`
        : ""
    }
  });

  dispatch({
    type: DELETE_LINK_LIKE
  });
};

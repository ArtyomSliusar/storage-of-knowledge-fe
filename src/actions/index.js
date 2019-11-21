import backend from "../apis/backend";
import * as _ from "lodash";
import { normalize } from "normalizr";
import {
  APPLY_FILTERS,
  GET_ITEMS,
  GET_MORE_ITEMS,
  GET_USER,
  LOGIN,
  LOGOUT,
  OPEN_SNACKBAR,
  CLOSE_SNACKBAR,
  REGISTER,
  GET_ITEM_COMMENTS,
  GET_ITEM_DETAILS,
  UPDATE_ITEM,
  DELETE_ITEM,
  ADD_ITEM_LIKE,
  DELETE_ITEM_LIKE,
  ADD_ITEM_COMMENT,
  DELETE_ITEM_COMMENT,
  INITIALIZE_ITEMS,
  CHANGE_ITEMS_DISPLAY,
  GET_SUBJECTS,
  NOTES,
  LINKS,
  SET_REFRESH_NEEDED,
  GET_ITEM_LIKE
} from "../constants";
import history from "../history";
import axios from "axios";
import { item, subject, user } from "../shemas";
import { getRequestHeaders } from "../utils/otherUtils";

export const login = (username, password) => async dispatch => {
  const response = await backend.post(
    "/token/",
    {
      username: username,
      password: password
    },
    {
      headers: getRequestHeaders()
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
        headers: getRequestHeaders()
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

export const register = (
  username,
  email,
  password,
  timezone,
  recaptcha
) => async dispatch => {
  await backend.post(
    "/users/",
    {
      username: username,
      email: email,
      password: password,
      time_zone: timezone,
      recaptcha: recaptcha
    },
    {
      headers: getRequestHeaders(false)
    }
  );

  dispatch({
    type: REGISTER
  });
};

export const getUser = userId => async dispatch => {
  const response = await backend.get(`/users/${userId}/`, {
    headers: getRequestHeaders()
  });

  const { id, username, ...userMeta } = response.data;
  const data = normalize({ id, username }, user);

  dispatch({
    type: GET_USER,
    payload: { users: data.entities.users, userMeta: userMeta }
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

export const initializeItems = () => {
  return {
    type: INITIALIZE_ITEMS
  };
};

export const setRefreshNeeded = value => {
  return {
    type: SET_REFRESH_NEEDED,
    payload: { value: value }
  };
};

export const changeItemsDisplay = params => {
  return {
    type: CHANGE_ITEMS_DISPLAY,
    payload: { display: params }
  };
};

export const closeSnackbar = () => {
  return {
    type: CLOSE_SNACKBAR
  };
};

export const getSubjects = () => async dispatch => {
  const response = await backend.get("/subjects/", {
    headers: getRequestHeaders(false)
  });

  const data = normalize(response.data, [subject]);

  dispatch({
    type: GET_SUBJECTS,
    payload: { allIds: data.result, byId: data.entities.subjects }
  });
};

export const getItems = (search, type) => async (dispatch, getState) => {
  const state = getState();
  const display = state.itemsMeta.display;
  const limitQuery = `limit=${display.limit}`;

  const searchQuery = search ? `&search=${search}` : "";

  const filtersQuery =
    state.filters.subjects.length > 0
      ? `&subjects=in:${state.filters.subjects.join(",")}`
      : "";

  const orderQuery = display.orderBy
    ? `&ordering=${
        display.order === "desc" ? "-" + display.orderBy : display.orderBy
      }`
    : "";

  const response = await backend.get(
    `/${type}/?${limitQuery}${filtersQuery}${searchQuery}${orderQuery}`,
    {
      headers: getRequestHeaders()
    }
  );

  const resultsData = normalize(response.data.results, [item]);
  const { count, next, previous } = response.data;

  dispatch({
    type: GET_ITEMS,
    payload: {
      allIds: resultsData.result,
      byId: resultsData.entities.items,
      users: resultsData.entities.users,
      subjects: resultsData.entities.subjects,
      meta: { count, next, previous }
    }
  });
};

export const getMoreItems = url => async dispatch => {
  if (url) {
    const response = await axios.get(url, {
      headers: getRequestHeaders()
    });

    const resultsData = normalize(response.data.results, [item]);
    const { count, next, previous } = response.data;

    dispatch({
      type: GET_MORE_ITEMS,
      payload: {
        allIds: resultsData.result,
        byId: resultsData.entities.items,
        users: resultsData.entities.users,
        subjects: resultsData.entities.subjects,
        meta: { count, next, previous }
      }
    });
  }
};

export const getItem = (id, type) => async dispatch => {
  const response = await backend.get(`/${type}/${id}`, {
    headers: getRequestHeaders()
  });

  const data = normalize(response.data, item);

  dispatch({
    type: GET_ITEM_DETAILS,
    payload: {
      details: data.entities.items[id],
      users: data.entities.users,
      subjects: data.entities.subjects
    }
  });
};

export const updateItem = (itemId, itemData, itemType) => async (
  dispatch,
  getState
) => {
  const state = getState();
  const subjects_ids = itemData.subjects.map(subjectName =>
    _.findKey(state.subjects.byId, { name: subjectName })
  );
  let data = {
    title: itemData.title,
    subjects_ids: subjects_ids,
    private: itemData.private
  };

  if (itemType === NOTES) {
    data["body"] = itemData.body;
  } else if (itemType === LINKS) {
    data["link"] = itemData.link;
  }

  const response = await backend.put(`/${itemType}/${itemId}`, data, {
    headers: getRequestHeaders()
  });

  const responseData = normalize(response.data, item);

  dispatch({
    type: UPDATE_ITEM,
    payload: {
      data: responseData.entities.items[itemId]
    }
  });
};

export const deleteItem = (itemId, itemType) => async dispatch => {
  await backend.delete(`/${itemType}/${itemId}`, {
    headers: getRequestHeaders()
  });

  dispatch({
    type: DELETE_ITEM
  });
};

export const createItem = (itemData, itemType) => async (
  dispatch,
  getState
) => {
  const state = getState();
  const subjects_ids = itemData.subjects.map(subjectName =>
    _.findKey(state.subjects.byId, { name: subjectName })
  );
  const data = {
    title: itemData.title,
    subjects_ids: subjects_ids,
    private: itemData.private
  };
  if (itemType === NOTES) {
    data["body"] = itemData.body;
  } else if (itemType === LINKS) {
    data["link"] = itemData.link;
  }

  return await backend.post(`/${itemType}/`, data, {
    headers: getRequestHeaders()
  });
};

export const getItemLike = (id, type) => async (dispatch, getState) => {
  const userFilter = `?user=${getState().auth.user.id}`;

  const response = await backend.get(`/${type}/${id}/likes/${userFilter}`, {
    headers: getRequestHeaders()
  });

  dispatch({
    type: GET_ITEM_LIKE,
    payload: { data: response.data }
  });
};

export const addItemLike = (id, type) => async dispatch => {
  const response = await backend.post(
    `/${type}/${id}/likes/`,
    {},
    {
      headers: getRequestHeaders()
    }
  );

  dispatch({
    type: ADD_ITEM_LIKE,
    payload: { data: response.data, itemId: id }
  });
};

export const deleteItemLike = (id, type, likeId) => async dispatch => {
  await backend.delete(`/${type}/${id}/likes/${likeId}`, {
    headers: getRequestHeaders()
  });

  dispatch({
    type: DELETE_ITEM_LIKE,
    payload: { itemId: id }
  });
};

export const getItemComments = (id, itemType) => async dispatch => {
  const response = await backend.get(`/${itemType}/${id}/comments/`, {
    headers: getRequestHeaders()
  });

  dispatch({
    type: GET_ITEM_COMMENTS,
    payload: { data: response.data }
  });
};

export const addItemComment = (
  id,
  type,
  body,
  parentId = null
) => async dispatch => {
  await backend.post(
    `/${type}/${id}/comments/`,
    {
      body: body,
      parent: parentId
    },
    {
      headers: getRequestHeaders()
    }
  );

  dispatch({
    type: ADD_ITEM_COMMENT
  });
};

export const deleteItemComment = (id, type, commentId) => async dispatch => {
  await backend.delete(`/${type}/${id}/comments/${commentId}`, {
    headers: getRequestHeaders()
  });

  dispatch({
    type: DELETE_ITEM_COMMENT
  });
};

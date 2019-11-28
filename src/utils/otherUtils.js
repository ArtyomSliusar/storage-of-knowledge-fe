import { LINKS, NOTES } from "../constants";
import store from "../store";

function getRequestHeaders(auth = true, contentType = "application/json") {
  const state = store.getState();
  let headers = {
    "Content-Type": contentType
  };
  if (auth && state.auth.user.loggedIn) {
    headers["Authorization"] = `Bearer ${state.auth.tokens.access}`;
  }
  return headers;
}

function setLocalStorageState(state) {
  try {
    localStorage.setItem(
      "state.auth.tokens",
      JSON.stringify((state.auth || {}).tokens)
    );
    localStorage.setItem(
      "state.auth.user",
      JSON.stringify((state.auth || {}).user)
    );
  } catch (err) {
    return undefined;
  }
}

function getLocalStorageState() {
  try {
    const tokens =
      JSON.parse(localStorage.getItem("state.auth.tokens")) || undefined;
    const user =
      JSON.parse(localStorage.getItem("state.auth.user")) || undefined;

    return { auth: { tokens, user } };
  } catch (err) {
    return {};
  }
}

function getTokenPayload(token) {
  const tokenPayload = token
    .split(".")
    .slice(1, 2)
    .join("");
  return JSON.parse(atob(tokenPayload));
}

function getInitialState(defaultState) {
  let initialState = JSON.parse(JSON.stringify(defaultState));
  const localStorageState = getLocalStorageState();
  if (localStorageState.auth && localStorageState.auth.tokens) {
    initialState.auth.tokens = localStorageState.auth.tokens;
  }
  if (localStorageState.auth && localStorageState.auth.user) {
    initialState.auth.user = localStorageState.auth.user;
  }
  return initialState;
}

const getFilterTypeSingular = (startWithCapital = false) => {
  const type = store.getState().filters.type;
  let name = "";
  if (type === NOTES) {
    name = "note";
  } else if (type === LINKS) {
    name = "link";
  }
  return startWithCapital ? name.charAt(0).toUpperCase() + name.slice(1) : name;
};

const convertUrlProtocol = url => {
  let currentProtocol = window.location.href.split("/")[0];
  if (url) {
    return url.replace(/(^\w+:|^)/, currentProtocol);
  }
  return url;
};

export {
  setLocalStorageState,
  getInitialState,
  getTokenPayload,
  getFilterTypeSingular,
  getRequestHeaders,
  convertUrlProtocol
};

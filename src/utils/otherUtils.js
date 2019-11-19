import { LINKS, NOTES } from "../constants";
import store from "../store";

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

const getFilterTypeSingular = () => {
  const type = store.getState().filters.type;
  if (type === NOTES) {
    return "note";
  } else if (type === LINKS) {
    return " link";
  } else {
    return null;
  }
};

export {
  setLocalStorageState,
  getInitialState,
  getTokenPayload,
  getFilterTypeSingular
};

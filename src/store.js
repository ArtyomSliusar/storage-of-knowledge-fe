import { applyMiddleware, compose, createStore } from "redux";
import { reducers } from "./reducers";
import { getInitialState, setLocalStorageState } from "./utils/otherUtils";
import { requestMiddleware } from "./middleware/requestMiddleware";
import thunk from "redux-thunk";
import { INFO, NOTES } from "./constants";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export const defaultState = {
  auth: {
    tokens: {},
    user: {}
  },
  filters: {
    subjects: [],
    type: NOTES
  },
  notes: [],
  links: [],
  openedItem: {},
  snackbar: {
    open: false,
    message: "",
    type: INFO
  },
  itemsMeta: {
    initialized: false,
    display: {
      orderBy: "title",
      order: "asc",
      limit: 15,
      page: 0
    }
  }
};

const store = createStore(
  reducers,
  { ...getInitialState(defaultState) },
  composeEnhancers(applyMiddleware(requestMiddleware(), thunk))
);
store.subscribe(() => {
  setLocalStorageState(store.getState());
});

export default store;

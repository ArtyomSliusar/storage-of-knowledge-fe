import { applyMiddleware, compose, createStore } from "redux";
import { reducers } from "./reducers";
import { getInitialState, setLocalStorageState } from "./utils/otherUtils";
import { requestMiddleware } from "./middleware/requestMiddleware";
import thunk from "redux-thunk";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  reducers,
  { ...getInitialState() },
  composeEnhancers(applyMiddleware(requestMiddleware(), thunk))
);
store.subscribe(() => {
  setLocalStorageState(store.getState());
});

export default store;

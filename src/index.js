import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore, compose, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import cyan from "@material-ui/core/colors/cyan";

import "./index.css";
import App from "./components/App";
import { reducers } from "./reducers";
import * as serviceWorker from "./serviceWorker";
import { setLocalStorageState, getInitialState } from "./utils/otherUtils";
import { requestMiddleware } from "./middleware/requestMiddleware";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  reducers,
  { ...getInitialState() },
  composeEnhancers(applyMiddleware(requestMiddleware(), thunk))
);
store.subscribe(() => {
  setLocalStorageState(store.getState());
});

const theme = createMuiTheme({
  palette: {
    primary: cyan
  }
});

ReactDOM.render(
  <Provider store={store}>
    <MuiThemeProvider theme={theme}>
      <App />
    </MuiThemeProvider>
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

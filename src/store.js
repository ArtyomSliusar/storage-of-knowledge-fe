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
  snackbar: {
    open: false,
    message: "",
    type: INFO
  },
  subjects: {
    byId: {},
    allIds: []
  },
  users: {
    byId: {}
  },
  openedItem: {},
  items: {
    byId: {},
    allIds: []
  },
  itemsMeta: {
    refreshNeeded: false,
    initialized: false,
    display: {
      orderBy: "title",
      order: "asc",
      limit: 15,
      page: 0
    }
  }
};

// TODO: use this state structure
export const flatDefaultState = {
  subjects: {
    byId: {
      "1": {
        id: "1",
        name: "Python"
      }
    },
    allIds: ["1", "2"]
  },
  types: {
    byId: {
      "1": "notes",
      "2": "links"
    }
  },
  users: {
    byId: {
      "1": {
        username: "artem"
      }
    }
  },
  items: {
    byId: {
      "1": {
        id: "1",
        title: "",
        subjects: ["1"],
        user: "1",
        private: false,
        likes_count: 1,
        date_modified: ""
      }
    },
    allIds: ["1", "2"]
  },
  auth: {
    tokens: {},
    user: {
      id: "1",
      email: "",
      loggedIn: true
    }
  },
  filters: {
    subjects: ["1"],
    type: "1"
  },
  comments: {
    byId: {
      id: "1",
      parent: null,
      user: "1",
      note: "1",
      body: "",
      reply_set: ["2", "3"],
      date_created: "",
      date_modified: ""
    },
    allIds: ["1", "2"]
  },
  openedItem: {
    id: "1",
    title: "",
    body: "",
    subjects: ["1"],
    user: "1",
    private: true,
    date_created: "",
    date_modified: ""
  },
  snackbar: {
    open: false,
    message: "",
    type: INFO
  },
  itemsMeta: {
    initialized: false,
    count: 1,
    next: "",
    previous: "",
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

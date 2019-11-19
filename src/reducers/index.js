import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import authReducer from "./authReducer";
import filtersReducer from "./filtersReducer";
import snackbarReducer from "./snackbarReducer";
import itemReducer from "./itemReducer";
import itemsReducer from "./itemsReducer";
import itemsMetaReducer from "./itemsMetaReducer";

export const reducers = combineReducers({
  auth: authReducer,
  form: formReducer,
  filters: filtersReducer,
  items: itemsReducer,
  openedItem: itemReducer,
  itemsMeta: itemsMetaReducer,
  snackbar: snackbarReducer
});

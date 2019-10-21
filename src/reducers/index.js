import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import authReducer from "./authReducer";
import filtersReducer from "./filtersReducer";
import notesReducer from "./notesReducer";
import linksReducer from "./linksReducer";

export const reducers = combineReducers({
  auth: authReducer,
  form: formReducer,
  filters: filtersReducer,
  notes: notesReducer,
  links: linksReducer
});

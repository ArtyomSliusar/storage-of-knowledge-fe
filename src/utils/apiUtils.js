import backend from "../apis/backend";
import { LINK, NOTE } from "../constants";
import store from "../store";

/**
 * Requests with no storage update AND no authentication token refresh.
 */

async function contact(name, email, message) {
  await backend.post(
    "/contact/",
    {
      name: name,
      email: email,
      message: message
    },
    {
      headers: {
        "Content-Type": "application/json"
      }
    }
  );
}

async function getSubjects() {
  return await backend.get("/subjects/", {
    headers: {
      "Content-Type": "application/json"
    }
  });
}

async function getSuggestions(filters, query) {
  let collection;
  if (filters.type === NOTE) {
    collection = "notes";
  } else if (filters.type === LINK) {
    collection = "links";
  }
  return await backend.get(`/${collection}/suggestions/?query=${query}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: store.getState().auth.user.loggedIn
        ? `Bearer ${store.getState().auth.tokens.access}`
        : ""
    }
  });
}

export { contact, getSubjects, getSuggestions };

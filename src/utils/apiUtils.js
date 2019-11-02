import backend from "../apis/backend";

/**
 * Requests with no storage update AND no authentication.
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
  return await backend.get(`/${filters.type}/suggestions/?query=${query}`, {
    headers: {
      "Content-Type": "application/json"
    }
  });
}

export { contact, getSubjects, getSuggestions };

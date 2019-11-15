import backend from "../apis/backend";

/**
 * Requests with no storage update AND no authentication.
 */

async function contact(name, email, message, recaptcha) {
  await backend.post(
    "/contact/",
    {
      name: name,
      email: email,
      message: message,
      recaptcha: recaptcha
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
  return await backend.get(
    `/suggestions/?query=${query}&index=${filters.type}`,
    {
      headers: {
        "Content-Type": "application/json"
      }
    }
  );
}

async function activateUser(usernameEmail, activationCode) {
  await backend.post(
    "/user-activate/",
    {
      username_email: usernameEmail,
      activation_code: activationCode
    },
    {
      headers: {
        "Content-Type": "application/json"
      }
    }
  );
}

export { contact, getSubjects, getSuggestions, activateUser };

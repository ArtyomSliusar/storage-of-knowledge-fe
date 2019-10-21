import backend from "../apis/backend";

/**
 * Requests with no authentication and no storage update.
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

export { contact, getSubjects };

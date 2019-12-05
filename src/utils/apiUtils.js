import backend from "../apis/backend";

/**
 * Requests with no storage update AND no authentication.
 */

export function contact(name, email, message, recaptcha) {
  return backend.post(
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

export function getSuggestions(filters, query) {
  return backend.get(`/suggestions/?query=${query}&index=${filters.type}`, {
    headers: {
      "Content-Type": "application/json"
    }
  });
}

export function activateUser(usernameEmail, activationCode) {
  return backend.post(
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

export function resetPassword(usernameEmail, newPassword, activationCode) {
  return backend.post(
    "/user-reset-password/",
    {
      username_email: usernameEmail,
      new_password: newPassword,
      reset_password_code: activationCode
    },
    {
      headers: {
        "Content-Type": "application/json"
      }
    }
  );
}

export function sendConfirmation(usernameEmail, confirmationType, recaptcha) {
  return backend.post(
    "/user-send-confirmation/",
    {
      username_email: usernameEmail,
      type: confirmationType,
      recaptcha: recaptcha
    },
    {
      headers: {
        "Content-Type": "application/json"
      }
    }
  );
}

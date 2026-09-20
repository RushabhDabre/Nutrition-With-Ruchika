import { apiBaseUrl } from "../data/siteData";

let csrfToken = null;

async function getCsrfToken() {
  const res = await fetch(`${apiBaseUrl}/api/auth/csrf`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Could not initialize security token");
  }

  const data = await res.json();
  csrfToken = data.token;
  return csrfToken;
}

export async function login(username, password) {
  const token = await getCsrfToken();

  const res = await fetch(`${apiBaseUrl}/api/auth/login`, {
    method: "POST",

    credentials: "include",

    headers: {
      "Content-Type": "application/json",
      "X-XSRF-TOKEN": token,
    },

    body: JSON.stringify({
      username,
      password,
    }),
  });

  if (!res.ok) {
    return false;
  }

  // Login clears the previous CSRF token,
  // so get a fresh one for authenticated requests.
  csrfToken = null;
  await getCsrfToken();

  return true;
}

export async function getCurrentAdmin() {
  const res = await fetch(`${apiBaseUrl}/api/auth/me`, {
    credentials: "include",
  });

  if (!res.ok) {
    return null;
  }

  return res.json();
}

export async function logout() {
  const token = await getCsrfToken();

  await fetch(`${apiBaseUrl}/api/auth/logout`, {
    method: "POST",

    credentials: "include",

    headers: {
      "X-XSRF-TOKEN": token,
    },
  });

  csrfToken = null;
}

export async function adminFetch(path, options = {}) {
  const method = (options.method || "GET").toUpperCase();

  const headers = {
    ...(options.headers || {}),
  };

  if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
    const token = csrfToken || (await getCsrfToken());

    headers["X-XSRF-TOKEN"] = token;
  }

  const res = await fetch(`${apiBaseUrl}${path}`, {
    ...options,

    credentials: "include",

    headers,
  });

  if (res.status === 401) {
    window.location.href = "/admin";
    throw new Error("Session expired");
  }

  return res;
}

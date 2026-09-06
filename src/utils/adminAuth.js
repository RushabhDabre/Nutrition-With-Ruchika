import { apiBaseUrl } from '../data/siteData';

const STORAGE_KEY = 'admin_credentials';

export function getStoredCredentials() {
  const raw = sessionStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function storeCredentials(username, password) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ username, password }));
}

export function clearCredentials() {
  sessionStorage.removeItem(STORAGE_KEY);
}

function authHeader(creds) {
  return { Authorization: `Basic ${btoa(`${creds.username}:${creds.password}`)}` };
}

/** Verifies credentials by hitting a real authenticated endpoint. */
export async function verifyCredentials(username, password) {
  const res = await fetch(`${apiBaseUrl}/api/admin/bookings`, {
    headers: authHeader({ username, password }),
  });
  return res.ok;
}

/** fetch() wrapper that automatically attaches stored admin credentials. */
export async function adminFetch(path, options = {}) {
  const creds = getStoredCredentials();
  if (!creds) throw new Error('Not logged in');

  const res = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...authHeader(creds),
    },
  });

  if (res.status === 401) {
    clearCredentials();
    throw new Error('Session expired - please log in again');
  }
  return res;
}

import type { AuthSession, SessionPersistence } from "./types";

const storageKey = "nutri.auth.session";

function getStorage(persistence: SessionPersistence) {
  return persistence === "local" ? window.localStorage : window.sessionStorage;
}

export function loadStoredSession(): AuthSession | null {
  const storages = [window.localStorage, window.sessionStorage];

  for (const storage of storages) {
    const rawSession = storage.getItem(storageKey);

    if (!rawSession) {
      continue;
    }

    try {
      return JSON.parse(rawSession) as AuthSession;
    } catch {
      storage.removeItem(storageKey);
    }
  }

  return null;
}

export function storeSession(
  session: AuthSession,
  persistence: SessionPersistence,
) {
  clearStoredSession();
  getStorage(persistence).setItem(storageKey, JSON.stringify(session));
}

export function clearStoredSession() {
  window.localStorage.removeItem(storageKey);
  window.sessionStorage.removeItem(storageKey);
}

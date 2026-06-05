import axios from "axios";

import { apiBaseUrl } from "../config/env";
import { clearStoredSession, loadStoredSession, storeSession } from "../auth/storage";

export const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

export function setApiAccessToken(token: string | null) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    return;
  }
  delete api.defaults.headers.common.Authorization;
}

// Track a pending refresh to avoid parallel refresh calls
let refreshPromise: Promise<string> | null = null;

async function doRefresh(refreshToken: string): Promise<string> {
  const res = await axios.post<{ access_token: string; refresh_token: string }>(
    `${apiBaseUrl}/auth/refresh`,
    { refresh_token: refreshToken },
  );
  return res.data.access_token;
}

// Response interceptor — silently refresh JWT on 401 and retry once
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only attempt refresh on 401, skip if already retried or if it's the refresh call itself
    if (
      error.response?.status !== 401 ||
      originalRequest._retried ||
      originalRequest.url?.includes("/auth/refresh")
    ) {
      return Promise.reject(error);
    }

    originalRequest._retried = true;

    const stored = loadStoredSession();
    if (!stored?.refresh_token) {
      clearStoredSession();
      setApiAccessToken(null);
      return Promise.reject(error);
    }

    try {
      if (!refreshPromise) {
        refreshPromise = doRefresh(stored.refresh_token).finally(() => {
          refreshPromise = null;
        });
      }

      const newAccessToken = await refreshPromise;

      // Persist updated tokens
      storeSession(
        { ...stored, access_token: newAccessToken },
        localStorage.getItem("nutri.auth.session") ? "local" : "session",
      );
      setApiAccessToken(newAccessToken);

      // Retry the original request with the new token
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return api(originalRequest);
    } catch {
      clearStoredSession();
      setApiAccessToken(null);
      return Promise.reject(error);
    }
  },
);

export function getApiErrorMessage(error: unknown) {
  if (axios.isAxiosError<{ detail?: string }>(error)) {
    return error.response?.data?.detail || error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Não foi possível concluir a requisição.";
}

export function isApiErrorStatus(error: unknown, status: number) {
  return axios.isAxiosError(error) && error.response?.status === status;
}

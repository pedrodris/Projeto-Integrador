import axios from "axios";

import { apiBaseUrl } from "../config/env";

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

export function getApiErrorMessage(error: unknown) {
  if (axios.isAxiosError<{ detail?: string }>(error)) {
    return error.response?.data?.detail || error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Nao foi possivel concluir a requisicao.";
}

export function isApiErrorStatus(error: unknown, status: number) {
  return axios.isAxiosError(error) && error.response?.status === status;
}

import { apiClient } from "./client";
import type {
  CurrentUser,
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
} from "../../types/api";

export async function login(payload: LoginRequest): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>("/auth/login", payload);
  return response.data;
}

export async function signup(payload: SignupRequest): Promise<SignupResponse> {
  const response = await apiClient.post<SignupResponse>("/auth/signup", payload);
  return response.data;
}

export async function getCurrentUser(): Promise<CurrentUser> {
  const response = await apiClient.get<CurrentUser>("/auth/me");
  return response.data;
}

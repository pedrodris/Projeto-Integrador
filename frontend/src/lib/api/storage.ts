export const AUTH_TOKEN_KEY = "nutri.auth.token";
export const AUTH_REFRESH_TOKEN_KEY = "nutri.auth.refreshToken";

export function getAccessToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function saveTokens(accessToken: string, refreshToken?: string | null): void {
  localStorage.setItem(AUTH_TOKEN_KEY, accessToken);

  if (refreshToken) {
    localStorage.setItem(AUTH_REFRESH_TOKEN_KEY, refreshToken);
  }
}

export function clearTokens(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_REFRESH_TOKEN_KEY);
}

export type AuthUser = {
  id: string;
  email: string | null;
  phone: string | null;
  app_metadata: Record<string, unknown>;
  user_metadata: Record<string, unknown>;
};

export type AuthSession = {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: AuthUser;
};

export type SignupResponse = {
  user_id: string;
  email: string | null;
  session_created: boolean;
  access_token: string | null;
  refresh_token: string | null;
  message: string;
};

export type SessionPersistence = "local" | "session";

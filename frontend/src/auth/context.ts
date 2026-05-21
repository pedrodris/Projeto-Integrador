import { createContext } from "react";

import type { AuthSession, SessionPersistence } from "./types";

export type AuthContextValue = {
  isHydrated: boolean;
  session: AuthSession | null;
  setSession: (session: AuthSession, persistence: SessionPersistence) => void;
  clearSession: () => void;
};

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

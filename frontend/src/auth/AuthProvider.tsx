import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { setApiAccessToken } from "../lib/api";
import { clearStoredSession, loadStoredSession, storeSession } from "./storage";
import { AuthContext, type AuthContextValue } from "./context";
import type { AuthSession } from "./types";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSessionState] = useState<AuthSession | null>(() =>
    loadStoredSession(),
  );

  useEffect(() => {
    setApiAccessToken(session?.access_token ?? null);
  }, [session]);

  const value = useMemo<AuthContextValue>(
    () => ({
      isHydrated: true,
      session,
      setSession(nextSession, persistence) {
        storeSession(nextSession, persistence);
        setApiAccessToken(nextSession.access_token);
        setSessionState(nextSession);
      },
      clearSession() {
        clearStoredSession();
        setApiAccessToken(null);
        setSessionState(null);
      },
    }),
    [session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

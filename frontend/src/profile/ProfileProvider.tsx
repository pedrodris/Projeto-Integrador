import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { useAuth } from "../auth/useAuth";
import { api, getApiErrorMessage, isApiErrorStatus } from "../lib/api";
import { ProfileContext, type ProfileContextValue } from "./context";
import type { ProfileDetails, ProfileSetupPayload } from "./types";

export function ProfileProvider({ children }: { children: ReactNode }) {
  const { clearSession, session } = useAuth();
  const sessionToken = session?.access_token ?? null;
  const [profileState, setProfileState] = useState<{
    errorMessage: string | null;
    profile: ProfileDetails | null;
    sessionToken: string | null;
    status: ProfileContextValue["status"];
  }>({
    errorMessage: null,
    profile: null,
    sessionToken: null,
    status: "idle",
  });

  const refreshProfile = useCallback(async () => {
    if (!session) {
      return null;
    }

    setProfileState((currentState) => ({
      ...currentState,
      errorMessage: null,
      profile: null,
      sessionToken,
      status: "loading",
    }));

    try {
      const response = await api.get<ProfileDetails>("/profile/me/details");

      setProfileState({
        errorMessage: null,
        profile: response.data,
        sessionToken,
        status: "ready",
      });
      return response.data;
    } catch (error) {
      if (isApiErrorStatus(error, 404)) {
        setProfileState({
          errorMessage: null,
          profile: null,
          sessionToken,
          status: "missing",
        });
        return null;
      }

      if (isApiErrorStatus(error, 401)) {
        clearSession();
        return null;
      }

      setProfileState({
        errorMessage: getApiErrorMessage(error),
        profile: null,
        sessionToken,
        status: "error",
      });
      return null;
    }
  }, [clearSession, session, sessionToken]);

  const setupProfile = useCallback(
    async (payload: ProfileSetupPayload) => {
      try {
        const response = await api.post<ProfileDetails>("/profile/setup", payload);

        setProfileState({
          errorMessage: null,
          profile: response.data,
          sessionToken,
          status: "ready",
        });

        return response.data;
      } catch (error) {
        if (isApiErrorStatus(error, 401)) {
          clearSession();
        }

        throw error;
      }
    },
    [clearSession, sessionToken],
  );

  useEffect(() => {
    if (!sessionToken) {
      return;
    }

    let cancelled = false;

    void api
      .get<ProfileDetails>("/profile/me/details")
      .then((response) => {
        if (cancelled) {
          return;
        }

        setProfileState({
          errorMessage: null,
          profile: response.data,
          sessionToken,
          status: "ready",
        });
      })
      .catch((error: unknown) => {
        if (cancelled) {
          return;
        }

        if (isApiErrorStatus(error, 404)) {
          setProfileState({
            errorMessage: null,
            profile: null,
            sessionToken,
            status: "missing",
          });
          return;
        }

        if (isApiErrorStatus(error, 401)) {
          clearSession();
          return;
        }

        setProfileState({
          errorMessage: getApiErrorMessage(error),
          profile: null,
          sessionToken,
          status: "error",
        });
      });

    return () => {
      cancelled = true;
    };
  }, [clearSession, sessionToken]);

  const isCurrentSession = profileState.sessionToken === sessionToken;
  const profile = sessionToken && isCurrentSession ? profileState.profile : null;
  const status = !sessionToken
    ? "idle"
    : isCurrentSession
      ? profileState.status
      : "loading";
  const errorMessage =
    sessionToken && isCurrentSession ? profileState.errorMessage : null;

  const value = useMemo<ProfileContextValue>(
    () => ({
      errorMessage,
      profile,
      refreshProfile,
      setupProfile,
      status,
    }),
    [errorMessage, profile, refreshProfile, setupProfile, status],
  );

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
}

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import * as authApi from "../lib/api/auth";
import * as profileApi from "../lib/api/profile";
import { isHttpStatus } from "../lib/api/errors";
import {
  clearTokens,
  getAccessToken,
  saveTokens,
} from "../lib/api/storage";
import type {
  CurrentUser,
  LoginRequest,
  ProfileDetails,
  SignupRequest,
  SignupResponse,
} from "../types/api";

type AuthContextValue = {
  user: CurrentUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasProfile: boolean;
  login: (payload: LoginRequest) => Promise<boolean>;
  register: (payload: SignupRequest) => Promise<SignupResponse>;
  logout: () => void;
  loadCurrentUser: () => Promise<void>;
  refreshProfileStatus: () => Promise<void>;
  profileDetails: ProfileDetails | null;
  setProfileDetails: (details: ProfileDetails | null) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);
  const [profileDetails, setProfileDetails] = useState<ProfileDetails | null>(null);

  const loadCurrentUser = useCallback(async () => {
    const token = getAccessToken();
    if (!token) {
      setUser(null);
      setHasProfile(false);
      setProfileDetails(null);
      return;
    }

    try {
      const currentUser = await authApi.getCurrentUser();
      setUser(currentUser);
      await refreshProfileStatusInternal(setHasProfile, setProfileDetails);
    } catch {
      clearTokens();
      setUser(null);
      setHasProfile(false);
      setProfileDetails(null);
    }
  }, []);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        await loadCurrentUser();
      } finally {
        setIsLoading(false);
      }
    };

    void bootstrap();
  }, [loadCurrentUser]);

  const login = useCallback(async (payload: LoginRequest) => {
    const response = await authApi.login(payload);
    saveTokens(response.access_token, response.refresh_token);
    setUser(response.user);
    const hasCompletedProfile = await refreshProfileStatusInternal(
      setHasProfile,
      setProfileDetails
    );

    return hasCompletedProfile;
  }, []);

  const register = useCallback(async (payload: SignupRequest) => {
    const response = await authApi.signup(payload);

    if (response.session_created && response.access_token) {
      saveTokens(response.access_token, response.refresh_token);
      const currentUser = await authApi.getCurrentUser();
      setUser(currentUser);
      setHasProfile(false);
      setProfileDetails(null);
    }

    return response;
  }, []);

  const logout = useCallback(() => {
    clearTokens();
    setUser(null);
    setHasProfile(false);
    setProfileDetails(null);
  }, []);

  const refreshProfileStatus = useCallback(async () => {
    await refreshProfileStatusInternal(setHasProfile, setProfileDetails);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user && getAccessToken()),
      isLoading,
      hasProfile,
      login,
      register,
      logout,
      loadCurrentUser,
      refreshProfileStatus,
      profileDetails,
      setProfileDetails,
    }),
    [
      user,
      isLoading,
      hasProfile,
      login,
      register,
      logout,
      loadCurrentUser,
      refreshProfileStatus,
      profileDetails,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

async function refreshProfileStatusInternal(
  setHasProfile: (value: boolean) => void,
  setProfileDetails: (details: ProfileDetails | null) => void
): Promise<boolean> {
  try {
    const details = await profileApi.getMyProfileDetails();
    setHasProfile(true);
    setProfileDetails(details);
    return true;
  } catch (error) {
    if (isHttpStatus(error, 404)) {
      setHasProfile(false);
      setProfileDetails(null);
      return false;
    }

    throw error;
  }
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth precisa ser usado dentro de AuthProvider");
  }

  return context;
}

import { createContext } from "react";

import type { ProfileDetails, ProfileSetupPayload } from "./types";

export type ProfileStatus = "idle" | "loading" | "ready" | "missing" | "error";

export type ProfileContextValue = {
  errorMessage: string | null;
  profile: ProfileDetails | null;
  refreshProfile: () => Promise<ProfileDetails | null>;
  setupProfile: (payload: ProfileSetupPayload) => Promise<ProfileDetails>;
  status: ProfileStatus;
};

export const ProfileContext = createContext<ProfileContextValue | undefined>(
  undefined,
);

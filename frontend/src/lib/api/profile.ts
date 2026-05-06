import { apiClient } from "./client";
import type {
  BaseProfile,
  ProfileDetails,
  ProfileSetupRequest,
  ProfileUpdateRequest,
} from "../../types/api";

export async function setupProfile(payload: ProfileSetupRequest): Promise<ProfileDetails> {
  const response = await apiClient.post<ProfileDetails>("/profile/setup", payload);
  return response.data;
}

export async function getMyProfile(): Promise<BaseProfile> {
  const response = await apiClient.get<BaseProfile>("/profile/me");
  return response.data;
}

export async function updateMyProfile(payload: ProfileUpdateRequest): Promise<BaseProfile> {
  const response = await apiClient.patch<BaseProfile>("/profile/me", payload);
  return response.data;
}

export async function getMyProfileDetails(): Promise<ProfileDetails> {
  const response = await apiClient.get<ProfileDetails>("/profile/me/details");
  return response.data;
}

export async function uploadAvatar(
  file: File,
  onProgress?: (percent: number) => void
): Promise<BaseProfile> {
  const fd = new FormData();
  fd.append("avatar", file);

  const response = await apiClient.post<BaseProfile>("/profile/avatar", fd, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (progressEvent: ProgressEvent) => {
      if (!progressEvent.lengthComputable) return;
      const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      onProgress?.(percent);
    },
  });

  return response.data;
}

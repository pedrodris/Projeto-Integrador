export type UserRole = "nutritionist" | "patient";

export type CurrentUser = {
  id: string;
  email: string | null;
  phone: string | null;
  app_metadata: Record<string, unknown>;
  user_metadata: Record<string, unknown>;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  access_token: string;
  refresh_token: string;
  token_type: "bearer";
  user: CurrentUser;
};

export type SignupRequest = {
  email: string;
  password: string;
};

export type SignupResponse = {
  user_id: string;
  email: string | null;
  session_created: boolean;
  access_token: string | null;
  refresh_token: string | null;
  message: string;
};

export type NutritionistSetupData = {
  crn: string;
  specialty?: string;
  bio?: string;
};

export type PatientSetupData = {
  birth_date?: string;
  sex?: string;
  height_cm?: number;
  activity_level?: string;
  goal_summary?: string;
  food_restrictions?: string;
  medical_notes?: string;
  weight_history?: string;
};

export type ProfileSetupRequest = {
  username: string;
  role: UserRole;
  phone?: string;
  avatar_url?: string;
  nutritionist_profile?: NutritionistSetupData;
  patient_profile?: PatientSetupData;
};

export type ProfileUpdateRequest = {
  username?: string;
  phone?: string;
  avatar_url?: string;
};

export type BaseProfile = {
  id: string;
  email: string | null;
  role: UserRole;
  username: string;
  phone: string | null;
  avatar_url: string | null;
  is_active: boolean;
  created_at: string | null;
  updated_at: string | null;
};

export type NutritionistProfile = {
  profile_id: string;
  crn: string;
  specialty: string | null;
  bio: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type PatientProfile = {
  profile_id: string;
  birth_date: string | null;
  sex: string | null;
  height_cm: number | null;
  activity_level: string | null;
  goal_summary: string | null;
  food_restrictions: string | null;
  medical_notes: string | null;
  weight_history: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type ProfileDetails = {
  profile: BaseProfile;
  nutritionist_profile: NutritionistProfile | null;
  patient_profile: PatientProfile | null;
};

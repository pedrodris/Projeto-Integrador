export type ProfileRole = "nutritionist" | "patient";

export type BaseProfile = {
  id: string;
  email: string | null;
  role: ProfileRole;
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
  weight_kg: number | null;
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

export type ProfileSetupPayload = {
  username: string;
  role: ProfileRole;
  phone?: string;
  avatar_url?: string;
  nutritionist_profile?: {
    crn: string;
    specialty?: string;
    bio?: string;
  };
  patient_profile?: {
    birth_date?: string;
    sex?: string;
    height_cm?: number;
    weight_kg?: number;
    activity_level?: string;
    goal_summary?: string;
    food_restrictions?: string;
    medical_notes?: string;
  };
};

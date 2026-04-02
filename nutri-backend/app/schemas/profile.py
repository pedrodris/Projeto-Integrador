from typing import Literal

from pydantic import BaseModel


class NutritionistSetupData(BaseModel):
    crn: str
    specialty: str | None = None
    bio: str | None = None


class PatientSetupData(BaseModel):
    birth_date: str | None = None
    sex: str | None = None
    height_cm: float | None = None
    activity_level: str | None = None
    goal_summary: str | None = None
    food_restrictions: str | None = None
    medical_notes: str | None = None
    weight_history: str | None = None


class ProfileSetupRequest(BaseModel):
    username: str
    role: Literal["nutritionist", "patient"]
    phone: str | None = None
    avatar_url: str | None = None
    nutritionist_profile: NutritionistSetupData | None = None
    patient_profile: PatientSetupData | None = None


class ProfileUpdateRequest(BaseModel):
    username: str | None = None
    phone: str | None = None
    avatar_url: str | None = None


class BaseProfileResponse(BaseModel):
    id: str
    email: str | None = None
    role: Literal["nutritionist", "patient"]
    username: str
    phone: str | None = None
    avatar_url: str | None = None
    is_active: bool
    created_at: str | None = None
    updated_at: str | None = None


class NutritionistProfileResponse(BaseModel):
    profile_id: str
    crn: str
    specialty: str | None = None
    bio: str | None = None
    created_at: str | None = None
    updated_at: str | None = None


class PatientProfileResponse(BaseModel):
    profile_id: str
    birth_date: str | None = None
    sex: str | None = None
    height_cm: float | None = None
    activity_level: str | None = None
    goal_summary: str | None = None
    food_restrictions: str | None = None
    medical_notes: str | None = None
    weight_history: str | None = None
    created_at: str | None = None
    updated_at: str | None = None


class MyProfileDetailsResponse(BaseModel):
    profile: BaseProfileResponse
    nutritionist_profile: NutritionistProfileResponse | None = None
    patient_profile: PatientProfileResponse | None = None
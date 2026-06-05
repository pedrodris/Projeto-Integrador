from typing import Annotated, Any

from fastapi import APIRouter, Depends

from app.api.deps import get_current_user
from app.schemas.profile import (
    BaseProfileResponse,
    MyProfileDetailsResponse,
    ProfileSetupRequest,
    ProfileUpdateRequest,
    WeightEntry,
)
from app.services.profile_service import ProfileService

router = APIRouter(
    prefix="/profile",
    tags=["profile"],
)


@router.post("/setup", response_model=MyProfileDetailsResponse)
def setup_profile(
    payload: ProfileSetupRequest,
    current_user: Annotated[Any, Depends(get_current_user)],
):
    return ProfileService.setup_profile(current_user, payload)


@router.get("/me", response_model=BaseProfileResponse)
def get_my_profile(
    current_user: Annotated[Any, Depends(get_current_user)],
):
    return ProfileService.get_my_profile(current_user)


@router.patch("/me", response_model=MyProfileDetailsResponse)
def update_my_profile(
    payload: ProfileUpdateRequest,
    current_user: Annotated[Any, Depends(get_current_user)],
):
    ProfileService.update_my_profile(current_user, payload)
    return ProfileService.get_my_profile_details(current_user)


@router.get("/weight-history", response_model=list[dict])
def get_weight_history(current_user: Annotated[Any, Depends(get_current_user)]):
    return ProfileService.get_weight_history(current_user)


@router.post("/weight-entry", response_model=list[dict])
def add_weight_entry(
    entry: WeightEntry,
    current_user: Annotated[Any, Depends(get_current_user)],
):
    return ProfileService.add_weight_entry(current_user, entry)


@router.delete("/weight-entry/{date}", response_model=list[dict])
def delete_weight_entry(
    date: str,
    current_user: Annotated[Any, Depends(get_current_user)],
):
    return ProfileService.delete_weight_entry(current_user, date)


@router.get("/me/details", response_model=MyProfileDetailsResponse)
def get_my_profile_details(
    current_user: Annotated[Any, Depends(get_current_user)],
):
    return ProfileService.get_my_profile_details(current_user)
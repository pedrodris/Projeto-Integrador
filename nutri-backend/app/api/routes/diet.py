from typing import Annotated, Any

from fastapi import APIRouter, Depends

from app.api.deps import get_current_user
from app.schemas.diet import DietPlanCreate, DietPlanResponse, DietPlanSummaryResponse
from app.services.diet_service import DietService

router = APIRouter(
    prefix="/diet",
    tags=["diet"],
)


@router.get("/plans", response_model=list[DietPlanSummaryResponse])
def list_plans(current_user: Annotated[Any, Depends(get_current_user)]):
    return DietService.list_plans(current_user)


@router.post("/plans", response_model=DietPlanResponse, status_code=201)
def create_plan(
    payload: DietPlanCreate,
    current_user: Annotated[Any, Depends(get_current_user)],
):
    return DietService.create_plan(current_user, payload)


@router.get("/my-plan", response_model=DietPlanResponse)
def get_my_plan(current_user: Annotated[Any, Depends(get_current_user)]):
    return DietService.get_my_plan(current_user)


@router.get("/plans/{plan_id}", response_model=DietPlanResponse)
def get_plan(
    plan_id: str,
    current_user: Annotated[Any, Depends(get_current_user)],
):
    return DietService.get_plan(plan_id, current_user)

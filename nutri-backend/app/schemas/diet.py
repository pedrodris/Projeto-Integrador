from datetime import date
from typing import Optional
from pydantic import BaseModel


class MealItemCreate(BaseModel):
    food_name: str
    quantity: float = 0
    unit: str = "g"
    calories: Optional[float] = None
    substitution: Optional[str] = None
    notes: Optional[str] = None


class MealCreate(BaseModel):
    name: str
    time_suggestion: Optional[str] = None
    notes: Optional[str] = None
    items: list[MealItemCreate] = []


class DietPlanCreate(BaseModel):
    title: str
    description: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    meals: list[MealCreate] = []


class MealItemResponse(BaseModel):
    id: str
    meal_id: str
    food_name: str
    quantity: float
    unit: str
    calories: Optional[float] = None
    substitution: Optional[str] = None
    notes: Optional[str] = None
    order_index: int


class MealResponse(BaseModel):
    id: str
    diet_plan_id: str
    name: str
    time_suggestion: Optional[str] = None
    notes: Optional[str] = None
    order_index: int
    items: list[MealItemResponse]


class DietPlanResponse(BaseModel):
    id: str
    nutritionist_id: str
    title: str
    description: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    status: str
    created_at: str
    meals: list[MealResponse]


class DietPlanSummaryResponse(BaseModel):
    id: str
    nutritionist_id: str
    title: str
    description: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    status: str
    created_at: str
    meal_count: int

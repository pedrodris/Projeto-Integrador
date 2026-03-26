# app/api/routes/auth.py

from typing import Annotated, Any

from fastapi import APIRouter, Depends

from app.api.deps import get_current_user
from app.schemas.auth import CurrentUserResponse

router = APIRouter(
    prefix="/auth",
    tags=["auth"],
)


@router.get("/me", response_model=CurrentUserResponse)
def get_me(
    current_user: Annotated[Any, Depends(get_current_user)],
):
    """
    Retorna os dados básicos do usuário autenticado.
    """
    return {
        "id": str(getattr(current_user, "id", "")),
        "email": getattr(current_user, "email", None),
        "phone": getattr(current_user, "phone", None),
        "app_metadata": getattr(current_user, "app_metadata", {}) or {},
        "user_metadata": getattr(current_user, "user_metadata", {}) or {},
    }
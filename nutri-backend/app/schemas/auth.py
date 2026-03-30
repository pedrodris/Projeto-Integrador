# app/schemas/auth.py

from typing import Any

from pydantic import BaseModel, Field


class CurrentUserResponse(BaseModel):
    """
    Modelo de resposta do usuário autenticado.
    Um conjunto pequeno e seguro de campos.
    """
    id: str
    email: str | None = None
    phone: str | None = None
    app_metadata: dict[str, Any] = Field(default_factory=dict)
    user_metadata: dict[str, Any] = Field(default_factory=dict)
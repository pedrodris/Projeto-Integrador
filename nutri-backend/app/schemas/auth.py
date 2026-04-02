from typing import Any

from pydantic import BaseModel, EmailStr, Field


class CurrentUserResponse(BaseModel):
    id: str
    email: str | None = None
    phone: str | None = None
    app_metadata: dict[str, Any] = Field(default_factory=dict)
    user_metadata: dict[str, Any] = Field(default_factory=dict)


class SignupRequest(BaseModel):
    email: EmailStr
    password: str


class SignupResponse(BaseModel):
    user_id: str
    email: str | None = None
    session_created: bool
    access_token: str | None = None
    refresh_token: str | None = None
    message: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class LoginResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: CurrentUserResponse
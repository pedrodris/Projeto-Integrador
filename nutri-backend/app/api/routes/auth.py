from typing import Annotated, Any

from fastapi import APIRouter, Depends, HTTPException, status

from app.api.deps import get_current_user
from app.core.supabase import supabase_public
from app.schemas.auth import (
    CurrentUserResponse,
    LoginRequest,
    LoginResponse,
    SignupRequest,
    SignupResponse,
)

router = APIRouter(
    prefix="/auth",
    tags=["auth"],
)


@router.post("/signup", response_model=SignupResponse, status_code=status.HTTP_201_CREATED)
def signup(payload: SignupRequest):
    """
    Cria um usuário no Supabase Auth usando email e senha.
    Dependendo da configuração de confirmação de email do projeto,
    o signup pode ou não retornar sessão imediatamente.
    """
    try:
        response = supabase_public.auth.sign_up(
            {
                "email": payload.email,
                "password": payload.password,
            }
        )
    except Exception as exc:
        detail = getattr(exc, "message", None) or str(exc)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Falha no signup: {detail}",
        ) from exc

    user = getattr(response, "user", None)
    session = getattr(response, "session", None)

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Signup não retornou usuário válido.",
        )

    if session is None:
        return {
            "user_id": str(getattr(user, "id", "")),
            "email": getattr(user, "email", None),
            "session_created": False,
            "access_token": None,
            "refresh_token": None,
            "message": (
                "Usuário criado. Se a confirmação de email estiver habilitada no Supabase, "
                "o usuário precisará confirmar o email antes de fazer login."
            ),
        }

    return {
        "user_id": str(getattr(user, "id", "")),
        "email": getattr(user, "email", None),
        "session_created": True,
        "access_token": session.access_token,
        "refresh_token": session.refresh_token,
        "message": "Usuário criado com sessão ativa.",
    }


@router.post("/login", response_model=LoginResponse)
def login(payload: LoginRequest):
    """
    Faz login com email e senha no Supabase Auth e retorna a sessão.
    """
    try:
        response = supabase_public.auth.sign_in_with_password(
            {
                "email": payload.email,
                "password": payload.password,
            }
        )
    except Exception as exc:
        detail = getattr(exc, "message", None) or str(exc)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Falha no login: {detail}",
        ) from exc

    session = getattr(response, "session", None)
    user = getattr(response, "user", None)

    if session is None or user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Login não retornou sessão válida.",
        )

    return {
        "access_token": session.access_token,
        "refresh_token": session.refresh_token,
        "token_type": "bearer",
        "user": {
            "id": str(getattr(user, "id", "")),
            "email": getattr(user, "email", None),
            "phone": getattr(user, "phone", None),
            "app_metadata": getattr(user, "app_metadata", {}) or {},
            "user_metadata": getattr(user, "user_metadata", {}) or {},
        },
    }


@router.get("/me", response_model=CurrentUserResponse)
def get_me(
    current_user: Annotated[Any, Depends(get_current_user)],
):
    return {
        "id": str(getattr(current_user, "id", "")),
        "email": getattr(current_user, "email", None),
        "phone": getattr(current_user, "phone", None),
        "app_metadata": getattr(current_user, "app_metadata", {}) or {},
        "user_metadata": getattr(current_user, "user_metadata", {}) or {},
    }
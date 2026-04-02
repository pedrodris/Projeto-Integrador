from typing import Any, Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.core.supabase import supabase_public

# Esquema de segurança Bearer para o Swagger/OpenAPI
bearer_scheme = HTTPBearer(auto_error=False)


def get_bearer_token(
    credentials: Annotated[
        HTTPAuthorizationCredentials | None,
        Depends(bearer_scheme),
    ],
) -> str:
    """
    Extrai o token Bearer do header Authorization.
    """
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Header Authorization ausente.",
        )

    if credentials.scheme.lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Header Authorization inválido. Use Bearer <token>.",
        )

    return credentials.credentials


def get_current_user(
    token: Annotated[str, Depends(get_bearer_token)],
) -> Any:
    """
    Valida o JWT no Supabase e retorna o usuário autenticado.
    """
    try:
        response = supabase_public.auth.get_user(token)
    except Exception as exc:
        detail = getattr(exc, "message", None) or str(exc)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Token inválido ou expirado: {detail}",
        ) from exc

    user = getattr(response, "user", None)

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuário não autenticado.",
        )

    return user
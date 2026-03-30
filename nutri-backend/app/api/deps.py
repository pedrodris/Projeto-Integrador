# app/api/deps.py

from typing import Annotated, Any

from fastapi import Depends, Header, HTTPException, status

from app.core.supabase import supabase


def get_bearer_token(
    authorization: Annotated[str | None, Header()] = None,
) -> str:
    """
    Extrai o token do header Authorization.

    Esperado:
    Authorization: Bearer <token>
    """
    if authorization is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Header Authorization ausente.",
        )

    scheme, _, token = authorization.partition(" ")

    if scheme.lower() != "bearer" or not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Header Authorization inválido. Use: Bearer <token>",
        )

    return token


def get_current_user(
    token: Annotated[str, Depends(get_bearer_token)],
) -> Any:
    """
    Valida o JWT do usuário no Supabase e retorna o objeto user.
    """
    try:
        response = supabase.auth.get_user(token)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido ou expirado.",
        ) from exc

    user = getattr(response, "user", None)

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuário não autenticado.",
        )

    return user
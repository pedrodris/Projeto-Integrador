from typing import Optional
from supabase import Client, create_client

from app.core.config import settings


def _require_env(value: str, name: str) -> Optional[str]:
    return value if value else None


def get_public_supabase_client() -> Optional[Client]:
    url = settings.SUPABASE_URL
    key = settings.SUPABASE_KEY

    if settings.ENVIRONMENT.lower() == "dev" or "example.supabase.co" in (url or ""):
        from app.core.supabase_mock import get_mock_supabase_client
        return get_mock_supabase_client()
    
    if not url or not key:
        # Fall back to mock client for development
        from app.core.supabase_mock import get_mock_supabase_client
        return get_mock_supabase_client()
    
    try:
        return create_client(url, key)
    except Exception:
        from app.core.supabase_mock import get_mock_supabase_client
        return get_mock_supabase_client()


def get_admin_supabase_client() -> Optional[Client]:
    url = settings.SUPABASE_URL
    admin_key = settings.SUPABASE_SECRET_KEY or getattr(settings, "SUPABASE_SERVICE_ROLE_KEY", None)

    if settings.ENVIRONMENT.lower() == "dev" or "example.supabase.co" in (url or ""):
        from app.core.supabase_mock import get_mock_supabase_client
        return get_mock_supabase_client()

    if not url or not admin_key:
        from app.core.supabase_mock import get_mock_supabase_client
        return get_mock_supabase_client()
    
    try:
        return create_client(url, admin_key)
    except Exception:
        from app.core.supabase_mock import get_mock_supabase_client
        return get_mock_supabase_client()


supabase_public: Optional[Client] = get_public_supabase_client()
supabase_admin: Optional[Client] = get_admin_supabase_client()
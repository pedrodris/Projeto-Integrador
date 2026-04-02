from supabase import Client, create_client

from app.core.config import settings


def _require_env(value: str, name: str) -> str:
    if not value:
        raise RuntimeError(f"{name} não foi configurada no .env")
    return value


def get_public_supabase_client() -> Client:
    url = _require_env(settings.SUPABASE_URL, "SUPABASE_URL")
    key = _require_env(settings.SUPABASE_KEY, "SUPABASE_KEY")
    return create_client(url, key)


def get_admin_supabase_client() -> Client:
    url = _require_env(settings.SUPABASE_URL, "SUPABASE_URL")
    admin_key = settings.SUPABASE_SECRET_KEY or settings.SUPABASE_SERVICE_ROLE_KEY

    if not admin_key:
        raise RuntimeError(
            "Configure SUPABASE_SECRET_KEY ou SUPABASE_SERVICE_ROLE_KEY no .env"
        )

    return create_client(url, admin_key)


supabase_public: Client = get_public_supabase_client()
supabase_admin: Client = get_admin_supabase_client()
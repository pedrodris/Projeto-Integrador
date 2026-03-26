# app/core/supabase.py

from supabase import Client, create_client

from app.core.config import settings


def get_supabase_client() -> Client:
    """
    Cria e retorna um client do Supabase.

    Se as variáveis de ambiente não estiverem preenchidas,
    interrompemos a inicialização com um erro claro.
    """
    if not settings.SUPABASE_URL:
        raise RuntimeError("SUPABASE_URL não foi configurada no .env")

    if not settings.SUPABASE_KEY:
        raise RuntimeError("SUPABASE_KEY não foi configurada no .env")

    return create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)


# Instância única reutilizável no projeto
supabase: Client = get_supabase_client()
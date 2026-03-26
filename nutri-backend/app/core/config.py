# app/core/config.py

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Nome do projeto
    PROJECT_NAME: str = "Nutri Backend"

    # Ambiente atual
    ENVIRONMENT: str = "dev"

    # Prefixo base da API
    API_V1_PREFIX: str = "/api/v1"

    # URL do frontend local
    FRONTEND_URL: str = "http://localhost:3000"

    # Supabase
    SUPABASE_URL: str = ""
    SUPABASE_KEY: str = ""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()
# app/api/routes/health.py

from fastapi import APIRouter
from app.core.config import settings

router = APIRouter(prefix="/health", tags=["health"])


@router.get("/")
def health_check():
    return {
        "status": "ok",
        "service": settings.PROJECT_NAME,
        "environment": settings.ENVIRONMENT,
    }
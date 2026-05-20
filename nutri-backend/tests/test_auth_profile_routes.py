import os
import sys
from types import SimpleNamespace
from pathlib import Path

from fastapi import HTTPException
from fastapi.testclient import TestClient

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

os.environ.setdefault("SUPABASE_URL", "https://example.supabase.co")
os.environ.setdefault("SUPABASE_KEY", "public-key")
os.environ.setdefault("SUPABASE_SECRET_KEY", "service-key")

from app.api import deps
from app.api.routes import auth
from app.main import app
from app.services.profile_service import ProfileService


client = TestClient(app)


def test_signup_returns_created_without_session(monkeypatch):
    response_payload = SimpleNamespace(
        user=SimpleNamespace(id="user-1", email="teste@example.com"),
        session=None,
    )

    monkeypatch.setattr(
        auth.supabase_public.auth,
        "sign_up",
        lambda payload: response_payload,
    )

    response = client.post(
        "/api/v1/auth/signup",
        json={"email": "teste@example.com", "password": "123456"},
    )

    assert response.status_code == 201
    assert response.json()["session_created"] is False
    assert response.json()["email"] == "teste@example.com"


def test_login_returns_session(monkeypatch):
    response_payload = SimpleNamespace(
        user=SimpleNamespace(
            id="user-1",
            email="teste@example.com",
            phone=None,
            app_metadata={},
            user_metadata={},
        ),
        session=SimpleNamespace(access_token="access-token", refresh_token="refresh-token"),
    )

    monkeypatch.setattr(
        auth.supabase_public.auth,
        "sign_in_with_password",
        lambda payload: response_payload,
    )

    response = client.post(
        "/api/v1/auth/login",
        json={"email": "teste@example.com", "password": "123456"},
    )

    assert response.status_code == 200
    assert response.json()["access_token"] == "access-token"
    assert response.json()["user"]["email"] == "teste@example.com"


def test_me_uses_bearer_token(monkeypatch):
    monkeypatch.setattr(
        deps.supabase_public.auth,
        "get_user",
        lambda token: SimpleNamespace(
            user=SimpleNamespace(
                id="user-1",
                email="teste@example.com",
                phone=None,
                app_metadata={},
                user_metadata={},
            )
        ),
    )

    response = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": "Bearer access-token"},
    )

    assert response.status_code == 200
    assert response.json()["id"] == "user-1"


def test_profile_details_returns_not_found_when_profile_is_missing(monkeypatch):
    monkeypatch.setattr(
        deps.supabase_public.auth,
        "get_user",
        lambda token: SimpleNamespace(
            user=SimpleNamespace(
                id="user-1",
                email="teste@example.com",
                phone=None,
                app_metadata={},
                user_metadata={},
            )
        ),
    )

    def raise_missing_profile(current_user):
        raise HTTPException(status_code=404, detail="Perfil ainda nao configurado.")

    monkeypatch.setattr(ProfileService, "get_my_profile_details", raise_missing_profile)

    response = client.get(
        "/api/v1/profile/me/details",
        headers={"Authorization": "Bearer access-token"},
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "Perfil ainda nao configurado."


def test_profile_setup_returns_created_profile(monkeypatch):
    monkeypatch.setattr(
        deps.supabase_public.auth,
        "get_user",
        lambda token: SimpleNamespace(
            user=SimpleNamespace(
                id="user-1",
                email="teste@example.com",
                phone=None,
                app_metadata={},
                user_metadata={},
            )
        ),
    )

    monkeypatch.setattr(
        ProfileService,
        "setup_profile",
        lambda current_user, payload: {
            "profile": {
                "id": "user-1",
                "email": "teste@example.com",
                "role": "patient",
                "username": "Teste",
                "phone": None,
                "avatar_url": None,
                "is_active": True,
                "created_at": None,
                "updated_at": None,
            },
            "nutritionist_profile": None,
            "patient_profile": {
                "profile_id": "user-1",
                "birth_date": None,
                "sex": None,
                "height_cm": None,
                "activity_level": None,
                "goal_summary": None,
                "food_restrictions": None,
                "medical_notes": None,
                "weight_history": None,
                "created_at": None,
                "updated_at": None,
            },
        },
    )

    response = client.post(
        "/api/v1/profile/setup",
        headers={"Authorization": "Bearer access-token"},
        json={
            "username": "Teste",
            "role": "patient",
            "phone": None,
            "patient_profile": {},
        },
    )

    assert response.status_code == 200
    assert response.json()["profile"]["username"] == "Teste"

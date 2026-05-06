from typing import Any
from datetime import datetime

from fastapi import HTTPException, status
from fastapi import UploadFile
import os
import time
from app.core.config import settings

from app.core.supabase import supabase_admin
from app.core.memory_db import get_memory_db
from app.schemas.profile import ProfileSetupRequest, ProfileUpdateRequest


class ProfileService:
    @staticmethod
    def _use_memory_db() -> bool:
        """Check if we should use in-memory database."""
        # Check if supabase_admin is a mock or None
        if supabase_admin is None:
            return True
        # Check if it's a mock object (doesn't have 'table' method)
        return not hasattr(supabase_admin, 'table')
    
    @staticmethod
    def _get_user_id(current_user: Any) -> str:
        user_id = str(getattr(current_user, "id", ""))
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Usuário autenticado sem ID válido.",
            )
        return user_id

    @staticmethod
    def _get_user_email(current_user: Any) -> str | None:
        return getattr(current_user, "email", None)

    @staticmethod
    def _normalize_profile(row: dict, email: str | None = None) -> dict:
        return {
            "id": str(row.get("id", "")),
            "email": email,
            "role": row.get("role"),
            "username": row.get("username"),
            "phone": row.get("phone"),
            "avatar_url": row.get("avatar_url"),
            "is_active": row.get("is_active", True),
            "created_at": row.get("created_at"),
            "updated_at": row.get("updated_at"),
        }

    @staticmethod
    def get_profile_row(user_id: str) -> dict | None:
        if ProfileService._use_memory_db():
            db = get_memory_db()
            return db.get_profile(user_id)
        
        response = (
            supabase_admin
            .table("profiles")
            .select("*")
            .eq("id", user_id)
            .limit(1)
            .execute()
        )

        rows = response.data or []
        return rows[0] if rows else None

    @staticmethod
    def setup_profile(current_user: Any, payload: ProfileSetupRequest) -> dict:
        user_id = ProfileService._get_user_id(current_user)
        email = ProfileService._get_user_email(current_user)

        existing_profile = ProfileService.get_profile_row(user_id)
        if existing_profile:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Perfil já foi configurado para este usuário.",
            )

        if payload.role == "nutritionist" and not payload.nutritionist_profile:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="nutritionist_profile é obrigatório para role=nutritionist.",
            )

        if ProfileService._use_memory_db():
            # Use in-memory database
            db = get_memory_db()
            db.create_profile(
                user_id,
                payload.role,
                payload.username,
                payload.phone,
                payload.avatar_url,
            )
            
            if payload.role == "nutritionist":
                db.create_nutritionist_profile(
                    user_id,
                    payload.nutritionist_profile.crn,
                    payload.nutritionist_profile.specialty,
                    payload.nutritionist_profile.bio,
                )
            elif payload.role == "patient":
                patient_data = (
                    payload.patient_profile.model_dump(exclude_none=True)
                    if payload.patient_profile else {}
                )
                db.create_patient_profile(user_id, **patient_data)
        else:
            # Use Supabase
            profile_insert = (
                supabase_admin
                .table("profiles")
                .insert({
                    "id": user_id,
                    "role": payload.role,
                    "username": payload.username,
                    "phone": payload.phone,
                    "avatar_url": payload.avatar_url,
                })
                .execute()
            )

            profile_rows = profile_insert.data or []
            if not profile_rows:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Não foi possível criar o perfil base.",
                )

            try:
                if payload.role == "nutritionist":
                    supabase_admin.table("nutritionist_profiles").insert({
                        "profile_id": user_id,
                        "crn": payload.nutritionist_profile.crn,
                        "specialty": payload.nutritionist_profile.specialty,
                        "bio": payload.nutritionist_profile.bio,
                    }).execute()

                elif payload.role == "patient":
                    patient_data = (
                        payload.patient_profile.model_dump(exclude_none=True)
                        if payload.patient_profile else {}
                    )

                    supabase_admin.table("patient_profiles").insert({
                        "profile_id": user_id,
                        **patient_data,
                    }).execute()

            except Exception as exc:
                supabase_admin.table("profiles").delete().eq("id", user_id).execute()
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Perfil base foi criado, mas a tabela específica falhou.",
                ) from exc

        return ProfileService.get_my_profile_details(current_user)

    @staticmethod
    def get_my_profile(current_user: Any) -> dict:
        user_id = ProfileService._get_user_id(current_user)
        email = ProfileService._get_user_email(current_user)

        row = ProfileService.get_profile_row(user_id)
        if not row:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Perfil ainda não configurado. Use /profile/setup primeiro.",
            )

        return ProfileService._normalize_profile(row, email=email)

    @staticmethod
    def update_my_profile(current_user: Any, payload: ProfileUpdateRequest) -> dict:
        user_id = ProfileService._get_user_id(current_user)
        email = ProfileService._get_user_email(current_user)

        current_row = ProfileService.get_profile_row(user_id)
        if not current_row:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Perfil ainda não configurado. Use /profile/setup primeiro.",
            )

        update_data = payload.model_dump(exclude_none=True)

        if not update_data:
            return ProfileService._normalize_profile(current_row, email=email)

        if ProfileService._use_memory_db():
            db = get_memory_db()
            updated_row = db.update_profile(user_id, **update_data)
            if not updated_row:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Perfil não encontrado para atualização.",
                )
            return ProfileService._normalize_profile(updated_row, email=email)
        else:
            response = (
                supabase_admin
                .table("profiles")
                .update(update_data)
                .eq("id", user_id)
                .execute()
            )

            rows = response.data or []
            if not rows:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Perfil não encontrado para atualização.",
                )

            return ProfileService._normalize_profile(rows[0], email=email)

    @staticmethod
    def get_my_profile_details(current_user: Any) -> dict:
        user_id = ProfileService._get_user_id(current_user)
        email = ProfileService._get_user_email(current_user)

        profile_row = ProfileService.get_profile_row(user_id)
        if not profile_row:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Perfil ainda não configurado. Use /profile/setup primeiro.",
            )

        if ProfileService._use_memory_db():
            db = get_memory_db()
            nutritionist_prof = db.get_nutritionist_profile(user_id)
            patient_prof = db.get_patient_profile(user_id)
        else:
            nutritionist_response = (
                supabase_admin
                .table("nutritionist_profiles")
                .select("*")
                .eq("profile_id", user_id)
                .limit(1)
                .execute()
            )

            patient_response = (
                supabase_admin
                .table("patient_profiles")
                .select("*")
                .eq("profile_id", user_id)
                .limit(1)
                .execute()
            )

            nutritionist_rows = nutritionist_response.data or []
            patient_rows = patient_response.data or []
            
            nutritionist_prof = nutritionist_rows[0] if nutritionist_rows else None
            patient_prof = patient_rows[0] if patient_rows else None

        return {
            "profile": ProfileService._normalize_profile(profile_row, email=email),
            "nutritionist_profile": nutritionist_prof,
            "patient_profile": patient_prof,
        }

    @staticmethod
    async def upload_avatar(current_user: Any, avatar: UploadFile | None) -> dict:
        user_id = ProfileService._get_user_id(current_user)
        email = ProfileService._get_user_email(current_user)

        if not avatar:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Nenhum arquivo enviado.")

        # ensure upload directory exists
        upload_dir = os.path.join(os.getcwd(), "static", "uploads")
        os.makedirs(upload_dir, exist_ok=True)

        # build safe filename
        timestamp = int(time.time())
        original = os.path.basename(avatar.filename)
        filename = f"{user_id}_{timestamp}_{original}"
        file_path = os.path.join(upload_dir, filename)

        # write file
        content = await avatar.read()
        with open(file_path, "wb") as f:
            f.write(content)

        # build public URL
        public_url = settings.BACKEND_URL.rstrip("/") + f"/static/uploads/{filename}"

        # update profile row with avatar_url
        if ProfileService._use_memory_db():
            db = get_memory_db()
            updated = db.update_profile(user_id, avatar_url=public_url)
            if not updated:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Perfil não encontrado para atualização.")
            return ProfileService._normalize_profile(updated, email=email)
        else:
            response = (
                supabase_admin
                .table("profiles")
                .update({"avatar_url": public_url})
                .eq("id", user_id)
                .execute()
            )

            rows = response.data or []
            if not rows:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Perfil não encontrado para atualização.")
            return ProfileService._normalize_profile(rows[0], email=email)
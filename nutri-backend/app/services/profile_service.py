from typing import Any

from fastapi import HTTPException, status

from app.core.supabase import supabase_admin
from app.schemas.profile import ProfileSetupRequest, ProfileUpdateRequest


class ProfileService:
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

        return {
            "profile": ProfileService._normalize_profile(profile_row, email=email),
            "nutritionist_profile": nutritionist_rows[0] if nutritionist_rows else None,
            "patient_profile": patient_rows[0] if patient_rows else None,
        }
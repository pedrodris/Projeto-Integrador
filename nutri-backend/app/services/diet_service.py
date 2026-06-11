from typing import Any

from fastapi import HTTPException, status

from app.core.supabase import supabase_admin
from app.schemas.diet import DietPlanCreate


class DietService:
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
    def _normalize_item(row: dict) -> dict:
        return {
            "id": str(row.get("id", "")),
            "meal_id": str(row.get("meal_id", "")),
            "food_name": row.get("food_name", ""),
            "quantity": float(row.get("quantity", 0)),
            "unit": row.get("unit", "g"),
            "calories": row.get("calories"),
            "substitution": row.get("substitution"),
            "notes": row.get("notes"),
            "order_index": row.get("order_index", 0),
        }

    @staticmethod
    def _normalize_meal(row: dict, items: list[dict]) -> dict:
        return {
            "id": str(row.get("id", "")),
            "diet_plan_id": str(row.get("diet_plan_id", "")),
            "name": row.get("name", ""),
            "time_suggestion": row.get("time_suggestion"),
            "notes": row.get("notes"),
            "order_index": row.get("order_index", 0),
            "items": items,
        }

    @staticmethod
    def _normalize_plan(row: dict, meals: list[dict]) -> dict:
        return {
            "id": str(row.get("id", "")),
            "nutritionist_id": str(row.get("nutritionist_id", "")),
            "title": row.get("title", ""),
            "description": row.get("description"),
            "start_date": str(row["start_date"]) if row.get("start_date") else None,
            "end_date": str(row["end_date"]) if row.get("end_date") else None,
            "status": row.get("status", "draft"),
            "created_at": str(row.get("created_at", "")),
            "meals": meals,
        }

    @staticmethod
    def _fetch_plan_with_meals(plan_id: str) -> dict:
        plan_res = (
            supabase_admin
            .table("diet_plans")
            .select("*")
            .eq("id", plan_id)
            .limit(1)
            .execute()
        )
        plan_rows = plan_res.data or []
        if not plan_rows:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Plano não encontrado.",
            )

        plan_row = plan_rows[0]

        meals_res = (
            supabase_admin
            .table("diet_meals")
            .select("*")
            .eq("diet_plan_id", plan_id)
            .order("order_index")
            .execute()
        )
        meal_rows = meals_res.data or []

        meals = []
        for meal_row in meal_rows:
            meal_id = str(meal_row.get("id", ""))
            items_res = (
                supabase_admin
                .table("diet_meal_items")
                .select("*")
                .eq("meal_id", meal_id)
                .order("order_index")
                .execute()
            )
            items = [DietService._normalize_item(r) for r in (items_res.data or [])]
            meals.append(DietService._normalize_meal(meal_row, items))

        return DietService._normalize_plan(plan_row, meals)

    @staticmethod
    def list_plans(current_user: Any) -> list[dict]:
        user_id = DietService._get_user_id(current_user)

        plans_res = (
            supabase_admin
            .table("diet_plans")
            .select("*, diet_meals(id)")
            .eq("nutritionist_id", user_id)
            .order("created_at", desc=True)
            .execute()
        )

        result = []
        for plan in (plans_res.data or []):
            result.append({
                "id": str(plan.get("id", "")),
                "nutritionist_id": str(plan.get("nutritionist_id", "")),
                "title": plan.get("title", ""),
                "description": plan.get("description"),
                "start_date": str(plan["start_date"]) if plan.get("start_date") else None,
                "end_date": str(plan["end_date"]) if plan.get("end_date") else None,
                "status": plan.get("status", "draft"),
                "created_at": str(plan.get("created_at", "")),
                "meal_count": len(plan.get("diet_meals", [])),
            })

        return result

    @staticmethod
    def create_plan(current_user: Any, payload: DietPlanCreate) -> dict:
        user_id = DietService._get_user_id(current_user)

        plan_res = (
            supabase_admin
            .table("diet_plans")
            .insert({
                "nutritionist_id": user_id,
                "title": payload.title,
                "description": payload.description,
                "start_date": str(payload.start_date) if payload.start_date else None,
                "end_date": str(payload.end_date) if payload.end_date else None,
                "status": "draft",
            })
            .execute()
        )
        plan_rows = plan_res.data or []
        if not plan_rows:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Não foi possível criar o plano.",
            )

        plan_id = plan_rows[0]["id"]

        for meal_idx, meal in enumerate(payload.meals):
            meal_res = (
                supabase_admin
                .table("diet_meals")
                .insert({
                    "diet_plan_id": plan_id,
                    "name": meal.name,
                    "time_suggestion": meal.time_suggestion,
                    "notes": meal.notes,
                    "order_index": meal_idx,
                })
                .execute()
            )
            meal_rows = meal_res.data or []
            if not meal_rows or not meal.items:
                continue

            meal_id = meal_rows[0]["id"]
            supabase_admin.table("diet_meal_items").insert([
                {
                    "meal_id": meal_id,
                    "food_name": item.food_name,
                    "quantity": item.quantity,
                    "unit": item.unit,
                    "calories": item.calories,
                    "substitution": item.substitution,
                    "notes": item.notes,
                    "order_index": item_idx,
                }
                for item_idx, item in enumerate(meal.items)
            ]).execute()

        return DietService._fetch_plan_with_meals(plan_id)

    @staticmethod
    def get_plan(plan_id: str, current_user: Any) -> dict:
        user_id = DietService._get_user_id(current_user)
        plan = DietService._fetch_plan_with_meals(plan_id)
        if plan["nutritionist_id"] != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Acesso negado.",
            )
        return plan

    @staticmethod
    def get_my_plan(current_user: Any) -> dict:
        user_id = DietService._get_user_id(current_user)

        # Prefer active plan, fallback to most recent
        for filters in [
            {"status": "active"},
            {},
        ]:
            query = (
                supabase_admin
                .table("diet_plans")
                .select("id")
                .eq("nutritionist_id", user_id)
                .order("created_at", desc=True)
                .limit(1)
            )
            for k, v in filters.items():
                query = query.eq(k, v)

            rows = (query.execute()).data or []
            if rows:
                return DietService._fetch_plan_with_meals(rows[0]["id"])

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Nenhum plano alimentar encontrado.",
        )

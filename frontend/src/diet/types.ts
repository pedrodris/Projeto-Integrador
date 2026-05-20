export type MealItem = {
  id: string;
  meal_id: string;
  food_name: string;
  quantity: number;
  unit: string;
  calories: number | null;
  substitution: string | null;
  notes: string | null;
  order_index: number;
};

export type Meal = {
  id: string;
  diet_plan_id: string;
  name: string;
  time_suggestion: string | null;
  notes: string | null;
  order_index: number;
  items: MealItem[];
};

export type DietPlan = {
  id: string;
  nutritionist_id: string;
  title: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  status: "draft" | "active" | "completed";
  created_at: string;
  meals: Meal[];
};

export type DietPlanSummary = {
  id: string;
  nutritionist_id: string;
  title: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  status: "draft" | "active" | "completed";
  created_at: string;
  meal_count: number;
};

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, Circle, RefreshCw, ShoppingCart } from "lucide-react";

import { api } from "../lib/api";
import type { DietPlan, Meal, MealItem } from "../diet/types";

const MOCK_PLAN: DietPlan = {
  id: "mock-plan",
  nutritionist_id: "nutri-id",
  title: "Plano emagrecimento — Fase 1",
  description: "Déficit calórico moderado com foco em proteína. Beba pelo menos 2L de água por dia.",
  start_date: "2026-05-20",
  end_date: "2026-06-20",
  status: "active",
  created_at: new Date().toISOString(),
  meals: [
    {
      id: "meal-1", diet_plan_id: "mock-plan", order_index: 0,
      name: "Café da manhã", time_suggestion: "07:00",
      notes: "Consumir até 30 min após acordar",
      items: [
        { id: "i1", meal_id: "meal-1", food_name: "Aveia", quantity: 50, unit: "g", calories: 180, substitution: "Granola sem açúcar", notes: null, order_index: 0 },
        { id: "i2", meal_id: "meal-1", food_name: "Banana", quantity: 1, unit: "unidade", calories: 90, substitution: null, notes: null, order_index: 1 },
        { id: "i3", meal_id: "meal-1", food_name: "Leite desnatado", quantity: 200, unit: "ml", calories: 70, substitution: "Leite de aveia", notes: null, order_index: 2 },
      ],
    },
    {
      id: "meal-2", diet_plan_id: "mock-plan", order_index: 1,
      name: "Almoço", time_suggestion: "12:30",
      notes: null,
      items: [
        { id: "i4", meal_id: "meal-2", food_name: "Arroz integral", quantity: 120, unit: "g", calories: 160, substitution: "Quinoa", notes: null, order_index: 0 },
        { id: "i5", meal_id: "meal-2", food_name: "Feijão", quantity: 80, unit: "g", calories: 90, substitution: null, notes: null, order_index: 1 },
        { id: "i6", meal_id: "meal-2", food_name: "Frango grelhado", quantity: 150, unit: "g", calories: 220, substitution: "Peixe grelhado", notes: "Temperado com ervas", order_index: 2 },
        { id: "i7", meal_id: "meal-2", food_name: "Salada mista", quantity: 1, unit: "porção", calories: 30, substitution: null, notes: null, order_index: 3 },
      ],
    },
    {
      id: "meal-3", diet_plan_id: "mock-plan", order_index: 2,
      name: "Lanche da tarde", time_suggestion: "16:00",
      notes: null,
      items: [
        { id: "i8", meal_id: "meal-3", food_name: "Iogurte grego", quantity: 170, unit: "g", calories: 100, substitution: null, notes: null, order_index: 0 },
        { id: "i9", meal_id: "meal-3", food_name: "Maçã", quantity: 1, unit: "unidade", calories: 80, substitution: "Pera", notes: null, order_index: 1 },
      ],
    },
    {
      id: "meal-4", diet_plan_id: "mock-plan", order_index: 3,
      name: "Jantar", time_suggestion: "19:30",
      notes: "Evitar carboidratos simples",
      items: [
        { id: "i10", meal_id: "meal-4", food_name: "Salmão", quantity: 150, unit: "g", calories: 250, substitution: "Atum fresco", notes: null, order_index: 0 },
        { id: "i11", meal_id: "meal-4", food_name: "Batata doce", quantity: 100, unit: "g", calories: 90, substitution: null, notes: null, order_index: 1 },
        { id: "i12", meal_id: "meal-4", food_name: "Brócolis", quantity: 100, unit: "g", calories: 35, substitution: "Couve-flor", notes: null, order_index: 2 },
      ],
    },
  ],
};

type Checked = Record<string, boolean>;

const DAYS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

function checklistKey(planId: string, day?: number) {
  return day !== undefined
    ? `nutricare.checklist.${planId}.day${day}`
    : `nutricare.checklist.${planId}`;
}

function loadChecked(planId: string, day?: number): Checked {
  try {
    return JSON.parse(localStorage.getItem(checklistKey(planId, day)) || "{}");
  } catch {
    return {};
  }
}

function saveChecked(planId: string, data: Checked, day?: number) {
  localStorage.setItem(checklistKey(planId, day), JSON.stringify(data));
}

function todayIndex() {
  return (new Date().getDay() + 6) % 7; // 0=Seg … 6=Dom
}

type ViewMode = "dia" | "semana";

export default function MyDiet() {
  const [plan, setPlan] = useState<DietPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<ViewMode>("dia");
  const [selectedDay, setSelectedDay] = useState(todayIndex());
  const [checked, setChecked] = useState<Checked>({});

  function fetchPlan() {
    setLoading(true);
    setError(null);
    api
      .get<DietPlan>("/diet/my-plan")
      .then((res) => {
        setPlan(res.data);
        setChecked(loadChecked(res.data.id, selectedDay));
      })
      .catch(() => {
        setPlan(MOCK_PLAN);
        setChecked(loadChecked(MOCK_PLAN.id, selectedDay));
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchPlan();
  }, []);

  useEffect(() => {
    if (plan) setChecked(loadChecked(plan.id, selectedDay));
  }, [selectedDay, plan?.id]);

  function toggle(itemId: string) {
    if (!plan) return;
    setChecked((prev) => {
      const next = { ...prev, [itemId]: !prev[itemId] };
      saveChecked(plan.id, next, selectedDay);
      return next;
    });
  }

  const totalItems = plan?.meals.flatMap((m) => m.items).length ?? 0;
  const doneItems = Object.values(checked).filter(Boolean).length;
  const progress = totalItems > 0 ? Math.round((doneItems / totalItems) * 100) : 0;

  return (
    <main className="min-h-screen bg-gray-50">

      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="mx-auto max-w-3xl flex items-center justify-between">
          <div>
            <Link to="/app" className="text-xs text-orange-500 hover:underline">
              ← Dashboard
            </Link>
            <h1 className="mt-0.5 text-xl font-bold text-gray-900">Minha Dieta</h1>
            {plan && (
              <p className="mt-0.5 text-xs text-gray-400">{plan.title}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/app/lista-de-compras"
              className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:border-orange-300 hover:text-orange-500 transition"
            >
              <ShoppingCart className="h-4 w-4" />
              Lista de compras
            </Link>
            <button
              onClick={fetchPlan}
              className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:border-orange-300 hover:text-orange-500 transition"
              title="Atualizar dieta"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-6 py-8">

        {/* Loading */}
        {loading && (
          <div className="rounded-2xl bg-white p-8 shadow-sm text-center text-sm text-gray-400">
            Carregando sua dieta...
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl bg-white p-8 shadow-sm text-center">
            <p className="text-sm text-red-600 mb-3">{error}</p>
            <p className="text-xs text-gray-400">
              Seu nutricionista ainda não atribuiu um plano para você.
            </p>
          </div>
        )}

        {!loading && !error && plan && (
          <>
            {/* Progress bar */}
            <div className="mb-5 rounded-2xl bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Progresso do dia
                </span>
                <span className="text-sm font-semibold text-orange-500">
                  {doneItems}/{totalItems} itens
                </span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-orange-400 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* View toggle */}
            <div className="mb-4 flex rounded-xl bg-white shadow-sm overflow-hidden border border-gray-200 w-fit">
              {(["dia", "semana"] as ViewMode[]).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`px-5 py-2 text-sm font-medium transition capitalize ${
                    view === v
                      ? "bg-orange-500 text-white"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {v === "dia" ? "Dia" : "Semana"}
                </button>
              ))}
            </div>

            {/* Week selector */}
            {view === "semana" && (
              <div className="mb-4 flex gap-2">
                {DAYS.map((day, i) => (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(i)}
                    className={`flex-1 rounded-xl py-2 text-xs font-semibold transition ${
                      selectedDay === i
                        ? "bg-orange-500 text-white shadow"
                        : i === todayIndex()
                        ? "bg-orange-100 text-orange-600"
                        : "bg-white text-gray-500 hover:bg-gray-50 shadow-sm"
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            )}

            {/* Meals */}
            <div className="space-y-4">
              {plan.meals.map((meal) => (
                <MealCard
                  key={meal.id}
                  meal={meal}
                  checked={checked}
                  onToggle={toggle}
                />
              ))}
            </div>

            {/* Description / notes */}
            {plan.description && (
              <div className="mt-5 rounded-2xl bg-orange-50 border border-orange-100 p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-orange-400 mb-1">
                  Orientações gerais
                </p>
                <p className="text-sm text-gray-700">{plan.description}</p>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}

function MealCard({
  meal,
  checked,
  onToggle,
}: {
  meal: Meal;
  checked: Checked;
  onToggle: (id: string) => void;
}) {
  const done = meal.items.filter((i) => checked[i.id]).length;
  const total = meal.items.length;

  return (
    <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
      {/* Meal header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div>
          <h2 className="font-semibold text-gray-900">{meal.name}</h2>
          {meal.time_suggestion && (
            <p className="text-xs text-gray-400 mt-0.5">{meal.time_suggestion}</p>
          )}
        </div>
        <span className="text-xs text-gray-400">
          {done}/{total}
        </span>
      </div>

      {/* Meal note */}
      {meal.notes && (
        <div className="px-5 pt-3">
          <p className="text-xs text-gray-500 italic">{meal.notes}</p>
        </div>
      )}

      {/* Items */}
      <ul className="divide-y divide-gray-50 px-5 py-2">
        {meal.items.map((item) => (
          <ItemRow
            key={item.id}
            item={item}
            checked={!!checked[item.id]}
            onToggle={() => onToggle(item.id)}
          />
        ))}
      </ul>
    </div>
  );
}

function ItemRow({
  item,
  checked,
  onToggle,
}: {
  item: MealItem;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <li className="flex items-start gap-3 py-3">
      <button
        onClick={onToggle}
        className="mt-0.5 shrink-0 text-gray-300 hover:text-orange-400 transition"
      >
        {checked ? (
          <CheckCircle2 className="h-5 w-5 text-orange-400" />
        ) : (
          <Circle className="h-5 w-5" />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-medium ${
            checked ? "line-through text-gray-400" : "text-gray-800"
          }`}
        >
          {item.food_name}
          <span className="ml-2 font-normal text-gray-500">
            {item.quantity} {item.unit}
          </span>
          {item.calories != null && (
            <span className="ml-2 text-xs text-gray-400">
              {item.calories} kcal
            </span>
          )}
        </p>

        {item.substitution && (
          <p className="mt-0.5 text-xs text-orange-500">
            Substituição: {item.substitution}
          </p>
        )}
        {item.notes && (
          <p className="mt-0.5 text-xs text-gray-400">{item.notes}</p>
        )}
      </div>
    </li>
  );
}

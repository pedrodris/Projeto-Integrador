import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";

import { api, getApiErrorMessage } from "../lib/api";
import type { DietPlan } from "../diet/types";

type ItemDraft = {
  food_name: string;
  quantity: string;
  unit: string;
  calories: string;
  substitution: string;
  notes: string;
};

type MealDraft = {
  name: string;
  time_suggestion: string;
  notes: string;
  items: ItemDraft[];
  collapsed: boolean;
};

const EMPTY_ITEM: ItemDraft = {
  food_name: "",
  quantity: "",
  unit: "g",
  calories: "",
  substitution: "",
  notes: "",
};

const MEAL_SUGGESTIONS = [
  "Café da manhã",
  "Lanche da manhã",
  "Almoço",
  "Lanche da tarde",
  "Jantar",
  "Ceia",
];

const UNITS = [
  "g",
  "ml",
  "unidade",
  "colher de sopa",
  "colher de chá",
  "xícara",
  "fatia",
  "porção",
];

function newMeal(name = ""): MealDraft {
  return {
    name,
    time_suggestion: "",
    notes: "",
    items: [{ ...EMPTY_ITEM }],
    collapsed: false,
  };
}

export default function DietPlanCreate() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [meals, setMeals] = useState<MealDraft[]>([newMeal()]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- Meal helpers ---

  function addMeal() {
    setMeals((prev) => [...prev, newMeal()]);
  }

  function removeMeal(i: number) {
    setMeals((prev) => prev.filter((_, idx) => idx !== i));
  }

  function toggleMeal(i: number) {
    setMeals((prev) =>
      prev.map((m, idx) => (idx === i ? { ...m, collapsed: !m.collapsed } : m))
    );
  }

  function setMealField(
    i: number,
    field: keyof Omit<MealDraft, "items" | "collapsed">,
    value: string
  ) {
    setMeals((prev) =>
      prev.map((m, idx) => (idx === i ? { ...m, [field]: value } : m))
    );
  }

  // --- Item helpers ---

  function addItem(mealIdx: number) {
    setMeals((prev) =>
      prev.map((m, i) =>
        i === mealIdx ? { ...m, items: [...m.items, { ...EMPTY_ITEM }] } : m
      )
    );
  }

  function removeItem(mealIdx: number, itemIdx: number) {
    setMeals((prev) =>
      prev.map((m, i) =>
        i === mealIdx
          ? { ...m, items: m.items.filter((_, j) => j !== itemIdx) }
          : m
      )
    );
  }

  function setItemField(
    mealIdx: number,
    itemIdx: number,
    field: keyof ItemDraft,
    value: string
  ) {
    setMeals((prev) =>
      prev.map((m, i) =>
        i === mealIdx
          ? {
              ...m,
              items: m.items.map((item, j) =>
                j === itemIdx ? { ...item, [field]: value } : item
              ),
            }
          : m
      )
    );
  }

  // --- Submit ---

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim()) {
      setError("O título do plano é obrigatório.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const payload = {
      title: title.trim(),
      description: description.trim() || null,
      start_date: startDate || null,
      end_date: endDate || null,
      meals: meals
        .filter((m) => m.name.trim())
        .map((m) => ({
          name: m.name.trim(),
          time_suggestion: m.time_suggestion || null,
          notes: m.notes.trim() || null,
          items: m.items
            .filter((item) => item.food_name.trim())
            .map((item) => ({
              food_name: item.food_name.trim(),
              quantity: parseFloat(item.quantity) || 0,
              unit: item.unit,
              calories: item.calories ? parseFloat(item.calories) : null,
              substitution: item.substitution.trim() || null,
              notes: item.notes.trim() || null,
            })),
        })),
    };

    try {
      await api.post<DietPlan>("/diet/plans", payload);
      navigate("/app/dietas");
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">

      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="mx-auto max-w-3xl flex items-center justify-between">
          <div>
            <Link to="/app/dietas" className="text-xs text-orange-500 hover:underline">
              ← Planos Alimentares
            </Link>
            <h1 className="mt-0.5 text-xl font-bold text-gray-900">Novo Plano Alimentar</h1>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-6 py-8">

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Informações do plano */}
          <section className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-base font-semibold text-gray-800">
              Informações do Plano
            </h2>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Título <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Plano de emagrecimento — fase 1"
                className="w-full h-11 px-4 rounded-xl border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Descrição / Objetivo
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Descreva o objetivo e orientações gerais do plano"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-orange-400 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Início
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Término
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
            </div>
          </section>

          {/* Refeições */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-800">
                Refeições ({meals.length})
              </h2>
              <button
                type="button"
                onClick={addMeal}
                className="flex items-center gap-1.5 rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 transition"
              >
                <Plus className="h-4 w-4" />
                Adicionar refeição
              </button>
            </div>

            {meals.length === 0 && (
              <div className="rounded-2xl bg-white p-8 shadow-sm text-center text-sm text-gray-400">
                Nenhuma refeição adicionada. Clique em "Adicionar refeição".
              </div>
            )}

            {meals.map((meal, mealIdx) => (
              <div
                key={mealIdx}
                className="rounded-2xl bg-white shadow-sm overflow-hidden"
              >
                {/* Meal header */}
                <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-orange-600">
                    {mealIdx + 1}
                  </span>

                  <input
                    type="text"
                    value={meal.name}
                    onChange={(e) => setMealField(mealIdx, "name", e.target.value)}
                    list={`meal-names-${mealIdx}`}
                    placeholder="Nome da refeição"
                    className="flex-1 h-9 px-3 rounded-xl border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-orange-400"
                  />
                  <datalist id={`meal-names-${mealIdx}`}>
                    {MEAL_SUGGESTIONS.map((s) => (
                      <option key={s} value={s} />
                    ))}
                  </datalist>

                  <input
                    type="time"
                    value={meal.time_suggestion}
                    onChange={(e) =>
                      setMealField(mealIdx, "time_suggestion", e.target.value)
                    }
                    className="w-32 h-9 px-3 rounded-xl border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-orange-400"
                    title="Horário sugerido"
                  />

                  <button
                    type="button"
                    onClick={() => toggleMeal(mealIdx)}
                    className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 transition"
                    title={meal.collapsed ? "Expandir" : "Recolher"}
                  >
                    {meal.collapsed ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronUp className="h-4 w-4" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => removeMeal(mealIdx)}
                    className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 transition"
                    title="Remover refeição"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {!meal.collapsed && (
                  <div className="px-5 py-4 space-y-4">
                    {/* Observação da refeição */}
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Observação da refeição
                      </label>
                      <input
                        type="text"
                        value={meal.notes}
                        onChange={(e) =>
                          setMealField(mealIdx, "notes", e.target.value)
                        }
                        placeholder="Ex: Consumir até 30 min após acordar"
                        className="w-full h-9 px-3 rounded-xl border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-orange-400"
                      />
                    </div>

                    {/* Alimentos */}
                    <div>
                      <p className="mb-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Alimentos
                      </p>

                      <div className="space-y-2">
                        {meal.items.map((item, itemIdx) => (
                          <div
                            key={itemIdx}
                            className="rounded-xl border border-gray-100 bg-gray-50 p-3 space-y-2"
                          >
                            {/* Row 1: food name + qty + unit + kcal + delete */}
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={item.food_name}
                                onChange={(e) =>
                                  setItemField(
                                    mealIdx,
                                    itemIdx,
                                    "food_name",
                                    e.target.value
                                  )
                                }
                                placeholder="Alimento"
                                className="min-w-0 flex-[3] h-9 px-3 rounded-lg border border-gray-300 bg-white text-sm outline-none focus:ring-2 focus:ring-orange-400"
                              />
                              <input
                                type="number"
                                value={item.quantity}
                                onChange={(e) =>
                                  setItemField(
                                    mealIdx,
                                    itemIdx,
                                    "quantity",
                                    e.target.value
                                  )
                                }
                                placeholder="Qtd"
                                min="0"
                                step="any"
                                className="w-20 h-9 px-3 rounded-lg border border-gray-300 bg-white text-sm outline-none focus:ring-2 focus:ring-orange-400"
                              />
                              <select
                                value={item.unit}
                                onChange={(e) =>
                                  setItemField(
                                    mealIdx,
                                    itemIdx,
                                    "unit",
                                    e.target.value
                                  )
                                }
                                className="w-32 h-9 px-2 rounded-lg border border-gray-300 bg-white text-sm outline-none focus:ring-2 focus:ring-orange-400"
                              >
                                {UNITS.map((u) => (
                                  <option key={u} value={u}>
                                    {u}
                                  </option>
                                ))}
                              </select>
                              <input
                                type="number"
                                value={item.calories}
                                onChange={(e) =>
                                  setItemField(
                                    mealIdx,
                                    itemIdx,
                                    "calories",
                                    e.target.value
                                  )
                                }
                                placeholder="Kcal"
                                min="0"
                                className="w-20 h-9 px-3 rounded-lg border border-gray-300 bg-white text-sm outline-none focus:ring-2 focus:ring-orange-400"
                              />
                              <button
                                type="button"
                                onClick={() => removeItem(mealIdx, itemIdx)}
                                disabled={meal.items.length === 1}
                                className="shrink-0 rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 transition disabled:opacity-30 disabled:cursor-not-allowed"
                                title="Remover alimento"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>

                            {/* Row 2: substitution + notes */}
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={item.substitution}
                                onChange={(e) =>
                                  setItemField(
                                    mealIdx,
                                    itemIdx,
                                    "substitution",
                                    e.target.value
                                  )
                                }
                                placeholder="Sugestão de substituição (opcional)"
                                className="flex-1 h-9 px-3 rounded-lg border border-dashed border-orange-300 bg-orange-50 text-sm text-orange-700 placeholder:text-orange-300 outline-none focus:ring-2 focus:ring-orange-400"
                              />
                              <input
                                type="text"
                                value={item.notes}
                                onChange={(e) =>
                                  setItemField(
                                    mealIdx,
                                    itemIdx,
                                    "notes",
                                    e.target.value
                                  )
                                }
                                placeholder="Observação (opcional)"
                                className="flex-1 h-9 px-3 rounded-lg border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-orange-400"
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => addItem(mealIdx)}
                        className="mt-2 flex items-center gap-1 text-xs font-medium text-orange-500 hover:text-orange-600 transition"
                      >
                        <Plus className="h-3 w-3" />
                        Adicionar alimento
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </section>

          {/* Footer */}
          {error && (
            <p className="text-sm text-red-600 rounded-xl bg-red-50 px-4 py-3">
              {error}
            </p>
          )}

          <div className="flex items-center justify-end gap-4 pt-2 pb-8">
            <Link
              to="/app/dietas"
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-11 px-6 rounded-xl bg-yellow-400 font-semibold text-gray-900 hover:bg-yellow-500 disabled:opacity-70 disabled:cursor-not-allowed transition"
            >
              {isSubmitting ? "Salvando..." : "Salvar Plano"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

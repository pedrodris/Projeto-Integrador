import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CheckSquare,
  Square,
  Plus,
  Trash2,
  Copy,
  Share2,
  ShoppingBasket,
} from "lucide-react";

import { api } from "../lib/api";
import type { DietPlan } from "../diet/types";

const MOCK_PLAN: DietPlan = {
  id: "mock-plan",
  nutritionist_id: "nutri-id",
  title: "Plano emagrecimento — Fase 1",
  description: null,
  start_date: "2026-05-20",
  end_date: "2026-06-20",
  status: "active",
  created_at: new Date().toISOString(),
  meals: [
    {
      id: "meal-1", diet_plan_id: "mock-plan", order_index: 0,
      name: "Café da manhã", time_suggestion: "07:00", notes: null,
      items: [
        { id: "i1", meal_id: "meal-1", food_name: "Aveia", quantity: 50, unit: "g", calories: 180, substitution: null, notes: null, order_index: 0 },
        { id: "i2", meal_id: "meal-1", food_name: "Banana", quantity: 1, unit: "unidade", calories: 90, substitution: null, notes: null, order_index: 1 },
        { id: "i3", meal_id: "meal-1", food_name: "Leite desnatado", quantity: 200, unit: "ml", calories: 70, substitution: null, notes: null, order_index: 2 },
      ],
    },
    {
      id: "meal-2", diet_plan_id: "mock-plan", order_index: 1,
      name: "Almoço", time_suggestion: "12:30", notes: null,
      items: [
        { id: "i4", meal_id: "meal-2", food_name: "Arroz integral", quantity: 120, unit: "g", calories: 160, substitution: null, notes: null, order_index: 0 },
        { id: "i5", meal_id: "meal-2", food_name: "Feijão", quantity: 80, unit: "g", calories: 90, substitution: null, notes: null, order_index: 1 },
        { id: "i6", meal_id: "meal-2", food_name: "Frango grelhado", quantity: 150, unit: "g", calories: 220, substitution: null, notes: "Temperado com ervas", order_index: 2 },
        { id: "i7", meal_id: "meal-2", food_name: "Salada mista", quantity: 1, unit: "porção", calories: 30, substitution: null, notes: null, order_index: 3 },
      ],
    },
    {
      id: "meal-3", diet_plan_id: "mock-plan", order_index: 2,
      name: "Lanche da tarde", time_suggestion: "16:00", notes: null,
      items: [
        { id: "i8", meal_id: "meal-3", food_name: "Iogurte grego", quantity: 170, unit: "g", calories: 100, substitution: null, notes: null, order_index: 0 },
        { id: "i9", meal_id: "meal-3", food_name: "Maçã", quantity: 1, unit: "unidade", calories: 80, substitution: null, notes: null, order_index: 1 },
      ],
    },
    {
      id: "meal-4", diet_plan_id: "mock-plan", order_index: 3,
      name: "Jantar", time_suggestion: "19:30", notes: null,
      items: [
        { id: "i10", meal_id: "meal-4", food_name: "Salmão", quantity: 150, unit: "g", calories: 250, substitution: null, notes: null, order_index: 0 },
        { id: "i11", meal_id: "meal-4", food_name: "Batata doce", quantity: 100, unit: "g", calories: 90, substitution: null, notes: null, order_index: 1 },
        { id: "i12", meal_id: "meal-4", food_name: "Brócolis", quantity: 100, unit: "g", calories: 35, substitution: null, notes: null, order_index: 2 },
      ],
    },
  ],
};

type Period = "dia" | "semana";

type ShopItem = {
  id: string;
  food_name: string;
  quantity: number;
  unit: string;
  bought: boolean;
  suggested_brand?: string;
  custom?: boolean;
};

const STORAGE_KEY = (planId: string, period: Period) =>
  `nutricare.shoplist.${planId}.${period}`;

function buildFromPlan(plan: DietPlan, period: Period): ShopItem[] {
  const multiplier = period === "semana" ? 7 : 1;
  const map = new Map<string, ShopItem>();

  for (const meal of plan.meals) {
    for (const item of meal.items) {
      const key = `${item.food_name.toLowerCase()}|${item.unit}`;
      if (map.has(key)) {
        map.get(key)!.quantity += item.quantity * multiplier;
      } else {
        map.set(key, {
          id: `${item.id}-${period}`,
          food_name: item.food_name,
          quantity: item.quantity * multiplier,
          unit: item.unit,
          bought: false,
        });
      }
    }
  }

  return Array.from(map.values());
}

function loadItems(planId: string, period: Period): ShopItem[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY(planId, period));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveItems(planId: string, period: Period, items: ShopItem[]) {
  localStorage.setItem(STORAGE_KEY(planId, period), JSON.stringify(items));
}

function itemsToText(items: ShopItem[], period: Period): string {
  const header = `Lista de compras — ${period === "semana" ? "semana" : "hoje"}\n${"─".repeat(36)}\n`;
  const body = items
    .map((i) => `${i.bought ? "✅" : "☐"} ${i.food_name} — ${i.quantity.toFixed(0)} ${i.unit}${i.suggested_brand ? ` (${i.suggested_brand})` : ""}`)
    .join("\n");
  return header + body;
}

export default function ShoppingList() {
  const [plan, setPlan] = useState<DietPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<Period>("semana");
  const [items, setItems] = useState<ShopItem[]>([]);
  const [newItem, setNewItem] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    api
      .get<DietPlan>("/diet/my-plan")
      .then((res) => {
        setPlan(res.data);
        const saved = loadItems(res.data.id, period);
        setItems(saved ?? buildFromPlan(res.data, period));
      })
      .catch(() => {
        setPlan(MOCK_PLAN);
        const saved = loadItems(MOCK_PLAN.id, period);
        setItems(saved ?? buildFromPlan(MOCK_PLAN, period));
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!plan) return;
    const saved = loadItems(plan.id, period);
    setItems(saved ?? buildFromPlan(plan, period));
  }, [period, plan?.id]);

  function persist(next: ShopItem[]) {
    setItems(next);
    if (plan) saveItems(plan.id, period, next);
  }

  function toggleBought(id: string) {
    persist(items.map((i) => (i.id === id ? { ...i, bought: !i.bought } : i)));
  }

  function removeItem(id: string) {
    persist(items.filter((i) => i.id !== id));
  }

  function addCustomItem() {
    const name = newItem.trim();
    if (!name) return;
    const item: ShopItem = {
      id: `custom-${Date.now()}`,
      food_name: name,
      quantity: 1,
      unit: "unidade",
      bought: false,
      custom: true,
    };
    persist([...items, item]);
    setNewItem("");
  }

  function updateQty(id: string, value: string) {
    const qty = parseFloat(value);
    if (isNaN(qty) || qty < 0) return;
    persist(items.map((i) => (i.id === id ? { ...i, quantity: qty } : i)));
  }

  function regenerate() {
    if (!plan) return;
    const fresh = buildFromPlan(plan, period);
    persist(fresh);
  }

  function copyText() {
    navigator.clipboard.writeText(itemsToText(items, period)).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function shareWhatsApp() {
    const text = encodeURIComponent(itemsToText(items, period));
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  }

  const pending = items.filter((i) => !i.bought);
  const done = items.filter((i) => i.bought);

  return (
    <main className="min-h-screen bg-gray-50">

      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="mx-auto max-w-2xl flex items-center justify-between">
          <div>
            <Link to="/app/minha-dieta" className="text-xs text-orange-500 hover:underline">
              ← Minha Dieta
            </Link>
            <h1 className="mt-0.5 text-xl font-bold text-gray-900">Lista de Compras</h1>
          </div>

          {/* Export buttons */}
          {items.length > 0 && (
            <div className="flex gap-2">
              <button
                onClick={copyText}
                className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:border-orange-300 hover:text-orange-500 transition"
                title="Copiar como texto"
              >
                <Copy className="h-4 w-4" />
                {copied ? "Copiado!" : "Copiar"}
              </button>
              <button
                onClick={shareWhatsApp}
                className="flex items-center gap-1.5 rounded-xl bg-green-500 px-3 py-2 text-sm font-semibold text-white hover:bg-green-600 transition"
                title="Compartilhar no WhatsApp"
              >
                <Share2 className="h-4 w-4" />
                WhatsApp
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-6 py-8">

        {loading && (
          <div className="rounded-2xl bg-white p-8 shadow-sm text-center text-sm text-gray-400">
            Carregando lista...
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl bg-white p-8 shadow-sm text-center">
            <ShoppingBasket className="mx-auto h-10 w-10 text-gray-200 mb-3" />
            <p className="text-sm text-gray-500">
              Nenhum plano alimentar ativo para gerar a lista.
            </p>
            <Link
              to="/app/minha-dieta"
              className="mt-3 inline-block text-sm text-orange-500 hover:underline"
            >
              Ver minha dieta
            </Link>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Period + regenerate */}
            <div className="mb-4 flex items-center justify-between">
              <div className="flex rounded-xl bg-white shadow-sm overflow-hidden border border-gray-200 w-fit">
                {(["dia", "semana"] as Period[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={`px-5 py-2 text-sm font-medium transition capitalize ${
                      period === p
                        ? "bg-orange-500 text-white"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {p === "dia" ? "Hoje" : "Semana"}
                  </button>
                ))}
              </div>
              <button
                onClick={regenerate}
                className="text-xs text-gray-400 hover:text-orange-500 transition underline"
              >
                Regenerar da dieta
              </button>
            </div>

            {/* Add custom item */}
            <div className="mb-5 flex gap-2">
              <input
                type="text"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addCustomItem()}
                placeholder="Adicionar item manualmente..."
                className="flex-1 h-10 px-4 rounded-xl border border-gray-300 bg-white text-sm outline-none focus:ring-2 focus:ring-orange-400"
              />
              <button
                onClick={addCustomItem}
                className="flex items-center gap-1 rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 transition"
              >
                <Plus className="h-4 w-4" />
                Add
              </button>
            </div>

            {/* Pending items */}
            {pending.length > 0 && (
              <div className="rounded-2xl bg-white shadow-sm overflow-hidden mb-4">
                <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">
                    A comprar ({pending.length})
                  </span>
                </div>
                <ul className="divide-y divide-gray-50">
                  {pending.map((item) => (
                    <ShopRow
                      key={item.id}
                      item={item}
                      onToggle={() => toggleBought(item.id)}
                      onRemove={() => removeItem(item.id)}
                      onQtyChange={(v) => updateQty(item.id, v)}
                    />
                  ))}
                </ul>
              </div>
            )}

            {/* Done items */}
            {done.length > 0 && (
              <div className="rounded-2xl bg-white shadow-sm overflow-hidden opacity-60">
                <div className="px-5 py-3 border-b border-gray-100">
                  <span className="text-sm font-semibold text-gray-500">
                    Comprado ({done.length})
                  </span>
                </div>
                <ul className="divide-y divide-gray-50">
                  {done.map((item) => (
                    <ShopRow
                      key={item.id}
                      item={item}
                      onToggle={() => toggleBought(item.id)}
                      onRemove={() => removeItem(item.id)}
                      onQtyChange={(v) => updateQty(item.id, v)}
                    />
                  ))}
                </ul>
              </div>
            )}

            {items.length === 0 && (
              <div className="rounded-2xl bg-white p-10 shadow-sm text-center">
                <ShoppingBasket className="mx-auto h-10 w-10 text-gray-200 mb-3" />
                <p className="text-sm text-gray-400">Nenhum item na lista.</p>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}

function ShopRow({
  item,
  onToggle,
  onRemove,
  onQtyChange,
}: {
  item: ShopItem;
  onToggle: () => void;
  onRemove: () => void;
  onQtyChange: (v: string) => void;
}) {
  return (
    <li className="flex items-center gap-3 px-5 py-3">
      <button
        onClick={onToggle}
        className="shrink-0 text-gray-300 hover:text-orange-400 transition"
      >
        {item.bought ? (
          <CheckSquare className="h-5 w-5 text-orange-400" />
        ) : (
          <Square className="h-5 w-5" />
        )}
      </button>

      <span
        className={`flex-1 text-sm font-medium ${
          item.bought ? "line-through text-gray-400" : "text-gray-800"
        }`}
      >
        {item.food_name}
        {item.suggested_brand && (
          <span className="ml-1 text-xs font-normal text-orange-400">
            ({item.suggested_brand})
          </span>
        )}
        {item.custom && (
          <span className="ml-1 text-xs font-normal text-gray-400">(manual)</span>
        )}
      </span>

      <input
        type="number"
        value={item.quantity}
        onChange={(e) => onQtyChange(e.target.value)}
        min="0"
        step="any"
        className="w-16 h-8 px-2 rounded-lg border border-gray-200 text-center text-sm outline-none focus:ring-2 focus:ring-orange-400"
      />

      <span className="w-20 text-xs text-gray-400 shrink-0">{item.unit}</span>

      <button
        onClick={onRemove}
        className="shrink-0 rounded-lg p-1 text-gray-300 hover:bg-red-50 hover:text-red-400 transition"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </li>
  );
}

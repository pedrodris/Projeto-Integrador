import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import {
  ClipboardList,
  ShoppingCart,
  Salad,
  LogOut,
  MessageCircle,
  Search,
  Plus,
  User,
  Utensils,
  Target,
} from "lucide-react";

import { useAuth } from "../auth/useAuth";
import { useProfile } from "../profile/useProfile";
import type { ProfileDetails } from "../profile/types";

// ---------------------------------------------------------------------------
// Mock / demo data
// ---------------------------------------------------------------------------

const DEMO_NUTRITIONIST: ProfileDetails = {
  profile: {
    id: "demo",
    email: "nutricionista@nutricare.com",
    role: "nutritionist",
    username: "Dra. Ana Silva",
    phone: "(11) 99999-9999",
    avatar_url: null,
    is_active: true,
    created_at: null,
    updated_at: null,
  },
  nutritionist_profile: {
    profile_id: "demo",
    crn: "CRN-3 12345",
    specialty: "Nutrição Esportiva",
    bio: null,
    created_at: null,
    updated_at: null,
  },
  patient_profile: null,
};

const DEMO_PATIENT: ProfileDetails = {
  profile: {
    id: "demo-patient",
    email: "paciente@nutricare.com",
    role: "patient",
    username: "Mariana Costa",
    phone: null,
    avatar_url: null,
    is_active: true,
    created_at: null,
    updated_at: null,
  },
  nutritionist_profile: null,
  patient_profile: {
    profile_id: "demo-patient",
    birth_date: "1997-03-14",
    sex: "feminino",
    height_cm: 163,
    weight_kg: 72,
    activity_level: "moderadamente_ativo",
    goal_summary: "Emagrecimento",
    food_restrictions: "Intolerância à lactose",
    medical_notes: null,
    weight_history: null,
    created_at: null,
    updated_at: null,
  },
};

type MockMeal = {
  name: string;
  time_suggestion: string | null;
  item_count: number;
  items_preview: string;
};

const MOCK_PLAN = {
  title: "Plano emagrecimento — Fase 1",
  status: "active" as const,
  start_date: "2026-05-20",
  end_date: "2026-06-20",
  today_done: 4,
  today_total: 14,
  meals: [
    { name: "Café da manhã",    time_suggestion: "07:00", item_count: 3, items_preview: "Aveia, Banana, Leite desnatado" },
    { name: "Lanche da manhã",  time_suggestion: "10:00", item_count: 2, items_preview: "Iogurte grego, Maçã" },
    { name: "Almoço",           time_suggestion: "12:30", item_count: 4, items_preview: "Arroz integral, Feijão, Frango grelhado, Salada" },
    { name: "Lanche da tarde",  time_suggestion: "16:00", item_count: 2, items_preview: "Iogurte grego, Maçã" },
    { name: "Jantar",           time_suggestion: "19:30", item_count: 3, items_preview: "Salmão, Batata doce, Brócolis" },
  ] satisfies MockMeal[],
};

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type MockPatient = {
  id: string;
  name: string;
  sex: string | null;
  age: number | null;
  height_cm: number | null;
  weight_kg: number | null;
  plan_status: "active" | "draft" | null;
};

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MOCK_PATIENTS: MockPatient[] = [
  { id: "p1", name: "Mariana Costa",   sex: "feminino",  age: 28, height_cm: 163, weight_kg: 72, plan_status: "active" },
  { id: "p2", name: "Carlos Mendes",   sex: "masculino", age: 35, height_cm: 178, weight_kg: 82, plan_status: "draft"  },
  { id: "p3", name: "Beatriz Santos",  sex: "feminino",  age: 42, height_cm: 160, weight_kg: 65, plan_status: null     },
  { id: "p4", name: "Rafael Oliveira", sex: "masculino", age: 22, height_cm: 182, weight_kg: 90, plan_status: null     },
];

const ROLE_LABEL: Record<string, string> = {
  nutritionist: "Nutricionista",
  patient: "Paciente",
};

const PLAN_STATUS_LABEL: Record<string, string> = {
  active: "Plano ativo",
  draft: "Rascunho",
};

const PLAN_STATUS_CLASS: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  draft:  "bg-gray-100 text-gray-500",
};

const ACTIVITY_LABEL: Record<string, string> = {
  sedentario:           "Sedentário",
  levemente_ativo:      "Levemente ativo",
  moderadamente_ativo:  "Moderadamente ativo",
  muito_ativo:          "Muito ativo",
  extremamente_ativo:   "Extremamente ativo",
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getInitials(name: string) {
  return name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
}

function calcImc(weight_kg: number, height_cm: number): string {
  const imc = weight_kg / Math.pow(height_cm / 100, 2);
  return imc.toFixed(1);
}

function calcAge(birthDate: string): number {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

function getNextMeal(meals: MockMeal[]): MockMeal | null {
  const now = new Date();
  const nowMins = now.getHours() * 60 + now.getMinutes();
  const withTime = meals.filter((m) => m.time_suggestion);
  if (!withTime.length) return meals[0] ?? null;
  const future = withTime.filter((m) => {
    const [h, min] = m.time_suggestion!.split(":").map(Number);
    return h * 60 + min > nowMins;
  });
  return future[0] ?? withTime[0];
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function Dashboard() {
  const { clearSession, session } = useAuth();
  const { profile: apiProfile, status } = useProfile();
  const [search, setSearch] = useState("");

  if (status === "loading") {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-sm text-gray-400">Carregando perfil...</div>
      </main>
    );
  }

  if (status === "missing") {
    return <Navigate to="/profile/setup" replace />;
  }

  // Use real profile; if none, pick demo based on URL param for dev convenience
  const forcePatient = new URLSearchParams(window.location.search).get("role") === "patient";
  const profile = apiProfile ?? (forcePatient ? DEMO_PATIENT : DEMO_NUTRITIONIST);
  const isDemo = !apiProfile;

  const { profile: base, nutritionist_profile: nutri, patient_profile: patient } = profile;

  const filteredPatients = MOCK_PATIENTS.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const nextMeal = getNextMeal(MOCK_PLAN.meals);
  const progress = MOCK_PLAN.today_total > 0
    ? Math.round((MOCK_PLAN.today_done / MOCK_PLAN.today_total) * 100)
    : 0;

  // Patient physical data — prefer real profile, fallback to demo values
  const weight  = patient?.weight_kg  ?? DEMO_PATIENT.patient_profile!.weight_kg!;
  const height  = patient?.height_cm  ?? DEMO_PATIENT.patient_profile!.height_cm!;
  const goal    = patient?.goal_summary ?? DEMO_PATIENT.patient_profile!.goal_summary;
  const activity = patient?.activity_level ?? DEMO_PATIENT.patient_profile!.activity_level;
  const age = patient?.birth_date ? calcAge(patient.birth_date) : 28;

  return (
    <main className="min-h-screen bg-gray-50">

      {/* Top bar */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="mx-auto max-w-4xl flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">NutriCare</span>
          <button
            onClick={clearSession}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-500 transition"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-10 space-y-8">

        {isDemo && (
          <div className="rounded-xl bg-yellow-50 border border-yellow-200 px-4 py-2.5 text-xs text-yellow-700">
            Modo demonstração — dados fictícios. Conecte o backend para ver seus dados reais.
          </div>
        )}

        {/* Profile card */}
        <div className="rounded-2xl bg-white shadow-sm p-6 flex items-center gap-5">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xl font-bold text-orange-500">
            {getInitials(base.username)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-gray-900">{base.username}</h1>
              <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-semibold text-orange-600">
                {ROLE_LABEL[base.role] ?? base.role}
              </span>
            </div>
            <p className="mt-0.5 text-sm text-gray-500">{session?.user.email ?? base.email}</p>
            {nutri && (
              <p className="mt-1 text-xs text-gray-400">
                {nutri.crn}{nutri.specialty ? ` · ${nutri.specialty}` : ""}
              </p>
            )}
          </div>
        </div>

        {/* ================================================================
            NUTRICIONISTA
        ================================================================ */}
        {base.role === "nutritionist" && (
          <>
            <div>
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400">
                Ferramentas
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <ToolCard
                  to="/app/dietas"
                  icon={<ClipboardList className="h-6 w-6 text-orange-500" />}
                  title="Planos Alimentares"
                  description="Crie e gerencie dietas para seus pacientes"
                  color="orange"
                />
              </div>
            </div>

            <div>
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
                  Meus Pacientes{" "}
                  <span className="ml-1 normal-case font-normal text-gray-400">
                    ({filteredPatients.length})
                  </span>
                </h2>
              </div>

              <div className="relative mb-4">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar paciente..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-10 rounded-xl border border-gray-200 bg-white pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>

              {filteredPatients.length === 0 ? (
                <div className="rounded-2xl bg-white border border-dashed border-gray-200 p-10 text-center">
                  <User className="mx-auto h-8 w-8 text-gray-200 mb-2" />
                  <p className="text-sm text-gray-400">
                    {search ? "Nenhum paciente encontrado." : "Nenhum paciente cadastrado ainda."}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredPatients.map((p) => (
                    <PatientCard key={p.id} patient={p} />
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* ================================================================
            PACIENTE
        ================================================================ */}
        {base.role === "patient" && (
          <>
            {/* Plano ativo */}
            <div>
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400">
                Plano Ativo
              </h2>

              <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
                {/* Plan header */}
                <div className="flex items-start justify-between gap-4 px-6 pt-5 pb-4 border-b border-gray-100">
                  <div>
                    <p className="font-semibold text-gray-900">{MOCK_PLAN.title}</p>
                    <p className="mt-0.5 text-xs text-gray-400">
                      {formatDate(MOCK_PLAN.start_date)} → {formatDate(MOCK_PLAN.end_date)}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">
                    Ativo
                  </span>
                </div>

                <div className="px-6 py-5 space-y-5">
                  {/* Progress */}
                  <div>
                    <div className="mb-1.5 flex items-center justify-between text-xs">
                      <span className="font-medium text-gray-600">Progresso de hoje</span>
                      <span className="font-semibold text-orange-500">
                        {MOCK_PLAN.today_done}/{MOCK_PLAN.today_total} itens ({progress}%)
                      </span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-orange-400 transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Next meal */}
                  {nextMeal && (
                    <div className="flex items-start gap-3 rounded-xl bg-orange-50 border border-orange-100 px-4 py-3">
                      <Utensils className="mt-0.5 h-4 w-4 shrink-0 text-orange-400" />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-wide text-orange-400 mb-0.5">
                          Próxima refeição
                        </p>
                        <p className="font-semibold text-gray-800 text-sm">
                          {nextMeal.name}
                          {nextMeal.time_suggestion && (
                            <span className="ml-2 font-normal text-gray-400">{nextMeal.time_suggestion}</span>
                          )}
                        </p>
                        <p className="mt-0.5 text-xs text-gray-500 truncate">{nextMeal.items_preview}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-100 px-6 py-3">
                  <Link
                    to="/app/minha-dieta"
                    className="text-xs font-semibold text-orange-500 hover:text-orange-600 transition"
                  >
                    Ver plano completo →
                  </Link>
                </div>
              </div>
            </div>

            {/* Dados físicos */}
            <div>
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400">
                Seus Dados
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <StatBox label="Peso" value={`${weight} kg`} />
                <StatBox label="Altura" value={`${height} cm`} />
                <StatBox label="IMC" value={calcImc(weight, height)} sub={imcCategory(calcImc(weight, height))} />
                <StatBox label="Idade" value={`${age} anos`} />
              </div>

              {(goal || activity) && (
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {goal && (
                    <div className="flex items-center gap-3 rounded-2xl bg-white shadow-sm px-5 py-4">
                      <Target className="h-5 w-5 shrink-0 text-orange-400" />
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Objetivo</p>
                        <p className="text-sm font-semibold text-gray-800">{goal}</p>
                      </div>
                    </div>
                  )}
                  {activity && ACTIVITY_LABEL[activity] && (
                    <div className="flex items-center gap-3 rounded-2xl bg-white shadow-sm px-5 py-4">
                      <Salad className="h-5 w-5 shrink-0 text-green-400" />
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Atividade física</p>
                        <p className="text-sm font-semibold text-gray-800">{ACTIVITY_LABEL[activity]}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Ferramentas */}
            <div>
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400">
                Ferramentas
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <ToolCard
                  to="/app/minha-dieta"
                  icon={<Salad className="h-6 w-6 text-orange-500" />}
                  title="Minha Dieta"
                  description="Veja suas refeições e marque como consumido"
                  color="orange"
                />
                <ToolCard
                  to="/app/lista-de-compras"
                  icon={<ShoppingCart className="h-6 w-6 text-green-500" />}
                  title="Lista de Compras"
                  description="Gerada automaticamente da sua dieta"
                  color="green"
                />
              </div>
            </div>
          </>
        )}

      </div>
    </main>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function imcCategory(imc: string): string {
  const v = parseFloat(imc);
  if (v < 18.5) return "Abaixo do peso";
  if (v < 25)   return "Peso normal";
  if (v < 30)   return "Sobrepeso";
  return "Obesidade";
}

function StatBox({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-2xl bg-white shadow-sm px-5 py-4 text-center">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">{label}</p>
      <p className="mt-1 text-xl font-bold text-gray-900">{value}</p>
      {sub && <p className="mt-0.5 text-[10px] text-gray-400">{sub}</p>}
    </div>
  );
}

function PatientCard({ patient }: { patient: MockPatient }) {
  const meta = [
    patient.age ? `${patient.age} anos` : null,
    patient.sex === "masculino" ? "Masc." : patient.sex === "feminino" ? "Fem." : null,
    patient.height_cm ? `${patient.height_cm} cm` : null,
    patient.weight_kg ? `${patient.weight_kg} kg` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="rounded-2xl bg-white shadow-sm border border-gray-100 hover:border-orange-200 hover:shadow-md transition p-5">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-500">
          {getInitials(patient.name)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-0.5">
            <span className="font-semibold text-gray-900">{patient.name}</span>
            {patient.plan_status && (
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${PLAN_STATUS_CLASS[patient.plan_status]}`}>
                {PLAN_STATUS_LABEL[patient.plan_status]}
              </span>
            )}
          </div>
          {meta && <p className="text-xs text-gray-400">{meta}</p>}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <div className="relative group">
            <button
              disabled
              className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-300 cursor-not-allowed"
            >
              <MessageCircle className="h-4 w-4" />
              Mensagem
            </button>
            <span className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 rounded bg-gray-800 px-2 py-0.5 text-[10px] text-white opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
              Em breve
            </span>
          </div>

          <Link
            to="/app/dietas/nova"
            className="flex items-center gap-1.5 rounded-xl bg-orange-500 px-3 py-2 text-sm font-semibold text-white hover:bg-orange-600 transition"
          >
            <Plus className="h-4 w-4" />
            Criar plano
          </Link>
        </div>
      </div>
    </div>
  );
}

function ToolCard({
  to, icon, title, description, color,
}: {
  to: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  color: "orange" | "green";
}) {
  const hover =
    color === "orange" ? "hover:border-orange-300 hover:shadow-md" : "hover:border-green-300 hover:shadow-md";

  return (
    <Link
      to={to}
      className={`flex items-start gap-4 rounded-2xl border border-gray-200 bg-white p-5 transition ${hover} group`}
    >
      <div className="mt-0.5 shrink-0 rounded-xl bg-gray-50 p-2.5">{icon}</div>
      <div>
        <p className="font-semibold text-gray-900 group-hover:text-gray-700">{title}</p>
        <p className="mt-0.5 text-xs text-gray-400">{description}</p>
      </div>
    </Link>
  );
}

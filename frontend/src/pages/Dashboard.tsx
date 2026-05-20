import { Link, Navigate } from "react-router-dom";
import { ClipboardList, ShoppingCart, Salad, LogOut } from "lucide-react";

import { useAuth } from "../auth/useAuth";
import { useProfile } from "../profile/useProfile";
import type { ProfileDetails } from "../profile/types";

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

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

const ROLE_LABEL: Record<string, string> = {
  nutritionist: "Nutricionista",
  patient: "Paciente",
};

export default function Dashboard() {
  const { clearSession, session } = useAuth();
  const { profile: apiProfile, status } = useProfile();

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

  const profile = apiProfile ?? DEMO_NUTRITIONIST;
  const isDemo = !apiProfile;
  const { profile: base, nutritionist_profile: nutri, patient_profile: patient } = profile;

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
            {patient && patient.goal_summary && (
              <p className="mt-1 text-xs text-gray-400">Objetivo: {patient.goal_summary}</p>
            )}
          </div>
        </div>

        {/* Tools */}
        <div>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400">
            Ferramentas
          </h2>

          {base.role === "nutritionist" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <ToolCard
                to="/app/dietas"
                icon={<ClipboardList className="h-6 w-6 text-orange-500" />}
                title="Planos Alimentares"
                description="Crie e gerencie dietas para seus pacientes"
                color="orange"
              />
            </div>
          )}

          {base.role === "patient" && (
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
          )}
        </div>
      </div>
    </main>
  );
}

function ToolCard({
  to,
  icon,
  title,
  description,
  color,
}: {
  to: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  color: "orange" | "green";
}) {
  const hover =
    color === "orange"
      ? "hover:border-orange-300 hover:shadow-md"
      : "hover:border-green-300 hover:shadow-md";

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

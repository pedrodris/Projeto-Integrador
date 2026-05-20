import { Navigate } from "react-router-dom";

import { useAuth } from "../auth/useAuth";
import { useProfile } from "../profile/useProfile";

export default function Dashboard() {
  const { clearSession, session } = useAuth();
  const { errorMessage, profile, status } = useProfile();

  if (status === "loading" || status === "idle") {
    return (
      <main className="min-h-screen bg-gray-100 px-6 py-10">
        <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">Carregando perfil</h1>
          <p className="mt-3 text-sm text-gray-600">
            Estamos buscando seus dados iniciais.
          </p>
        </div>
      </main>
    );
  }

  if (status === "missing") {
    return <Navigate to="/profile/setup" replace />;
  }

  if (status === "error") {
    return (
      <main className="min-h-screen bg-gray-100 px-6 py-10">
        <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">
            Nao foi possivel carregar o perfil
          </h1>
          <p className="mt-3 text-sm text-red-600">{errorMessage}</p>
          <button
            type="button"
            onClick={clearSession}
            className="mt-6 rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            Encerrar sessao
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Bem-vindo, {profile?.profile.username}
            </h1>
            <p className="mt-3 text-sm text-gray-600">
              Sessao autenticada e perfil carregado com sucesso.
            </p>
          </div>

          <button
            type="button"
            onClick={clearSession}
            className="rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            Sair
          </button>
        </div>

        <dl className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-gray-200 p-4">
            <dt className="text-xs uppercase tracking-wide text-gray-500">
              Email
            </dt>
            <dd className="mt-2 text-sm text-gray-800">{session?.user.email}</dd>
          </div>

          <div className="rounded-xl border border-gray-200 p-4">
            <dt className="text-xs uppercase tracking-wide text-gray-500">
              Perfil
            </dt>
            <dd className="mt-2 text-sm capitalize text-gray-800">
              {profile?.profile.role}
            </dd>
          </div>
        </dl>
      </div>
    </main>
  );
}

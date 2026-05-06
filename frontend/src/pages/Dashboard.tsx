import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../contexts/AuthContext";

export default function Dashboard() {
  const { user, profileDetails } = useAuth();

  const profileName = profileDetails?.profile.username || user?.email || "Profissional";

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <section className="bg-orange-500 px-6 py-16 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-black">
          Bem-vindo, {profileName}
        </h1>
        <p className="max-w-2xl mx-auto mt-4 text-black/80">
          Seu painel para acompanhar pacientes, organizar consultas e manter seu trabalho nutricional em dia.
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-6">
        <article className="rounded-2xl bg-white border border-gray-200 p-6 shadow-sm">
          <h2 className="font-semibold text-lg text-gray-900">Meu Perfil</h2>
          <p className="text-sm text-gray-600 mt-2">
            Atualize seus dados profissionais e de contato.
          </p>
          <Link
            to="/profile"
            className="inline-block mt-6 bg-yellow-400 text-gray-900 px-4 py-2 rounded-xl font-semibold hover:bg-yellow-500"
          >
            Editar perfil
          </Link>
        </article>

        <article className="rounded-2xl bg-white border border-gray-200 p-6 shadow-sm">
          <h2 className="font-semibold text-lg text-gray-900">Pacientes</h2>
          <p className="text-sm text-gray-600 mt-2">
            Em breve: cadastre e acompanhe seus pacientes em um unico lugar.
          </p>
          <button className="mt-6 bg-gray-100 text-gray-500 px-4 py-2 rounded-xl font-semibold cursor-not-allowed">
            Em desenvolvimento
          </button>
        </article>

        <article className="rounded-2xl bg-white border border-gray-200 p-6 shadow-sm">
          <h2 className="font-semibold text-lg text-gray-900">Planos Alimentares</h2>
          <p className="text-sm text-gray-600 mt-2">
            Em breve: monte planos personalizados com agilidade.
          </p>
          <button className="mt-6 bg-gray-100 text-gray-500 px-4 py-2 rounded-xl font-semibold cursor-not-allowed">
            Em desenvolvimento
          </button>
        </article>
      </section>
    </div>
  );
}

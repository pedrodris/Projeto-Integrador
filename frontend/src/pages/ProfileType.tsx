import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function ProfileType() {
  const navigate = useNavigate();

  function choose(role: "patient" | "nutritionist") {
    navigate("/profile/setup", { state: { role } });
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <section className="max-w-2xl mx-auto px-6 py-10">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Que tipo de perfil você quer criar?</h1>
          <p className="text-sm text-gray-600 mt-2">Escolha abaixo para continuar a configuração específica.</p>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => choose("patient")}
              className="h-16 bg-yellow-400 rounded-xl font-semibold text-gray-900 hover:bg-yellow-500"
            >
              Sou paciente
            </button>
            <button
              onClick={() => choose("nutritionist")}
              className="h-16 bg-orange-400 rounded-xl font-semibold text-white hover:bg-orange-500"
            >
              Sou nutricionista
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

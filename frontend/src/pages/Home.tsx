import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="bg-gray-100 min-h-screen">

      <Navbar />

      {/* HERO */}
      <section className="bg-orange-500 text-center py-20 px-6">
        <h1 className="text-3xl md:text-4xl font-bold text-black mb-6">
          Acompanhe dietas e pacientes com facilidade
        </h1>

        <p className="max-w-xl mx-auto text-black mb-8 text-sm md:text-base">
          Uma plataforma completa para nutricionistas organizarem seus pacientes,
          criarem planos alimentares personalizados e manterem uma comunicação
          eficiente no dia a dia.
        </p>

        <Link
          to="/register"
          className="inline-block bg-yellow-300 px-6 py-3 rounded-xl font-semibold hover:bg-yellow-400"
        >
          Experimente grátis
        </Link>
      </section>

      {/* FUNCIONALIDADES */}
      <section className="py-16 px-6">
        <h2 className="text-center text-xl font-bold mb-10">
          Ferramentas do App
        </h2>

        <div className="max-w-5xl mx-auto bg-yellow-200 h-[300px] rounded-2xl" />
      </section>

      {/* PLANOS */}
      <section className="py-16 px-6">
        <h2 className="text-center text-xl font-bold mb-10">
          Planos e Preços
        </h2>

        <div className="flex flex-col md:flex-row gap-6 justify-center">
          <div className="w-full md:w-64 h-96 bg-yellow-200 rounded-2xl border" />
          <div className="w-full md:w-64 h-96 bg-yellow-200 rounded-2xl border" />
          <div className="w-full md:w-64 h-96 bg-yellow-200 rounded-2xl border" />
        </div>
      </section>
    </div>
  );
}
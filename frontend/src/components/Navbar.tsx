import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="w-full bg-white shadow-sm">
      <div className="relative max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <h1 className="text-xl font-bold text-gray-900">
          NutriCare
        </h1>

        {/* Menu — centralizado absolutamente */}
        <nav className="hidden md:flex gap-6 text-sm text-gray-600 absolute left-1/2 -translate-x-1/2">
          <a
            href="/#funcoes"
            className="relative transition hover:text-orange-500 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-orange-500 after:transition-all hover:after:w-full"
          >
            Funções
          </a>
          <a
            href="/#planos"
            className="relative transition hover:text-orange-500 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-orange-500 after:transition-all hover:after:w-full"
          >
            Planos
          </a>
          <a
            href="#"
            className="relative transition hover:text-orange-500 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-orange-500 after:transition-all hover:after:w-full"
          >
            Blog
          </a>
        </nav>

        {/* Ações */}
        <div className="flex items-center gap-4">
          <Link to="/register" className="text-sm text-gray-700 hover:text-orange-500 transition">
            Experimente grátis
          </Link>

          <Link
            to="/"
            className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-600"
          >
            Login
          </Link>
        </div>
      </div>
    </header>
  );
}
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="w-full bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <h1 className="text-xl font-bold text-gray-900">
          App Nutricionista
        </h1>

        {/* Menu */}
        <nav className="hidden md:flex gap-6 text-sm text-gray-600">
  <a
    href="#"
    className="relative transition hover:text-orange-500 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-orange-500 after:transition-all hover:after:w-full"
  >
    Funções
  </a>

  <a
    href="#"
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
          <button className="text-sm text-gray-700">
            Experimente grátis
          </button>

          <Link
            to="/login"
            className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-600"
          >
            Login
          </Link>
        </div>
      </div>
    </header>
  );
}
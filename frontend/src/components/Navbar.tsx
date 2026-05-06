import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const { isAuthenticated, hasProfile, logout } = useAuth();

  return (
    <header className="w-full bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <h1 className="text-xl font-bold text-gray-900">
          App Nutricionista
        </h1>

        {/* Menu */}
                <nav className="hidden md:flex gap-6 text-sm text-gray-600">
                  <Link
                    to="/"
                    className="relative transition hover:text-orange-500 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-orange-500 after:transition-all hover:after:w-full"
                  >
                    Inicio
                  </Link>

                  {isAuthenticated ? (
                    <>
                      <Link
                        to={hasProfile ? "/dashboard" : "/profile/setup"}
                        className="relative transition hover:text-orange-500 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-orange-500 after:transition-all hover:after:w-full"
                      >
                        Painel
                      </Link>
                      <Link
                        to="/profile"
                        className="relative transition hover:text-orange-500 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-orange-500 after:transition-all hover:after:w-full"
                      >
                        Perfil
                      </Link>
                    </>
                  ) : (
                    <>
                      <a
                        href="#"
                        className="relative transition hover:text-orange-500 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-orange-500 after:transition-all hover:after:w-full"
                      >
                        Funcoes
                      </a>

                      <a
                        href="#"
                        className="relative transition hover:text-orange-500 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-orange-500 after:transition-all hover:after:w-full"
                      >
                        Planos
                      </a>
                    </>
                  )}
                </nav>

        {/* Ações */}
        <div className="flex items-center gap-4">
                  {isAuthenticated ? (
                    <button
                      onClick={logout}
                      className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-600"
                    >
                      Sair
                    </button>
                  ) : (
                    <>
                      <Link to="/register" className="text-sm text-gray-700 hover:text-orange-500">
                        Experimente gratis
                      </Link>

                      <Link
                        to="/login"
                        className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-600"
                      >
                        Login
                      </Link>
                    </>
                  )}
        </div>
      </div>
    </header>
  );
}
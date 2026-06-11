import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

type Page = { label: string; path: string; search?: string; indent?: boolean };

const PAGES: Page[] = [
  { label: "Home",               path: "/" },
  { label: "Login",              path: "/login" },
  { label: "Register",           path: "/register" },
  { label: "Profile Setup",      path: "/profile/setup" },
  { label: "Dashboard — Nutricionista", path: "/app" },
  { label: "Dashboard — Paciente",      path: "/app", search: "?role=patient", indent: true },
  { label: "Planos Alimentares", path: "/app/dietas" },
  { label: "Criar Plano",        path: "/app/dietas/nova" },
  { label: "Minha Dieta",        path: "/app/minha-dieta" },
  { label: "Lista de Compras",   path: "/app/lista-de-compras" },
];

export default function DevNav() {
  const [open, setOpen] = useState(false);
  const { pathname, search } = useLocation();

  function isActive(page: Page) {
    return pathname === page.path && (page.search ?? "") === search;
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2">
      {open && (
        <div className="rounded-2xl border border-dashed border-violet-400 bg-white shadow-xl overflow-hidden w-56">
          <p className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-violet-400 bg-violet-50 border-b border-dashed border-violet-200">
            DEV — Navegação
          </p>
          <ul className="py-1">
            {PAGES.map((page) => {
              const active = isActive(page);
              return (
                <li key={page.path + (page.search ?? "")}>
                  <Link
                    to={page.path + (page.search ?? "")}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-2 py-2 text-sm transition hover:bg-violet-50 ${
                      page.indent ? "pl-7 pr-4" : "px-4"
                    } ${active ? "font-semibold text-violet-600" : "text-gray-700"}`}
                  >
                    {active && (
                      <span className="h-1.5 w-1.5 rounded-full bg-violet-500 shrink-0" />
                    )}
                    {page.indent && !active && (
                      <span className="h-1.5 w-1.5 rounded-full bg-gray-200 shrink-0" />
                    )}
                    {page.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        title="Dev Navigation"
        className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-dashed border-violet-400 bg-white text-violet-500 shadow-lg transition hover:bg-violet-50 active:scale-95"
      >
        <span className="text-xs font-black tracking-tight">DEV</span>
      </button>
    </div>
  );
}

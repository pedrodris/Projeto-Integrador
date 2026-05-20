import { useForm } from "react-hook-form";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../auth/useAuth";
import { api, getApiErrorMessage } from "../lib/api";
import type { AuthSession } from "../auth/types";

type FormData = {
  email: string;
  password: string;
  remember: boolean;
};

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setSession } = useAuth();
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const { register, handleSubmit } = useForm<FormData>();

  async function onSubmit(data: FormData) {
    setSubmissionError(null);

    try {
      const response = await api.post<AuthSession>("/auth/login", {
        email: data.email,
        password: data.password,
      });

      setSession(response.data, data.remember ? "local" : "session");

      const destination =
        (location.state as { from?: { pathname?: string } } | null)?.from
          ?.pathname || "/app";

      navigate(destination, { replace: true });
    } catch (error) {
      setSubmissionError(getApiErrorMessage(error));
    }
  }

  return (
    <div className="min-h-screen flex font-[Inter] bg-[#f5f5f5]">
      <div className="w-[35%] bg-orange-500 hidden lg:block" />

      <div className="flex w-full lg:w-[65%] items-center justify-center px-6">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-center gap-3 mb-10">
            <span className="text-4xl"></span>
            <h1 className="text-3xl font-bold text-gray-900">
              App Nutricionista
            </h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <input
              type="text"
              placeholder="Email"
              {...register("email")}
              className="w-full h-11 px-4 rounded-xl border border-gray-300 bg-white text-sm outline-none focus:ring-2 focus:ring-orange-400"
            />

            <input
              type="password"
              placeholder="Senha"
              {...register("password")}
              className="w-full h-11 px-4 rounded-xl border border-gray-300 bg-white text-sm outline-none focus:ring-2 focus:ring-orange-400"
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600">
                <input type="checkbox" {...register("remember")} />
                Lembrar acesso
              </label>

              <span className="text-gray-400">
                Recuperacao de senha em breve
              </span>
            </div>

            <button
              type="submit"
              className="w-full h-11 rounded-xl bg-yellow-400 font-semibold text-gray-900 hover:bg-yellow-500 transition"
            >
              Entrar
            </button>

            {submissionError ? (
              <p className="text-sm text-red-600">{submissionError}</p>
            ) : null}
          </form>

          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-gray-300" />
            <span className="text-sm text-gray-500 font-semibold">OU</span>
            <div className="flex-1 h-px bg-gray-300" />
          </div>

          <div className="space-y-3">
            <button className="w-full h-11 flex items-center justify-center gap-3 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 transition">
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-5 h-5"
              />
              <span className="text-sm font-medium text-gray-700">
                Entrar com Google
              </span>
            </button>

            <button className="w-full h-11 flex items-center justify-center gap-3 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 transition">
              <img
                src="https://www.svgrepo.com/show/303110/apple-black-logo.svg"
                alt="Apple"
                className="w-5 h-5"
              />
              <span className="text-sm font-medium text-gray-700">
                Entrar com Apple
              </span>
            </button>
          </div>

          <p className="text-center text-sm text-gray-600 mt-8">
            Não tem cadastro?{" "}
            <Link to="/register" className="text-orange-500 hover:underline">
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

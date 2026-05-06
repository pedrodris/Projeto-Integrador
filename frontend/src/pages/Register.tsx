import { useForm } from "react-hook-form";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { extractApiErrorMessage } from "../lib/api/errors";

type FormData = {
  name: string;
  phone: string;
  cpf: string;
  email: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
};

export default function Register() {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const { register, handleSubmit } = useForm<FormData>();

  async function onSubmit(data: FormData) {
    setApiError("");
    setSuccessMessage("");

    if (data.password !== data.confirmPassword) {
      setApiError("As senhas nao conferem.");
      return;
    }

    if (!data.terms) {
      setApiError("Voce precisa aceitar os termos para continuar.");
      return;
    }

    try {
      const response = await registerUser({
        email: data.email,
        password: data.password,
      });

      if (response.session_created) {
        navigate("/profile/setup", { replace: true });
        return;
      }

      setSuccessMessage(response.message || "Conta criada. Faca login para continuar.");
      navigate("/login", { replace: true });
    } catch (error) {
      setApiError(extractApiErrorMessage(error));
    }
  }

  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* Lado esquerdo */}
      <div className="w-[35%] bg-orange-500 hidden lg:block" />

      {/* Lado direito */}
      <div className="flex w-full lg:w-[65%] items-center justify-center px-6">

        <div className="w-full max-w-md">

          <h1 className="text-2xl font-bold text-center mb-8">
            App Nutricionista
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            <input
              placeholder="Nome Completo"
              {...register("name")}
              className="input"
            />

            <div className="flex gap-3">
              <input
                placeholder="Telefone"
                {...register("phone")}
                className="input"
              />
              <input
                placeholder="CPF"
                {...register("cpf")}
                className="input"
              />
            </div>

            <input
              placeholder="Email"
              {...register("email")}
              className="input"
            />

            <input
              type="password"
              placeholder="Senha"
              {...register("password")}
              className="input"
            />

            <input
              type="password"
              placeholder="Confirmar Senha"
              {...register("confirmPassword")}
              className="input"
            />

            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input type="checkbox" {...register("terms")} />
              Li e concordo com os termos
            </label>

            <button className="w-full h-11 bg-yellow-400 rounded-xl font-semibold hover:bg-yellow-500">
              Continuar para os planos
            </button>

            {apiError ? (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {apiError}
              </p>
            ) : null}

            {successMessage ? (
              <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
                {successMessage}
              </p>
            ) : null}

            <p className="text-center text-sm text-gray-600 mt-3">
              Ja tem cadastro?{" "}
              <Link to="/login" className="text-orange-500 hover:underline">
                Fazer login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
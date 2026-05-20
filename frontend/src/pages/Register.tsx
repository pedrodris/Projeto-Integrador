import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import { useAuth } from "../auth/useAuth";
import type { AuthSession, AuthUser, SignupResponse } from "../auth/types";
import { api, getApiErrorMessage, setApiAccessToken } from "../lib/api";
import {
  clearProfileSetupPrefill,
  saveProfileSetupPrefill,
} from "../profile/setupPrefill";

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
  const { setSession } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  async function onSubmit(data: FormData) {
    setIsSubmitting(true);
    setSubmissionError(null);
    setSuccessMessage(null);

    try {
      const response = await api.post<SignupResponse>("/auth/signup", {
        email: data.email.trim(),
        password: data.password,
      });

      if (
        response.data.session_created &&
        response.data.access_token &&
        response.data.refresh_token
      ) {
        setApiAccessToken(response.data.access_token);

        try {
          const currentUserResponse = await api.get<AuthUser>("/auth/me");
          const session: AuthSession = {
            access_token: response.data.access_token,
            refresh_token: response.data.refresh_token,
            token_type: "bearer",
            user: currentUserResponse.data,
          };

          saveProfileSetupPrefill({
            phone: data.phone,
            username: data.name,
          });
          setSession(session, "local");
          reset();
          navigate("/app", { replace: true });
        } catch {
          clearProfileSetupPrefill();
          setApiAccessToken(null);
          reset();
          setSuccessMessage(
            "Conta criada, mas o login automatico falhou. Entre manualmente para continuar.",
          );
        }

        return;
      }

      setApiAccessToken(null);
      setSuccessMessage(response.data.message);
      reset();
    } catch (error) {
      setApiAccessToken(null);
      setSubmissionError(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      <div className="w-[35%] bg-orange-500 hidden lg:block" />

      <div className="flex w-full lg:w-[65%] items-center justify-center px-6">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-8">
            App Nutricionista
          </h1>

          {successMessage ? (
            <div className="space-y-4 rounded-2xl border border-green-200 bg-green-50 p-6 text-sm text-gray-700">
              <p className="font-semibold text-green-800">Conta criada.</p>
              <p>{successMessage}</p>
              <Link to="/login" className="text-orange-600 hover:underline">
                Ir para login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <input
                placeholder="Nome Completo"
                {...register("name", {
                  required: "Informe seu nome.",
                })}
                className="input"
              />
              {errors.name ? (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              ) : null}

              <div className="flex gap-3">
                <div className="flex-1">
                  <input
                    placeholder="Telefone"
                    {...register("phone")}
                    className="input"
                  />
                </div>
                <div className="flex-1">
                  <input
                    placeholder="CPF (ainda nao salvo no sistema)"
                    {...register("cpf")}
                    className="input"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Este campo ainda nao e persistido no backend atual.
                  </p>
                </div>
              </div>

              <input
                placeholder="Email"
                {...register("email", {
                  required: "Informe seu email.",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Informe um email valido.",
                  },
                })}
                className="input"
              />
              {errors.email ? (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              ) : null}

              <input
                type="password"
                placeholder="Senha"
                {...register("password", {
                  required: "Informe sua senha.",
                  minLength: {
                    value: 6,
                    message: "A senha deve ter pelo menos 6 caracteres.",
                  },
                })}
                className="input"
              />
              {errors.password ? (
                <p className="text-sm text-red-600">{errors.password.message}</p>
              ) : null}

              <input
                type="password"
                placeholder="Confirmar Senha"
                {...register("confirmPassword", {
                  required: "Confirme sua senha.",
                  validate: (value) =>
                    value === getValues("password") ||
                    "As senhas nao coincidem.",
                })}
                className="input"
              />
              {errors.confirmPassword ? (
                <p className="text-sm text-red-600">
                  {errors.confirmPassword.message}
                </p>
              ) : null}

              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  {...register("terms", {
                    required: "Voce precisa aceitar os termos.",
                  })}
                />
                Li e concordo com os termos
              </label>
              {errors.terms ? (
                <p className="text-sm text-red-600">{errors.terms.message}</p>
              ) : null}

              {submissionError ? (
                <p className="text-sm text-red-600">{submissionError}</p>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 bg-yellow-400 rounded-xl font-semibold hover:bg-yellow-500 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "Criando conta..." : "Continuar para os planos"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";

import { getApiErrorMessage } from "../lib/api";
import { useProfile } from "../profile/useProfile";
import {
  clearProfileSetupPrefill,
  readProfileSetupPrefill,
} from "../profile/setupPrefill";
import type { ProfileRole, ProfileSetupPayload } from "../profile/types";

const INPUT =
  "w-full h-11 px-4 rounded-xl border border-gray-300 bg-white text-sm outline-none focus:ring-2 focus:ring-orange-400";

const LABEL = "block mb-1 text-sm font-medium text-gray-700";

type FormData = {
  username: string;
  role: ProfileRole;
  phone: string;
  // nutritionist
  crn: string;
  specialty: string;
  bio: string;
  // patient — physical
  birth_date: string;
  sex: string;
  height_cm: string;
  weight_kg: string;
  // patient — lifestyle
  activity_level: string;
  // patient — nutrition
  goal_summary: string;
  food_restrictions: string;
  // patient — health
  medical_notes: string;
};

export default function ProfileSetup() {
  const navigate = useNavigate();
  const { profile, setupProfile, status } = useProfile();
  const profilePrefill = readProfileSetupPrefill();
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, watch } = useForm<FormData>({
    defaultValues: {
      phone: profilePrefill?.phone || "",
      role: "patient",
      username: profilePrefill?.username || "",
    },
  });

  const role = watch("role");

  useEffect(() => {
    if (status === "ready" && profile) {
      clearProfileSetupPrefill();
    }
  }, [profile, status]);

  if (status === "ready" && profile) {
    return <Navigate to="/app" replace />;
  }

  async function onSubmit(data: FormData) {
    const payload: ProfileSetupPayload = {
      username: data.username,
      role: data.role,
    };

    if (data.phone.trim()) payload.phone = data.phone.trim();

    if (data.role === "nutritionist") {
      payload.nutritionist_profile = { crn: data.crn.trim() };
      if (data.specialty.trim()) payload.nutritionist_profile.specialty = data.specialty.trim();
      if (data.bio.trim()) payload.nutritionist_profile.bio = data.bio.trim();
    } else {
      payload.patient_profile = {};
      if (data.birth_date) payload.patient_profile.birth_date = data.birth_date;
      if (data.sex) payload.patient_profile.sex = data.sex;
      if (data.height_cm) payload.patient_profile.height_cm = parseFloat(data.height_cm);
      if (data.weight_kg) payload.patient_profile.weight_kg = parseFloat(data.weight_kg);
      if (data.activity_level) payload.patient_profile.activity_level = data.activity_level;
      if (data.goal_summary.trim()) payload.patient_profile.goal_summary = data.goal_summary.trim();
      if (data.food_restrictions.trim()) payload.patient_profile.food_restrictions = data.food_restrictions.trim();
      if (data.medical_notes.trim()) payload.patient_profile.medical_notes = data.medical_notes.trim();
    }

    setSubmissionError(null);
    setIsSubmitting(true);

    try {
      await setupProfile(payload);
      clearProfileSetupPrefill();
      navigate("/app", { replace: true });
    } catch (error) {
      setSubmissionError(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="mx-auto max-w-2xl">

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Complete seu perfil</h1>
          <p className="mt-1 text-sm text-gray-500">
            Seu acesso já está ativo. Preencha as informações abaixo para continuar.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* Dados básicos */}
          <section className="rounded-2xl bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
              Dados básicos
            </h2>

            <div>
              <label className={LABEL}>Nome de exibição <span className="text-red-500">*</span></label>
              <input
                placeholder="Como você quer ser chamado"
                {...register("username", { required: true })}
                className={INPUT}
              />
            </div>

            <div>
              <label className={LABEL}>Telefone</label>
              <input
                placeholder="(00) 00000-0000"
                {...register("phone")}
                className={INPUT}
              />
            </div>

            <div>
              <label className={LABEL}>Perfil <span className="text-red-500">*</span></label>
              <div className="grid grid-cols-2 gap-3">
                {(["patient", "nutritionist"] as ProfileRole[]).map((r) => (
                  <label
                    key={r}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 text-sm transition ${
                      role === r
                        ? "border-orange-400 bg-orange-50 font-semibold text-orange-700"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      value={r}
                      {...register("role", { required: true })}
                      className="accent-orange-500"
                    />
                    {r === "patient" ? "Paciente" : "Nutricionista"}
                  </label>
                ))}
              </div>
            </div>
          </section>

          {/* Seção paciente */}
          {role === "patient" && (
            <>
              {/* Dados físicos */}
              <section className="rounded-2xl bg-white p-6 shadow-sm space-y-4">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
                  Dados físicos
                </h2>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={LABEL}>Data de nascimento</label>
                    <input
                      type="date"
                      {...register("birth_date")}
                      className={INPUT}
                    />
                  </div>

                  <div>
                    <label className={LABEL}>Sexo</label>
                    <select {...register("sex")} className={INPUT}>
                      <option value="">Selecione</option>
                      <option value="masculino">Masculino</option>
                      <option value="feminino">Feminino</option>
                      <option value="outro">Outro</option>
                      <option value="nao_informado">Prefiro não informar</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={LABEL}>Altura (cm)</label>
                    <input
                      type="number"
                      placeholder="Ex: 170"
                      min="50"
                      max="250"
                      step="1"
                      {...register("height_cm")}
                      className={INPUT}
                    />
                  </div>

                  <div>
                    <label className={LABEL}>Peso atual (kg)</label>
                    <input
                      type="number"
                      placeholder="Ex: 70"
                      min="20"
                      max="300"
                      step="0.1"
                      {...register("weight_kg")}
                      className={INPUT}
                    />
                  </div>
                </div>
              </section>

              {/* Estilo de vida */}
              <section className="rounded-2xl bg-white p-6 shadow-sm space-y-4">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
                  Estilo de vida
                </h2>

                <div>
                  <label className={LABEL}>Nível de atividade física</label>
                  <select {...register("activity_level")} className={INPUT}>
                    <option value="">Selecione</option>
                    <option value="sedentario">Sedentário (sem exercício)</option>
                    <option value="levemente_ativo">Levemente ativo (1–2x por semana)</option>
                    <option value="moderadamente_ativo">Moderadamente ativo (3–5x por semana)</option>
                    <option value="muito_ativo">Muito ativo (6–7x por semana)</option>
                    <option value="extremamente_ativo">Extremamente ativo (atleta / trabalho físico)</option>
                  </select>
                </div>

                <div>
                  <label className={LABEL}>Objetivo</label>
                  <textarea
                    placeholder="Ex: Perder 5 kg, ganhar massa muscular, manter o peso..."
                    rows={2}
                    {...register("goal_summary")}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-sm outline-none focus:ring-2 focus:ring-orange-400 resize-none"
                  />
                </div>
              </section>

              {/* Restrições e saúde */}
              <section className="rounded-2xl bg-white p-6 shadow-sm space-y-4">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
                  Restrições e saúde
                </h2>

                <div>
                  <label className={LABEL}>Alergias e restrições alimentares</label>
                  <textarea
                    placeholder="Ex: Intolerância à lactose, alergia a amendoim, vegetariano..."
                    rows={3}
                    {...register("food_restrictions")}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-sm outline-none focus:ring-2 focus:ring-orange-400 resize-none"
                  />
                </div>

                <div>
                  <label className={LABEL}>Observações médicas <span className="text-gray-400 font-normal">(opcional)</span></label>
                  <textarea
                    placeholder="Ex: Hipertensão, diabetes tipo 2, hipotireoidismo..."
                    rows={3}
                    {...register("medical_notes")}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-sm outline-none focus:ring-2 focus:ring-orange-400 resize-none"
                  />
                </div>
              </section>
            </>
          )}

          {/* Seção nutricionista */}
          {role === "nutritionist" && (
            <section className="rounded-2xl bg-white p-6 shadow-sm space-y-4">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
                Dados profissionais
              </h2>

              <div>
                <label className={LABEL}>CRN <span className="text-red-500">*</span></label>
                <input
                  placeholder="Ex: CRN-3 12345"
                  {...register("crn", { required: role === "nutritionist" })}
                  className={INPUT}
                />
              </div>

              <div>
                <label className={LABEL}>Especialidade</label>
                <input
                  placeholder="Ex: Nutrição esportiva, clínica, infantil..."
                  {...register("specialty")}
                  className={INPUT}
                />
              </div>

              <div>
                <label className={LABEL}>Bio</label>
                <textarea
                  placeholder="Fale um pouco sobre você e sua abordagem"
                  rows={4}
                  {...register("bio")}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-sm outline-none focus:ring-2 focus:ring-orange-400 resize-none"
                />
              </div>
            </section>
          )}

          {submissionError && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {submissionError}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-orange-500 px-4 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Salvando..." : "Salvar perfil"}
          </button>
        </form>
      </div>
    </main>
  );
}

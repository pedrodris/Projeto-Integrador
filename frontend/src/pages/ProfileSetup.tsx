import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import Navbar from "../components/Navbar";
import FeedbackToast from "../components/FeedbackToast";
import { setupProfile, uploadAvatar } from "../lib/api/profile";
import { extractApiErrorMessage } from "../lib/api/errors";
import { useAuth } from "../contexts/AuthContext";
import type { UserRole } from "../types/api";

type SetupFormData = {
  username: string;
  phone: string;
  avatar_url: string;
  role: UserRole;
  crn: string;
  specialty: string;
  bio: string;
  birth_date: string;
  sex: string;
  height_cm: string;
  activity_level: string;
  goal_summary: string;
};

export default function ProfileSetup() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setProfileDetails, refreshProfileStatus } = useAuth();
  const [apiError, setApiError] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    if (!feedback) return;
    const timer = window.setTimeout(() => setFeedback(null), 3500);
    return () => window.clearTimeout(timer);
  }, [feedback]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = useForm<SetupFormData>({
    defaultValues: {
      role: (location.state as any)?.role || "patient",
    },
  });

  const selectedRole = watch("role");

  async function onSubmit(data: SetupFormData) {
    setApiError("");
    // upload file first if present
    let avatarData: string | undefined = data.avatar_url || undefined;
    if (avatarFile) {
      try {
        setIsUploading(true);
        setUploadProgress(0);
        const profile = await uploadAvatar(avatarFile, (p) => setUploadProgress(p));
        avatarData = profile.avatar_url || undefined;
      } catch (err) {
        setApiError(String(err));
        setFeedback({ type: "error", message: "Falha no upload da imagem." });
        setIsUploading(false);
        return;
      } finally {
        setIsUploading(false);
      }
    }
    try {
      const response = await setupProfile({
        username: data.username,
        role: data.role,
        phone: data.phone || undefined,
        avatar_url: avatarData || undefined,
        nutritionist_profile:
          data.role === "nutritionist"
            ? {
                crn: data.crn,
                specialty: data.specialty || undefined,
                bio: data.bio || undefined,
              }
            : undefined,
        patient_profile:
          data.role === "patient"
            ? {
                birth_date: data.birth_date || undefined,
                sex: data.sex || undefined,
                height_cm: data.height_cm ? Number(data.height_cm) : undefined,
                activity_level: data.activity_level || undefined,
                goal_summary: data.goal_summary || undefined,
              }
            : undefined,
      });

      setProfileDetails(response);
      await refreshProfileStatus();
      setFeedback({ type: "success", message: "Perfil configurado com sucesso." });
      navigate("/dashboard", { replace: true });
    } catch (error) {
      setApiError(extractApiErrorMessage(error));
      setFeedback({ type: "error", message: "Não foi possível salvar o perfil." });
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {feedback ? <FeedbackToast type={feedback.type} message={feedback.message} /> : null}
      <Navbar />

      <section className="max-w-3xl mx-auto px-6 py-10">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
          <h1 className="text-2xl font-bold text-gray-900">Configurar perfil</h1>
          <p className="text-sm text-gray-600 mt-2">
            Complete os dados iniciais para liberar seu painel.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-6">
            <input
              placeholder="Nome de exibicao"
              {...register("username", { required: true })}
              className="input"
            />

            <div className="grid md:grid-cols-2 gap-3">
              <input
                placeholder="Telefone"
                {...register("phone")}
                className="input"
              />
              <div>
                <label className="text-sm text-gray-700 font-medium">Foto de perfil</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0] ?? null;
                    setAvatarFile(f);
                    setPreviewUrl(f ? URL.createObjectURL(f) : null);
                  }}
                  className="mt-1"
                  disabled={isUploading}
                />
                {isUploading ? (
                  <div className="w-full mt-2">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-2 bg-yellow-400" style={{ width: `${uploadProgress}%` }} />
                    </div>
                    <p className="text-xs text-gray-600 mt-1">Enviando: {uploadProgress}%</p>
                  </div>
                ) : null}
                {previewUrl ? (
                  <img src={previewUrl} alt="preview" className="w-20 h-20 rounded-full mt-2 object-cover" />
                ) : null}
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-700 font-medium">Tipo de perfil</label>
              <select {...register("role")} className="input mt-1">
                <option value="patient">Paciente</option>
                <option value="nutritionist">Nutricionista</option>
              </select>
            </div>

            {selectedRole === "nutritionist" ? (
              <div className="space-y-3 rounded-xl border border-orange-200 bg-orange-50 p-4">
                <h2 className="font-semibold text-gray-900">Dados do nutricionista</h2>
                <input
                  placeholder="CRN"
                  {...register("crn", { required: selectedRole === "nutritionist" })}
                  className="input"
                />
                <input
                  placeholder="Especialidade"
                  {...register("specialty")}
                  className="input"
                />
                <textarea
                  placeholder="Bio"
                  {...register("bio")}
                  className="w-full min-h-24 px-4 py-3 rounded-xl border border-gray-300 bg-white text-sm outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
            ) : (
              <div className="space-y-3 rounded-xl border border-yellow-200 bg-yellow-50 p-4">
                <h2 className="font-semibold text-gray-900">Dados do paciente</h2>
                <div className="grid md:grid-cols-2 gap-3">
                  <input type="date" {...register("birth_date")} className="input" />
                  <input placeholder="Sexo" {...register("sex")} className="input" />
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  <input
                    placeholder="Altura (cm)"
                    {...register("height_cm")}
                    className="input"
                  />
                  <input
                    placeholder="Nivel de atividade"
                    {...register("activity_level")}
                    className="input"
                  />
                </div>
                <textarea
                  placeholder="Resumo de objetivo"
                  {...register("goal_summary")}
                  className="w-full min-h-24 px-4 py-3 rounded-xl border border-gray-300 bg-white text-sm outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
            )}

            {apiError ? (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {apiError}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="w-full h-11 bg-yellow-400 rounded-xl font-semibold text-gray-900 hover:bg-yellow-500 disabled:opacity-60"
            >
              {isUploading ? (
                <span className="inline-flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-900/30 border-t-gray-900" />
                  {`Enviando imagem... (${uploadProgress}%)`}
                </span>
              ) : isSubmitting ? (
                "Salvando..."
              ) : (
                "Finalizar configuracao"
              )}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

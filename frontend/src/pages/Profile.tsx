import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Navbar from "../components/Navbar";
import FeedbackToast from "../components/FeedbackToast";
import { useAuth } from "../contexts/AuthContext";
import { extractApiErrorMessage } from "../lib/api/errors";
import { getMyProfileDetails, updateMyProfile, uploadAvatar } from "../lib/api/profile";

type ProfileFormData = {
  username: string;
  phone: string;
  avatar_url: string;
};

export default function Profile() {
  const { profileDetails, setProfileDetails, refreshProfileStatus } = useAuth();
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState("");
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
    reset,
    formState: { isSubmitting },
  } = useForm<ProfileFormData>();

  useEffect(() => {
    const loadProfile = async () => {
      if (profileDetails) {
        reset({
          username: profileDetails.profile.username,
          phone: profileDetails.profile.phone || "",
        });
        setPreviewUrl(profileDetails.profile.avatar_url || null);
        return;
      }

      try {
        const details = await getMyProfileDetails();
        setProfileDetails(details);
        reset({
          username: details.profile.username,
          phone: details.profile.phone || "",
        });
        setPreviewUrl(details.profile.avatar_url || null);
      } catch (error) {
        setApiError(extractApiErrorMessage(error));
      }
    };

    void loadProfile();
  }, [profileDetails, reset, setProfileDetails]);

  async function onSubmit(data: ProfileFormData) {
    setApiError("");
    setSuccess("");
    // upload file first if present
    let avatarData: string | undefined = data.avatar_url || undefined;
    if (avatarFile) {
      try {
        setIsUploading(true);
        setUploadProgress(0);
        const profile = await uploadAvatar(avatarFile, (p) => setUploadProgress(p));
        avatarData = profile.avatar_url || undefined;
        setPreviewUrl(avatarData || previewUrl);
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
      await updateMyProfile({
        username: data.username,
        phone: data.phone || undefined,
        avatar_url: avatarData || undefined,
      });

      await refreshProfileStatus();
      setSuccess("Perfil atualizado com sucesso.");
      setFeedback({ type: "success", message: "Imagem enviada e perfil atualizado." });
    } catch (error) {
      setApiError(extractApiErrorMessage(error));
      setFeedback({ type: "error", message: "Não foi possível atualizar o perfil." });
    }
  }

  const roleLabel =
    profileDetails?.profile.role === "nutritionist" ? "Nutricionista" : "Paciente";

  return (
    <div className="min-h-screen bg-gray-100">
      {feedback ? <FeedbackToast type={feedback.type} message={feedback.message} /> : null}
      <Navbar />

      <section className="max-w-3xl mx-auto px-6 py-10">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
          <h1 className="text-2xl font-bold text-gray-900">Meu perfil</h1>
          <p className="text-sm text-gray-600 mt-2">
            Revise e edite seus dados principais.
          </p>

          {profileDetails ? (
            <div className="mt-4 text-sm text-gray-600">
              <span className="inline-flex items-center rounded-full bg-orange-100 text-orange-700 px-3 py-1 font-medium">
                Tipo: {roleLabel}
              </span>
            </div>
          ) : null}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-6">
            <input
              placeholder="Nome de exibicao"
              {...register("username", { required: true })}
              className="input"
            />

            <div className="grid md:grid-cols-2 gap-3">
              <input placeholder="Telefone" {...register("phone")} className="input" />
              <div>
                <label className="text-sm text-gray-700 font-medium">Foto de perfil</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0] ?? null;
                    setAvatarFile(f);
                    setPreviewUrl(f ? URL.createObjectURL(f) : previewUrl);
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

            {apiError ? (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {apiError}
              </p>
            ) : null}

            {success ? (
              <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
                {success}
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
                "Salvar alteracoes"
              )}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

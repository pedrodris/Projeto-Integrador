type FeedbackToastProps = {
  type: "success" | "error";
  message: string;
};

export default function FeedbackToast({ type, message }: FeedbackToastProps) {
  const toneClasses =
    type === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : "border-red-200 bg-red-50 text-red-700";

  return (
    <div
      role="status"
      className={`fixed top-4 right-4 z-50 max-w-sm rounded-2xl border px-4 py-3 shadow-lg ${toneClasses}`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 h-3 w-3 rounded-full bg-current" />
        <p className="text-sm font-medium leading-5">{message}</p>
      </div>
    </div>
  );
}
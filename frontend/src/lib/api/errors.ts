export function extractApiErrorMessage(error: unknown): string {
  if (!isRecord(error)) {
    return "Erro inesperado. Tente novamente.";
  }

  const response = isRecord(error.response) ? error.response : null;
  const data = response && isRecord(response.data) ? response.data : null;
  const detail = data?.detail;

  if (typeof detail === "string" && detail.trim()) {
    return detail;
  }

  return "Nao foi possivel concluir a solicitacao.";
}

export function isHttpStatus(error: unknown, status: number): boolean {
  if (!isRecord(error)) {
    return false;
  }

  const response = isRecord(error.response) ? error.response : null;
  return response?.status === status;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

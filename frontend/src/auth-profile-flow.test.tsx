import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AuthProvider } from "./auth/AuthProvider";
import RequireAuth from "./auth/RequireAuth";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProfileSetup from "./pages/ProfileSetup";
import { ProfileProvider } from "./profile/ProfileProvider";
import type { AuthSession, AuthUser } from "./auth/types";
import type { ProfileDetails } from "./profile/types";
import { saveProfileSetupPrefill } from "./profile/setupPrefill";

const { apiMock } = vi.hoisted(() => ({
  apiMock: {
    defaults: {
      headers: {
        common: {} as Record<string, string>,
      },
    },
    get: vi.fn(),
    post: vi.fn(),
  },
}));

vi.mock("./lib/api", () => ({
  api: apiMock,
  getApiErrorMessage: (error: unknown) => {
    if (error instanceof Error) {
      return error.message;
    }

    if (
      typeof error === "object" &&
      error !== null &&
      "response" in error &&
      typeof error.response === "object" &&
      error.response !== null &&
      "data" in error.response &&
      typeof error.response.data === "object" &&
      error.response.data !== null &&
      "detail" in error.response.data &&
      typeof error.response.data.detail === "string"
    ) {
      return error.response.data.detail;
    }

    return "Nao foi possivel concluir a requisicao.";
  },
  isApiErrorStatus: (error: unknown, status: number) =>
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof error.response === "object" &&
    error.response !== null &&
    "status" in error.response &&
    error.response.status === status,
  setApiAccessToken: (token: string | null) => {
    if (token) {
      apiMock.defaults.headers.common.Authorization = `Bearer ${token}`;
      return;
    }

    delete apiMock.defaults.headers.common.Authorization;
  },
}));

const baseUser: AuthUser = {
  id: "user-1",
  email: "teste@example.com",
  phone: null,
  app_metadata: {},
  user_metadata: {},
};

const baseSession: AuthSession = {
  access_token: "access-token",
  refresh_token: "refresh-token",
  token_type: "bearer",
  user: baseUser,
};

const baseProfile: ProfileDetails = {
  profile: {
    id: "user-1",
    email: "teste@example.com",
    role: "patient",
    username: "Teste",
    phone: null,
    avatar_url: null,
    is_active: true,
    created_at: null,
    updated_at: null,
  },
  nutritionist_profile: null,
  patient_profile: {
    profile_id: "user-1",
    birth_date: null,
    sex: null,
    height_cm: null,
    activity_level: null,
    goal_summary: null,
    food_restrictions: null,
    medical_notes: null,
    weight_history: null,
    created_at: null,
    updated_at: null,
  },
};

function renderWithAuth(ui: ReactNode, initialEntries = ["/"]) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <AuthProvider>{ui}</AuthProvider>
    </MemoryRouter>,
  );
}

function renderWithAuthAndProfile(ui: ReactNode, initialEntries = ["/"]) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <AuthProvider>
        <ProfileProvider>{ui}</ProfileProvider>
      </AuthProvider>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  window.localStorage.clear();
  window.sessionStorage.clear();
  apiMock.get.mockReset();
  apiMock.post.mockReset();
  apiMock.defaults.headers.common = {};
});

describe("auth/profile flow", () => {
  it("completa signup com sessao imediata e entra no fluxo autenticado", async () => {
    apiMock.post.mockResolvedValueOnce({
      data: {
        user_id: "user-1",
        email: "teste@example.com",
        session_created: true,
        access_token: "access-token",
        refresh_token: "refresh-token",
        message: "ok",
      },
    });
    apiMock.get.mockResolvedValueOnce({ data: baseUser });

    renderWithAuth(
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/app" element={<div>App autenticado</div>} />
      </Routes>,
      ["/register"],
    );

    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText("Nome Completo"), "Teste");
    await user.type(screen.getByPlaceholderText("Telefone"), "11999999999");
    await user.type(screen.getByPlaceholderText(/CPF/), "12345678900");
    await user.type(screen.getByPlaceholderText("Email"), "teste@example.com");
    await user.type(screen.getByPlaceholderText("Senha"), "123456");
    await user.type(screen.getByPlaceholderText("Confirmar Senha"), "123456");
    await user.click(screen.getByRole("checkbox"));
    await user.click(
      screen.getByRole("button", { name: "Continuar para os planos" }),
    );

    await screen.findByText("App autenticado");

    expect(apiMock.post).toHaveBeenCalledWith("/auth/signup", {
      email: "teste@example.com",
      password: "123456",
    });
    expect(apiMock.get).toHaveBeenCalledWith("/auth/me");
    expect(window.localStorage.getItem("nutri.auth.session")).toContain(
      "access-token",
    );
    expect(window.sessionStorage.getItem("nutri.profile.setup-prefill")).toContain(
      "Teste",
    );
  });

  it("mostra mensagem de sucesso quando o signup exige confirmacao antes do login", async () => {
    apiMock.post.mockResolvedValueOnce({
      data: {
        user_id: "user-1",
        email: "teste@example.com",
        session_created: false,
        access_token: null,
        refresh_token: null,
        message: "Confirme seu email antes de entrar.",
      },
    });

    renderWithAuth(
      <Routes>
        <Route path="/register" element={<Register />} />
      </Routes>,
      ["/register"],
    );

    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText("Nome Completo"), "Teste");
    await user.type(screen.getByPlaceholderText("Email"), "teste@example.com");
    await user.type(screen.getByPlaceholderText("Senha"), "123456");
    await user.type(screen.getByPlaceholderText("Confirmar Senha"), "123456");
    await user.click(screen.getByRole("checkbox"));
    await user.click(
      screen.getByRole("button", { name: "Continuar para os planos" }),
    );

    await screen.findByText("Conta criada.");
    expect(screen.getByText("Confirme seu email antes de entrar.")).toBeVisible();
    expect(apiMock.get).not.toHaveBeenCalled();
  });

  it("cai para login manual quando o signup cria a conta mas o /auth/me falha", async () => {
    apiMock.post.mockResolvedValueOnce({
      data: {
        user_id: "user-1",
        email: "teste@example.com",
        session_created: true,
        access_token: "access-token",
        refresh_token: "refresh-token",
        message: "ok",
      },
    });
    apiMock.get.mockRejectedValueOnce(new Error("falha no auth/me"));

    renderWithAuth(
      <Routes>
        <Route path="/register" element={<Register />} />
      </Routes>,
      ["/register"],
    );

    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText("Nome Completo"), "Teste");
    await user.type(screen.getByPlaceholderText("Email"), "teste@example.com");
    await user.type(screen.getByPlaceholderText("Senha"), "123456");
    await user.type(screen.getByPlaceholderText("Confirmar Senha"), "123456");
    await user.click(screen.getByRole("checkbox"));
    await user.click(
      screen.getByRole("button", { name: "Continuar para os planos" }),
    );

    await screen.findByText(
      "Conta criada, mas o login automatico falhou. Entre manualmente para continuar.",
    );
    expect(window.localStorage.getItem("nutri.auth.session")).toBeNull();
    expect(window.sessionStorage.getItem("nutri.profile.setup-prefill")).toBeNull();
  });

  it("faz login e redireciona para a area autenticada", async () => {
    apiMock.post.mockResolvedValueOnce({ data: baseSession });

    renderWithAuth(
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/app" element={<div>App autenticado</div>} />
      </Routes>,
      ["/login"],
    );

    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText("Email"), "teste@example.com");
    await user.type(screen.getByPlaceholderText("Senha"), "123456");
    await user.click(screen.getByRole("button", { name: "Entrar" }));

    await screen.findByText("App autenticado");

    expect(apiMock.post).toHaveBeenCalledWith("/auth/login", {
      email: "teste@example.com",
      password: "123456",
    });
    expect(window.sessionStorage.getItem("nutri.auth.session")).toContain(
      "access-token",
    );
  });

  it("redireciona para o setup quando o perfil ainda nao existe", async () => {
    window.localStorage.setItem(
      "nutri.auth.session",
      JSON.stringify(baseSession),
    );
    apiMock.get.mockRejectedValueOnce({
      response: {
        status: 404,
        data: {
          detail: "Perfil ainda nao configurado.",
        },
      },
    });

    renderWithAuthAndProfile(
      <Routes>
        <Route path="/app" element={<Dashboard />} />
        <Route path="/profile/setup" element={<div>Tela de setup</div>} />
      </Routes>,
      ["/app"],
    );

    await screen.findByText("Tela de setup");
  });

  it("limpa a sessao e volta ao login quando o bootstrap recebe 401", async () => {
    window.localStorage.setItem(
      "nutri.auth.session",
      JSON.stringify(baseSession),
    );
    apiMock.get.mockRejectedValueOnce({
      response: {
        status: 401,
        data: {
          detail: "Token invalido",
        },
      },
    });

    renderWithAuthAndProfile(
      <Routes>
        <Route element={<RequireAuth />}>
          <Route path="/app" element={<Dashboard />} />
        </Route>
        <Route path="/login" element={<div>Tela de login</div>} />
      </Routes>,
      ["/app"],
    );

    await screen.findByText("Tela de login");
    expect(window.localStorage.getItem("nutri.auth.session")).toBeNull();
  });

  it("conclui o setup inicial e segue para /app", async () => {
    window.localStorage.setItem(
      "nutri.auth.session",
      JSON.stringify(baseSession),
    );
    saveProfileSetupPrefill({
      phone: "11999999999",
      username: "Paciente Novo",
    });
    apiMock.get.mockRejectedValueOnce({
      response: {
        status: 404,
        data: {
          detail: "Perfil ainda nao configurado.",
        },
      },
    });
    apiMock.post.mockResolvedValueOnce({ data: baseProfile });

    renderWithAuthAndProfile(
      <Routes>
        <Route path="/profile/setup" element={<ProfileSetup />} />
        <Route path="/app" element={<div>App autenticado</div>} />
      </Routes>,
      ["/profile/setup"],
    );

    expect(await screen.findByDisplayValue("Paciente Novo")).toBeVisible();
    expect(screen.getByDisplayValue("11999999999")).toBeVisible();

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Salvar perfil" }));

    await screen.findByText("App autenticado");

    await waitFor(() => {
      expect(apiMock.post).toHaveBeenCalledWith("/profile/setup", {
        username: "Paciente Novo",
        role: "patient",
        phone: "11999999999",
        patient_profile: {},
      });
    });
    expect(window.sessionStorage.getItem("nutri.profile.setup-prefill")).toBeNull();
  });
});

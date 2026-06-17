# NutriCare — Projeto Integrador

Plataforma de gerenciamento de dietas e pacientes para nutricionistas.

## Stack

- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS
- **Backend**: Python (FastAPI) + Supabase (auth e banco de dados)

## Estrutura

```
Projeto-Integrador/
├── frontend/   # SPA React (Vite, porta 5173)
└── backend/    # API FastAPI (porta 8000)
```

## Funcionalidades do frontend

- Landing page com seções de funções e planos
- Cadastro e login integrados à API de autenticação (`/auth/signup`, `/auth/login`)
- Configuração de perfil do nutricionista
- Criação e listagem de planos de dieta
- Minha dieta (checklist de refeições) e lista de compras
- Rotas protegidas via `RequireAuth` (redireciona para `/login` sem sessão)

## Como rodar o frontend

```bash
cd frontend
npm install
npm run dev
```

Acesse `http://localhost:5173`.

## Como rodar o backend

```bash
cd backend
uvicorn app.main:app --reload
```

API disponível em `http://localhost:8000`.

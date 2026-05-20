# Nutri Backend

Backend da plataforma de acompanhamento nutricional.

## Visão geral

Este backend é responsável por:

- autenticação de usuários via Supabase Auth
- validação de sessão/token no servidor
- gerenciamento do perfil base do usuário
- gerenciamento do perfil específico por papel (`patient` ou `nutritionist`)
- servir como base para as próximas funcionalidades do sistema, como vínculo entre nutricionista e paciente, mensagens e dietas

## Objetivo atual do projeto

Neste estágio, o foco do backend é garantir que a base do sistema esteja sólida antes da implementação das regras principais de negócio.

Atualmente, o backend já possui fluxo funcional para:

- cadastro de usuário
- login
- validação do usuário autenticado
- configuração inicial de perfil
- leitura do perfil base
- leitura dos detalhes do perfil
- atualização do perfil base

Hoje esse fluxo já está integrado ao frontend nos caminhos de:

- cadastro
- login
- bootstrap de perfil autenticado
- setup inicial de perfil

## Stack

- Python
- FastAPI
- Uvicorn
- Pydantic
- Supabase

## Estrutura do projeto

```text
backend/
├─ app/
│  ├─ main.py
│  ├─ core/
│  │  ├─ config.py
│  │  └─ supabase.py
│  ├─ api/
│  │  ├─ deps.py
│  │  └─ routes/
│  │     ├─ health.py
│  │     ├─ auth.py
│  │     └─ profile.py
│  ├─ schemas/
│  │  ├─ auth.py
│  │  └─ profile.py
│  └─ services/
│     └─ profile_service.py
├─ docs/
│  ├─ architecture.md
│  └─ current-status.md
├─ .env
├─ requirements.txt
└─ README.md
```

## Como rodar

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```
## Configurar o .env

```env
PROJECT_NAME=Nutri Backend
ENVIRONMENT=dev
API_V1_PREFIX=/api/v1
FRONTEND_URL=http://localhost:5173

SUPABASE_URL=
SUPABASE_KEY=
SUPABASE_SECRET_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

## Estado atual da integracao com o frontend

O frontend ja consome:

- `POST /api/v1/auth/signup`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`
- `GET /api/v1/profile/me/details`
- `POST /api/v1/profile/setup`

Observacoes importantes do fluxo atual:

- o login e por email e senha
- o cadastro cria a conta usando email e senha
- se o backend retornar sessao no signup, o frontend entra automaticamente no fluxo autenticado
- o setup inicial de perfil continua sendo uma etapa separada do signup
- `CPF` nao faz parte do contrato persistido do backend neste momento


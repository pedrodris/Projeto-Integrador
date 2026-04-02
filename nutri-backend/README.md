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

## Como rodar

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
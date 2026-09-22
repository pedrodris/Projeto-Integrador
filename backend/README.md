# Nutri Backend

Backend da plataforma de acompanhamento nutricional.

## Visão geral
Este backend é responsável por:
- autenticação de usuários via Supabase Auth
- validação de sessão e token no servidor
- gerenciamento do perfil base do usuário
- gerenciamento do perfil específico por papel (`patient` ou `nutritionist`)
- gestão de vínculos nutricionista-paciente
- gestão de dietas, presets de dieta, mensagens e notificações
- suporte a lembretes e configurações de notificação

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
│  ├─ api/
│  │  ├─ routes/
│  │  │  ├─ auth.py
│  │  │  ├─ care_link.py
│  │  │  ├─ diet.py
│  │  │  ├─ diet_preset.py
│  │  │  ├─ health.py
│  │  │  ├─ message.py
│  │  │  ├─ notification.py
│  │  │  ├─ profile.py
│  │  │  └─ reminder.py
│  │  └─ deps.py
│  ├─ core/
│  │  ├─ config.py
│  │  └─ supabase.py
│  ├─ schemas/
│  ├─ services/
│  ├─ main.py
│  └─ __init__.py
├─ sql/
├─ tests/
├─ .env.example
├─ pytest.ini
├─ requirements.txt
├─ README.md
└─ .gitignore
```

## Funcionalidades atuais
- `POST /api/v1/auth/signup`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `GET /api/v1/auth/me`
- `POST /api/v1/profile/setup`
- `GET /api/v1/profile/me`
- `GET /api/v1/profile/me/details`
- `PATCH /api/v1/profile/me`
- `GET /api/v1/profile/weight-history`
- `POST /api/v1/profile/weight-entry`
- `DELETE /api/v1/profile/weight-entry/{date}`
- rotas de vínculo, dietas, mensagens, presets, lembretes e notificações

## Como rodar

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
# ou .venv\Scripts\activate no Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Configuração do ambiente
Crie um arquivo `.env` com base no `.env.example`:

```env
PROJECT_NAME=Nutri Backend
ENVIRONMENT=dev
API_V1_PREFIX=/api/v1
FRONTEND_URL=http://localhost:3000

SUPABASE_URL=
SUPABASE_KEY=
SUPABASE_SECRET_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

## Observações de implementação
- O backend usa `Supabase Auth` e `Supabase Admin` para autenticação e acesso aos dados.
- O sistema está organizado em camadas de rotas, schemas e serviços.
- O backend já expõe vários módulos além do escopo inicial, incluindo dieta, vínculo, mensagens e notificações.

## Status
O backend está funcional para o MVP e cobre grande parte do domínio da aplicação, mas ainda há pendências em:
- testes automatizados
- paginação de listagens
- refinamento de permissões por papel
- login social completo no fluxo de callback

---

Veja também a documentação em `docs/backend-current-status.md`.

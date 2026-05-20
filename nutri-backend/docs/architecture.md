# Architecture

## Visao geral

O backend foi organizado em camadas para separar responsabilidades e permitir que o projeto cresca sem concentrar tudo nas rotas.

A arquitetura atual segue esta divisao:

- `routes` expoem os endpoints HTTP
- `schemas` definem os contratos de entrada e saida
- `services` concentram a regra de negocio
- `core` centraliza configuracao e integracao com Supabase

## Estrutura atual

```text
app/
|- main.py
|- core/
|  |- config.py
|  \- supabase.py
|- api/
|  |- deps.py
|  \- routes/
|     |- health.py
|     |- auth.py
|     \- profile.py
|- schemas/
|  |- auth.py
|  \- profile.py
\- services/
   \- profile_service.py
```

## Fluxo atual do sistema

1. O frontend chama `POST /api/v1/auth/signup` ou `POST /api/v1/auth/login`.
2. O backend usa Supabase Auth para criar ou autenticar o usuario.
3. Quando o frontend recebe uma sessao valida, ele armazena os tokens e consulta o fluxo autenticado.
4. O frontend chama `GET /api/v1/profile/me/details` para descobrir se o perfil ja existe.
5. Se o perfil nao existir, o usuario segue para `POST /api/v1/profile/setup`.

## Limites atuais

- O backend ainda nao implementa `care_links`, mensagens ou dietas.
- O fluxo atual cobre identidade, sessao e setup inicial de perfil.
- O frontend ja esta integrado ao onboarding atual, mas alguns campos exibidos na UI nao pertencem ao contrato persistido do backend.

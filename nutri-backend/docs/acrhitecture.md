
---

## `docs/architecture.md`

```md
# Architecture

## Visão geral

O backend foi organizado em camadas para separar responsabilidades e permitir que o projeto cresça sem virar um conjunto de arquivos misturados.

A arquitetura atual segue esta ideia:

- `routes` recebem e expõem as requisições HTTP
- `schemas` definem os contratos de entrada e saída
- `services` concentram a regra de negócio
- `core` centraliza configuração e integração com Supabase

## Estrutura geral

```text
app/
├─ main.py
├─ core/
│  ├─ config.py
│  └─ supabase.py
├─ api/
│  ├─ deps.py
│  └─ routes/
│     ├─ health.py
│     ├─ auth.py
│     └─ profile.py
├─ schemas/
│  ├─ auth.py
│  └─ profile.py
└─ services/
   └─ profile_service.py
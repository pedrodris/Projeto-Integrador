# Projeto-Integrador - NutriCare

## Integrantes atuais
- João Vitor de Morais Alecrim
- Pedro Vinícius Rodrigues de Pereira Nunes
- Thiago Kenji Ikuta

## Antigos integrantes
- Eliza Freitas de Castro
- Guilherme Santana dos Santos

## Descrição
Este repositório reúne o desenvolvimento de uma plataforma de acompanhamento nutricional voltada para conectar nutricionistas e pacientes em um fluxo completo de gestão de perfil, dietas, mensagens, lembretes, notificações e acompanhamento de evolução clínica.

A proposta da aplicação é facilitar a rotina de ambos os lados do relacionamento: pacientes recebem orientação e organização alimentar de forma mais clara e prática, enquanto nutricionistas conseguem acompanhar histórico, definir planos alimentares e manter comunicação contínua com seus pacientes em um ambiente digital centralizado.

A solução foi estruturada em frontend e backend independentes, com autenticação real, rotas protegidas, gestão de usuários por papel e integração com Supabase para autenticação, banco de dados e armazenamento de dados. O projeto busca representar um MVP funcional de um sistema completo de nutrição digital, cobrindo desde cadastro e onboarding até gestão de dietas, vínculo profissional-paciente e relatórios de adesão.

## Visão geral da solução

### Frontend
- React + TypeScript + Vite
- Tailwind CSS
- React Router
- Axios com refresh automático de token
- Fluxo de autenticação com email/senha e integração inicial ao login social (Google)

### Backend
- Python + FastAPI
- Supabase Auth + Supabase DB
- Rotas organizadas em módulos por domínio
- Gestão de perfis, dietas, vínculos, mensagens e notificações

## Funcionalidades implementadas

### Autenticação
- cadastro por email/senha
- login
- refresh de token
- validação de sessão autenticada
- perfil de usuário por papel (`patient` / `nutritionist`)

### Perfil
- setup inicial
- edição de dados cadastrais
- avatar por URL
- histórico de peso
- dados específicos por tipo de usuário

### Vínculo nutricionista-paciente
- criação de vínculo direto
- convite para vínculo
- aceite e recusa de convite
- listagem de pacientes e vínculos

### Dietas
- criação e edição de planos alimentares
- visualização de histórico
- planos ativos e anteriores
- edição por dia/semana
- presets e reutilização de refeições
- checklist e guia de compras

### Mensagens e comunicação
- chat entre nutricionista e paciente
- marcação de mensagens como lidas
- contagem de mensagens não lidas

### Lembretes e notificações
- lembretes para pacientes
- configurações de notificações
- inbox de notificações

## Estrutura do repositório

```text
Projeto-Integrador/
├─ backend/
│  ├─ app/
│  │  ├─ api/
│  │  │  ├─ routes/
│  │  │  └─ deps.py
│  │  ├─ core/
│  │  ├─ schemas/
│  │  ├─ services/
│  │  └─ main.py
│  ├─ tests/
│  ├─ sql/
│  ├─ .env.example
│  ├─ pytest.ini
│  ├─ requirements.txt
│  └─ README.md
├─ frontend/
│  ├─ src/
│  ├─ public/
│  ├─ .env.example
│  ├─ package.json
│  ├─ vite.config.ts
│  └─ README.md
├─ docs/
│  ├─ backend-architecture.md
│  ├─ backend-current-status.md
│  ├─ frontend-architecture.md
│  ├─ frontend-current-status.md
│  ├─ business.md
│  └─ historico-implementacoes.md
├─ README.md
├─ pyrightconfig.json
└─ package-lock.json
```

## Como executar

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # Linux/macOS
# ou .venv\Scripts\activate  # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Documentação técnica
A pasta `docs/` contém os principais registros de arquitetura e status do projeto:
- `backend-current-status.md`
- `frontend-current-status.md`
- `backend-architecture.md`
- `frontend-architecture.md`
- `business.md`
- `historico-implementacoes.md`

## Status atual
O projeto já está em um estágio funcional avançado, com domínio principal implementado e validado manualmente em várias partes do fluxo clínico e operacional. Ainda há pontos pendentes, e o foco principal segue em:
- testes automatizados
- acabamento do login social (Google)
- paginação em listagens de grande volume
- refinamento de regras de permissão e validação por papel

## Observações
O login com Google foi iniciado, mas ainda não está completamente concluído. Há também documentação mais antiga em alguns README do repositório que ainda precisa ser alinhada com o código atual.

## Contribuições

### Membros atuais
- João Vitor de Morais Alecrim: desenvolvimento de telas do frontend
- Pedro Vinícius Rodrigues de Pereira Nunes: apoio em backend e documentação do GitHub
- Thiago Kenji Ikuta: apoio em backend e integração frontend/backend

### Antigos integrantes
- Eliza Freitas de Castro: telas Figma e implementação inicial do login social
- Guilherme Santana dos Santos: documentação do projeto e apoio inicial na organização do material do repositório

---

Projeto em desenvolvimento como parte do Projeto Integrador 4.

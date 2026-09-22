# Frontend - NutriCare

Aplicação web do projeto NutriCare, desenvolvida em React + TypeScript com Vite.

## Visão geral
O frontend fornece a interface principal para:
- autenticação de usuários
- onboarding e edição de perfil
- navegação por papéis (`nutritionist` e `patient`)
- criação e visualização de dietas
- gestão de pacientes e vínculos
- mensagens, lembretes e notificações
- relatórios e visualizações de adesão

## Stack
- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- Supabase client

## Estrutura principal

```text
frontend/
├─ public/
├─ src/
│  ├─ auth/
│  ├─ components/
│  ├─ config/
│  ├─ data/
│  ├─ diet/
│  ├─ hooks/
│  ├─ lib/
│  ├─ notifications/
│  ├─ pages/
│  ├─ profile/
│  ├─ reminders/
│  ├─ routes/
│  ├─ App.css
│  ├─ App.tsx
│  ├─ index.css
│  ├─ main.tsx
│  └─ vite-env.d.ts
├─ .env.example
├─ eslint.config.js
├─ index.html
├─ package.json
├─ postcss.config.js
├─ tailwind.config.js
├─ tsconfig.json
├─ vite.config.ts
├─ README.md
└─ vercel.json
```

## Rotas principais

### Públicas
- `/`
- `/login`
- `/register`
- `/auth/callback`

### Protegidas
- `/app`
- `/profile/setup`
- `/profile/edit`
- `/app/dietas`
- `/app/dietas/nova`
- `/app/dietas/:id`
- `/app/dietas/:id/editar`
- `/app/dietas/presets/novo`
- `/app/dietas/presets/:id/editar`
- `/app/pacientes`
- `/app/minha-dieta`
- `/app/lista-de-compras`
- `/app/mensagens`
- `/app/notificacoes`
- `/app/notificacoes/preferencias`
- `/app/lembretes`
- `/app/meus-planos`
- `/app/relatorio-adesao`

## Como rodar

```bash
cd frontend
npm install
npm run dev
```

## Variáveis de ambiente
Crie um arquivo `.env` com base em `.env.example`:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

## Funcionalidades atuais
- autenticação por email/senha
- refresh automático de token
- setup e edição de perfil
- dashboard por papel
- criação de planos alimentares
- histórico de dietas
- checklist da dieta e lista de compras
- mensagens entre usuários
- notificações e lembretes
- relatório de adesão

## Observações importantes
- O fluxo de login com Google foi iniciado, mas ainda não está completamente concluído.
- A aplicação está integrada ao backend para grande parte do domínio principal do produto.
- Há validações e fluxo final que ainda precisam de refinamento em áreas de UX e testes automatizados.

## Status
O frontend está em estágio funcional avançado e já cobre as principais telas e fluxos do MVP, mas ainda faltam melhorias como:
- fechamento do login social
- testes automatizados
- paginação/virtualização de listas
- refinamento de erros e feedback visual

---

Consulte também `docs/frontend-current-status.md` e `docs/frontend-architecture.md`.

# Arquitetura do Frontend

## Visão geral

O frontend foi organizado como uma aplicação React com Vite para entregar uma interface rápida, modular e fácil de evoluir. A estrutura atual separa responsabilidade de navegação, páginas e componentes reutilizáveis, mantendo a camada visual simples e direta.

Neste momento, a aplicação cobre as telas iniciais do produto:

- página inicial
- tela de login
- tela de cadastro

A navegação é feita com React Router e os formulários são tratados com React Hook Form.

## Tecnologias utilizadas

- React 19
- TypeScript
- Vite
- React Router DOM
- React Hook Form
- Tailwind CSS
- Lucide React
- Axios
- Zod

## Organização do projeto

A estrutura principal do frontend é esta:

```text
src/
├─ main.tsx
├─ App.tsx
├─ index.css
├─ App.css
├─ assets/
├─ components/
│  └─ Navbar.tsx
├─ pages/
│  ├─ Home.tsx
│  ├─ Login.tsx
│  └─ Register.tsx
└─ routes/
   └─ index.tsx
```

### Responsabilidades por camada

- `routes` centraliza as rotas da aplicação
- `pages` concentra as telas principais
- `components` reúne elementos reutilizáveis da interface
- `assets` guarda imagens e arquivos estáticos
- `main.tsx` inicializa a aplicação e injeta o `App`
- `App.tsx` apenas delega para o roteamento

## Fluxo da aplicação

A aplicação segue um fluxo simples:

1. `main.tsx` monta a aplicação no DOM.
2. `App.tsx` renderiza a camada de rotas.
3. `routes/index.tsx` define as páginas públicas.
4. Cada página monta sua interface com componentes locais e estilos utilitários.

## Decisões técnicas relevantes

- O uso do Vite reduz o custo de configuração e acelera o desenvolvimento local.
- A navegação foi separada em um módulo próprio para facilitar expansão futura.
- Os formulários usam React Hook Form para reduzir estado manual e preparar a integração com validação e backend.
- Tailwind CSS foi adotado para manter a UI consistente e permitir evolução visual sem criar muitos arquivos de estilo isolados.
- A página inicial e as telas de autenticação ainda estão em estágio inicial, com foco em estrutura e layout base.

## Banco de dados

Esta camada não possui banco de dados próprio.

O frontend consome ou consumirá os dados expostos pelo backend, mas não mantém persistência local de negócio. Por isso, não há modelagem de tabelas neste repositório.

## Instruções de instalação

Dentro da pasta `frontend`:

```bash
npm install
```

Isso instala todas as dependências necessárias para desenvolvimento e build.

## Instruções de execução

Para iniciar o ambiente de desenvolvimento:

```bash
npm run dev
```

Para gerar a versão de produção:

```bash
npm run build
```

Para validar a qualidade do código com ESLint:

```bash
npm run lint
```

Para pré-visualizar a build de produção:

```bash
npm run preview
```

## Evidências de testes

Como o frontend está em fase inicial, as validações mais relevantes aqui são de construção e lint.

Fluxos que devem ser verificados durante a avaliação:

- carregamento da aplicação via Vite
- navegação entre as rotas `/`, `/login` e `/register`
- renderização da navbar na página inicial
- envio dos formulários de login e cadastro sem erro de runtime
- geração bem-sucedida da build de produção
- execução do lint sem falhas críticas

## Estado atual

O frontend já possui uma base funcional de navegação e telas públicas iniciais, mas ainda não está integrado ao backend para autenticação real, persistência de dados ou consumo de APIs.

## Próximo passo natural

A evolução mais direta é conectar os formulários e páginas às rotas e serviços do backend, começando pelo fluxo de autenticação e depois pelas telas relacionadas ao domínio nutricional.
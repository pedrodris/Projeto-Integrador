# Current Status

## Resumo do estagio atual

O projeto ja possui fluxo funcional de:

- autenticacao
- validacao de sessao/token
- configuracao inicial de perfil do usuario
- leitura do perfil base
- leitura do perfil detalhado
- atualizacao do perfil base

Hoje o frontend e o backend ja conversam no onboarding atual.

## O que ja foi implementado

### Infraestrutura

- estrutura inicial do backend
- FastAPI rodando
- configuracao via `.env`
- integracao com Supabase
- health check

### Autenticacao e onboarding

- signup
- login
- validacao de token
- identificacao do usuario autenticado
- handoff automatico para sessao autenticada quando o signup retorna sessao

### Perfil

- setup inicial do perfil
- criacao do perfil base
- criacao do perfil especifico por papel
- leitura do perfil base
- leitura dos detalhes do perfil
- atualizacao do perfil base

## O que ja foi validado

Os fluxos abaixo ja foram exercitados manualmente:

- backend subindo corretamente
- `GET /api/v1/health/`
- `POST /api/v1/auth/signup`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`
- `POST /api/v1/profile/setup`
- `GET /api/v1/profile/me`
- `GET /api/v1/profile/me/details`
- `PATCH /api/v1/profile/me`
- signup pelo frontend
- login pelo frontend
- redirecionamento para setup quando o perfil esta ausente
- conclusao do setup inicial e entrada em `/app`

## Limites atuais

- o backend persiste email, senha, sessao e dados de perfil suportados pelo contrato atual
- o frontend ainda exibe alguns elementos de interface que nao representam funcionalidades completas
- `CPF` nao faz parte do contrato atual persistido no backend
- ainda nao existem testes automatizados para auth/profile

## O que ainda nao foi implementado

- `care_links`
- leitura de pacientes vinculados a um nutricionista
- leitura do nutricionista vinculado a um paciente
- mensagens entre usuarios
- dietas
- refeicoes
- itens de refeicao
- atualizacao detalhada de `nutritionist_profiles`
- atualizacao detalhada de `patient_profiles`
- regras mais refinadas de permissao/autorizacao

## Estado do projeto em uma frase

O projeto ja possui um onboarding funcional de autenticacao e setup inicial de perfil, e o proximo passo imediato e estabilizar esse fluxo antes de abrir novas areas do dominio.

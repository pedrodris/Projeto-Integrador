
---

## `docs/current-status.md`

```md
# Current Status

## Resumo do estágio atual

O backend já saiu da fase de infraestrutura pura e já possui fluxo funcional de:

- autenticação
- validação de sessão/token
- configuração de perfil do usuário
- leitura e atualização do perfil base
- leitura do perfil detalhado

Neste momento, o projeto já tem uma base funcional de identidade e perfil, pronta para a próxima fase de regras de negócio.

---

## O que já foi implementado

### Infraestrutura
- estrutura inicial do backend
- FastAPI rodando
- organização por camadas
- configuração via `.env`
- integração com Supabase
- documentação Swagger
- health check

### Autenticação
- signup
- login
- validação de token
- identificação do usuário autenticado

### Perfil
- setup inicial do perfil
- criação do perfil base
- criação do perfil específico por papel
- leitura do perfil base
- leitura dos detalhes do perfil
- atualização do perfil base

---

## O que já foi testado com sucesso

Os seguintes fluxos já foram validados manualmente:

- backend subindo corretamente
- `GET /api/v1/health/`
- `POST /api/v1/auth/signup`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`
- `POST /api/v1/profile/setup`
- `GET /api/v1/profile/me`
- `GET /api/v1/profile/me/details`
- `PATCH /api/v1/profile/me`

---

## O que o backend já é capaz de fazer hoje

Hoje o sistema já consegue:

1. criar um usuário no Supabase Auth
2. autenticar esse usuário
3. validar o token no backend
4. identificar o usuário autenticado
5. criar o perfil base do usuário
6. criar o perfil específico por papel (`patient` ou `nutritionist`)
7. consultar esses dados
8. atualizar os dados básicos do perfil

Em outras palavras, o backend já possui o fluxo inicial de identidade e perfil funcionando de ponta a ponta.

---

## O que ainda não foi implementado

As próximas áreas do domínio ainda não foram implementadas:

- vínculo entre nutricionista e paciente (`care_links`)
- leitura dos pacientes vinculados a um nutricionista
- leitura do nutricionista vinculado a um paciente
- mensagens entre usuários
- dietas
- refeições
- itens de refeição
- atualização detalhada de `nutritionist_profiles`
- atualização detalhada de `patient_profiles`
- regras mais refinadas de permissão/autorização

---

## Limites da implementação atual

Apesar do backend já possuir fluxo funcional de auth e perfil, ainda não estão prontas as regras principais do domínio nutricional.

Ou seja:

- já existe identidade
- já existe perfil
- ainda não existe a parte central de relacionamento e acompanhamento nutricional

---

## Próximo marco lógico

A próxima fase natural do backend é implementar o vínculo entre nutricionista e paciente usando `care_links`, porque esse é o próximo passo que transforma identidade/perfil em regra real de negócio.

Esse passo, porém, ainda não foi iniciado nesta etapa.

---

## Estado do projeto em uma frase

O backend já possui a fundação técnica e o fluxo inicial funcional de autenticação e perfil, e agora está pronto para começar a implementação das regras centrais do domínio nutricional.
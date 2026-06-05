# Arquitetura do Backend

## Visão geral

O backend foi organizado em camadas para separar responsabilidades e permitir que o projeto cresça sem virar um conjunto de arquivos misturados. A estrutura atual já cobre autenticação, validação de sessão e operações iniciais de perfil.

A arquitetura segue esta ideia:

- `routes` recebem e expõem as requisições HTTP
- `schemas` definem os contratos de entrada e saída
- `services` concentram a regra de negócio
- `core` centraliza configuração e integração com Supabase

## Tecnologias utilizadas

- FastAPI
- Python
- Pydantic
- Supabase
- Swagger / OpenAPI

## Organização do projeto

A estrutura principal do backend é esta:

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
```

### Responsabilidades por camada

- `main.py` inicializa a aplicação FastAPI e registra as rotas
- `core` concentra configuração e integração externa
- `api/routes` expõe os endpoints HTTP
- `api/deps.py` centraliza dependências e validações compartilhadas
- `schemas` define os contratos dos dados de entrada e saída
- `services` implementa a lógica de negócio relacionada ao perfil

## Fluxo da aplicação

A aplicação segue um fluxo simples:

1. `main.py` sobe a aplicação.
2. As rotas recebem a requisição HTTP.
3. As dependências validam autenticação e contexto do usuário.
4. Os schemas validam e estruturam os dados.
5. Os services executam a regra de negócio e falam com o Supabase.

## Decisões técnicas relevantes

- A separação por camadas foi adotada para manter o domínio organizado e reduzir acoplamento.
- O FastAPI foi escolhido por facilitar APIs tipadas, validação automática e documentação Swagger.
- O uso de schemas reduz inconsistências nos contratos entre frontend e backend.
- A integração com Supabase concentra autenticação e persistência fora da aplicação HTTP principal.
- A organização atual prepara o projeto para crescer em regras de negócio sem reestruturar tudo depois.

## Banco de dados

O backend não define o banco diretamente dentro deste repositório, mas atua sobre a estrutura gerenciada via Supabase.

Fluxos já presentes na aplicação:

- autenticação
- validação de sessão/token
- configuração de perfil do usuário
- leitura e atualização do perfil base
- leitura do perfil detalhado

Áreas ainda não implementadas:

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

## Instruções de instalação

Dentro da pasta `nutri-backend`:

```bash
pip install -r requirements.txt
```

## Instruções de execução

Para iniciar o backend em modo de desenvolvimento:

```bash
uvicorn app.main:app --reload
```

## Evidências de testes

Os fluxos já validados manualmente incluem:

- backend subindo corretamente
- `GET /api/v1/health/`
- `POST /api/v1/auth/signup`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`
- `POST /api/v1/profile/setup`
- `GET /api/v1/profile/me`
- `GET /api/v1/profile/me/details`
- `PATCH /api/v1/profile/me`

## Estado atual

O backend já saiu da fase de infraestrutura pura e possui fluxo funcional de autenticação e perfil, pronto para receber as próximas regras do domínio nutricional.

## Próximo passo natural

A próxima fase natural é implementar o vínculo entre nutricionista e paciente usando `care_links`, porque esse é o passo que transforma identidade e perfil em relacionamento operacional no sistema.
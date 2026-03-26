# Nutri Backend

Backend do MVP da plataforma de acompanhamento nutricional.

## Stack
- Python
- FastAPI
- Supabase

## Estrutura atual
- Configuração com `.env`
- Health check
- Base de autenticação com Supabase

## Como rodar

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
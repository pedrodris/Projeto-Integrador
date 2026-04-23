# Projeto-Integrador - Aplicativo Nutricionista

# Integrantes: 
- Eliza Freitas de Castro
- Guilherme Santana dos Santos
- João Vitor de Morais Alecrim
- Pedro Vinícius Rodrigues de Pereira Nunes
- Thiago Kenji Ikuta

# Descrição
Esse repositório consiste no desenvolvimento de um site com ferramentas auxiliadoras para nutricionistas e seus pacientes. Em sua versão final é previsto: a possibilidade de fazer login e cadastro no site; ter acesso a listas nutricionais e de compras; chat entre nutricionista e seus pacientes 1:1; sistema de notificações e lembrete;

# Instruções de Execução:

Frontend:
Em um terminal digite os seguintes comandos:
Set-Location .\frontend
npm install  
npm run dev

Backend: 
 Em um terminal digite os seguintes comandos:
 Set-Location .\nutri-backend
 python -m venv .venv
 .venv\Scripts\activate
 pip install -r requirements.txt
 python -m uvicorn app.main:app --reload




import uuid
from supabase import create_client, Client
from dotenv import load_dotenv
import os

# Carrega as configurações do .env
load_dotenv()

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(url, key)

def cadastrar_novo_usuario():
    print("\n--- 📝 Cadastro de Novo Usuário ---")
    
    # 1. Inputs do usuário
    email = input("Digite o e-mail: ")
    senha = input("Digite a senha (mínimo 6 caracteres): ")
    nome = input("Digite o nome completo: ")
    
    print("\nEscolha o cargo:")
    print("1 - Patient (Paciente)")
    print("2 - Nutritionist (Nutricionista)")
    opcao = input("Opção (1 ou 2): ")
    
    cargo = "patient" if opcao == "1" else "nutritionist"

    try:
        # 2. Criar o usuário no Auth (Gera o UUID automaticamente no banco)
        print(f"\n⏳ Criando conta para {email}...")
        auth_response = supabase.auth.sign_up({
            "email": email,
            "password": senha,
        })

        # O ID gerado pelo Supabase fica em auth_response.user.id
        user_id = auth_response.user.id
        print(f"✅ Usuário autenticado! UUID gerado: {user_id}")

        # 3. Inserir os dados complementares na tabela 'profiles'
        print(f"⏳ Salvando perfil na tabela profiles...")
        perfil_data = {
            "id": user_id,       # Usa o mesmo UUID do Auth
            "username": nome,
            "role": cargo        # 'patient' ou 'nutritionist'
        }

        supabase.table("profiles").insert(perfil_data).execute()
        print("✨ Tudo pronto! Usuário e Perfil criados com sucesso.")

    except Exception as e:
        print(f"\n❌ Erro durante o processo: {e}")
        print("Dica: Verifique se o e-mail já existe ou se a senha é muito curta.")

# Executar a função
if __name__ == "__main__":
    cadastrar_novo_usuario()
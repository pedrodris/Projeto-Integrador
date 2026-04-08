import { useForm } from "react-hook-form";
import { Apple } from "lucide-react";

type FormData = {
  email: string;
  password: string;
  remember: boolean;
};

export default function Login() {
  const { register, handleSubmit } = useForm<FormData>();

  function onSubmit(data: FormData) {
    console.log(data);
  }

  return (
    <div className="min-h-screen flex font-[Inter] bg-[#f5f5f5]">
      
      {/* Lado esquerdo */}
      <div className="w-[35%] bg-orange-500 hidden lg:block" />

      {/* Lado direito */}
      <div className="flex w-full lg:w-[65%] items-center justify-center px-6">
        
        <div className="w-full max-w-md">
          
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-10">
            <span className="text-4xl"></span>
            <h1 className="text-3xl font-bold text-gray-900">
              App Nutricionista
            </h1>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* Email */}
            <input
              type="text"
              placeholder="Email ou CPF"
              {...register("email")}
              className="w-full h-11 px-4 rounded-xl border border-gray-300 bg-white text-sm outline-none focus:ring-2 focus:ring-orange-400"
            />

            {/* Senha */}
            <input
              type="password"
              placeholder="Senha"
              {...register("password")}
              className="w-full h-11 px-4 rounded-xl border border-gray-300 bg-white text-sm outline-none focus:ring-2 focus:ring-orange-400"
            />

            {/* Opções */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600">
                <input type="checkbox" {...register("remember")} />
                Lembrar acesso
              </label>

              <a
                href="#"
                className="text-orange-500 hover:underline"
              >
                Esqueci minha senha
              </a>
            </div>

            {/* Botão */}
            <button
              type="submit"
              className="w-full h-11 rounded-xl bg-yellow-400 font-semibold text-gray-900 hover:bg-yellow-500 transition"
            >
              Entrar
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-gray-300" />
            <span className="text-sm text-gray-500 font-semibold">OU</span>
            <div className="flex-1 h-px bg-gray-300" />
          </div>

          {/* Social */}
          <div className="space-y-3">
            {/* Google */}
            <button className="w-full h-11 flex items-center justify-center gap-3 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 transition">
                <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-5 h-5"
                />
                <span className="text-sm font-medium text-gray-700">
                Entrar com Google
                </span>
            </button>

            {/* Apple */}
            <button className="w-full h-11 flex items-center justify-center gap-3 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 transition">
                <img
                    src="https://www.svgrepo.com/show/303110/apple-black-logo.svg"
                    alt="Apple"
                    className="w-5 h-5"
                />
                <span className="text-sm font-medium text-gray-700">
                    Entrar com Apple
                </span>
            </button>
                
          </div>

          {/* Cadastro */}
          <p className="text-center text-sm text-gray-600 mt-8">
            Não tem cadastro?{" "}
            <a href="/register" className="text-orange-500 hover:underline">
              Cadastre-se
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
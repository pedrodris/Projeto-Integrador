import { useForm } from "react-hook-form";

type FormData = {
  name: string;
  phone: string;
  cpf: string;
  email: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
};

export default function Register() {
  const { register, handleSubmit } = useForm<FormData>();

  function onSubmit(data: FormData) {
    console.log(data);
  }

  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* Lado esquerdo */}
      <div className="w-[35%] bg-orange-500 hidden lg:block" />

      {/* Lado direito */}
      <div className="flex w-full lg:w-[65%] items-center justify-center px-6">

        <div className="w-full max-w-md">

          <h1 className="text-2xl font-bold text-center mb-8">
            App Nutricionista
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            <input
              placeholder="Nome Completo"
              {...register("name")}
              className="input"
            />

            <div className="flex gap-3">
              <input
                placeholder="Telefone"
                {...register("phone")}
                className="input"
              />
              <input
                placeholder="CPF"
                {...register("cpf")}
                className="input"
              />
            </div>

            <input
              placeholder="Email"
              {...register("email")}
              className="input"
            />

            <input
              type="password"
              placeholder="Senha"
              {...register("password")}
              className="input"
            />

            <input
              type="password"
              placeholder="Confirmar Senha"
              {...register("confirmPassword")}
              className="input"
            />

            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input type="checkbox" {...register("terms")} />
              Li e concordo com os termos
            </label>

            <button className="w-full h-11 bg-yellow-400 rounded-xl font-semibold hover:bg-yellow-500">
              Continuar para os planos
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/Input";
import { useRouter } from "next/router";

export default function Login() {
  const { register, handleSubmit } = useForm();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    const res = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });
    
    if (res?.ok) {
      router.push("/dashboard");
    } else {
      alert("Login falhou! Verifique suas credenciais.");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex flex-col items-center justify-center px-4">
      <div className="bg-gray-800 rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-4xl font-bold mb-6 text-center">Login</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input 
            label="Email" 
            type="email" 
            {...register("email")} 
            required 
          />
          <Input 
            label="Senha" 
            type="password" 
            {...register("password")} 
            required 
          />
          <button
            type="submit"
            disabled={isLoading}
            className={`mt-4 w-full text-white font-semibold p-3 rounded transition ${
              isLoading
                ? "bg-green-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        {/* Link para registro */}
        <div className="mt-6 text-center">
          <p className="text-gray-300">
            Não tem uma conta?{" "}
            <span
              onClick={() => router.push("/register")}
              className="text-green-400 hover:text-green-300 cursor-pointer underline transition-colors"
            >
              Clique aqui para registrar
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
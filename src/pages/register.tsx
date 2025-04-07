import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/Input";
import { createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/router";
import { collection, addDoc } from "firebase/firestore";

const schema = z
  .object({
    email: z.string().email("E-mail inválido"),
    password: z.string().min(6, "A senha precisa ter no mínimo 6 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não conferem",
    path: ["confirmPassword"],
  });

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) router.push("/dashboard");
    });
    return unsubscribe;
  }, [router]);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      await addDoc(collection(db, "users"), {
        uid: userCredential.user.uid,
        email: data.email,
      });

    } catch (err: any) {
      if (err.code === "auth/email-already-in-use") {
        alert("Este e-mail já está em uso.");
      } else {
        console.error("Erro ao registrar:", err);
        alert("Erro ao registrar: " + err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex flex-col items-center justify-center px-4">
      <div className="bg-gray-800 rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-4xl font-bold mb-6 text-center">Crie sua Conta</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input label="E-mail" type="email" {...register("email")} />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          <div>
            <Input label="Senha" type="password" {...register("password")} />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>

          <div>
            <Input label="Confirmar Senha" type="password" {...register("confirmPassword")} />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`mt-4 w-full font-semibold p-3 rounded transition ${
              isLoading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {isLoading ? "Registrando..." : "Registrar"}
          </button>
        </form>

        {/* Link para login */}
        <div className="mt-6 text-center">
          <p className="text-gray-300">
            Já tem uma conta?{" "}
            <span
              onClick={() => router.push("/login")}
              className="text-blue-400 hover:text-blue-300 cursor-pointer underline transition-colors"
            >
              Clique aqui para entrar
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { auth } from "@/lib/firebase";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  const handleLogout = async () => {
    await auth.signOut();
    await signOut({ redirect: false });
    router.push("/login");
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-black">
        Carregando...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex flex-col items-center justify-center px-4">
      <div className="bg-gray-800 rounded-lg shadow-lg p-8 w-full max-w-md text-center">
        <h1 className="text-4xl font-bold mb-4">
          Bem-vindo,
        </h1>
        <h1 className="text-2xl font-bold mb-4">
          {session?.user?.email || "usuário"}!
        </h1>
        <p className="mb-6 text-gray-300 px-4">
          Você está logado com sucesso.
        </p>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 px-8 py-3 rounded-lg text-lg transition w-full md:w-auto"
        >
          Sair
        </button>
      </div>
    </div>
  );
}
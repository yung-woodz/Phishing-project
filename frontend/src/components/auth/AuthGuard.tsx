"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // 🔐 Solo redirige si ya cargó y no está autenticado
    if (!isLoading && !isAuthenticated) {
      router.replace("/signin");
    }
  }, [isAuthenticated, isLoading, router]);

  // Mientras carga, puedes retornar un loader (o null)
  if (isLoading) {
    return <div className="text-center py-10">Cargando sesión...</div>;
  }

  return <>{children}</>;
}

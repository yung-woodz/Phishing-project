"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { logout as logoutService } from "@/service/auth.service";
import Cookies from "js-cookie";

interface DecodedUser {
  nombreCompleto: string;
  email: string;
  rut: string;
  rol: string;
}

interface AuthContextType {
  user: DecodedUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => Promise<void>;
  setUser: (user: DecodedUser | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<DecodedUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser =
      localStorage.getItem("administrador") || localStorage.getItem("usuario");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error al parsear usuario:", error);
        setUser(null);
      }
    }

    setIsLoading(false);
  }, []);

  const logout = async () => {
    try {
      await logoutService();
    } catch (e) {
      console.warn("Error cerrando sesión en backend:", e);
    }

    localStorage.removeItem("usuario");
    localStorage.removeItem("administrador");
    Cookies.remove("jwt-auth");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

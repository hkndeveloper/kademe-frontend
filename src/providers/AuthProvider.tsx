"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import Cookies from "js-cookie";
import { User, Role } from "@/lib/permissions";
import api from "@/lib/api";

// import { setCookie, removeCookie } from "@/lib/auth-utils"; // Removing old helper usage

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string, roles: Role[], user: any) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const logout = useCallback(() => {
    localStorage.removeItem("kademe_token");
    localStorage.removeItem("user_data");
    localStorage.removeItem("user_roles");
    Cookies.remove("kademe_token");
    Cookies.remove("user_roles");
    setUser(null);
    router.push("/login");
  }, [router]);

  const login = (token: string, roles: Role[], userData: any) => {
    localStorage.setItem("kademe_token", token);
    localStorage.setItem("user_roles", JSON.stringify(roles));
    localStorage.setItem("user_data", JSON.stringify({ ...userData, roles }));
    Cookies.set("kademe_token", token, { expires: 7, sameSite: "lax" });
    Cookies.set("user_roles", JSON.stringify(roles), { expires: 7, sameSite: "lax" });
    setUser({ ...userData, roles });
  };

  useEffect(() => {
    const initAuth = () => {
      try {
        const token = localStorage.getItem("kademe_token");
        const savedUser = localStorage.getItem("user_data");

        if (token && savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const hasRole = (role: Role) => {
    return (user?.roles && Array.isArray(user.roles)) ? user.roles.includes(role) : false;
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

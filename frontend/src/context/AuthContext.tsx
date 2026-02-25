"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import { clearTokens } from "@/lib/auth";

type User = {
  id: number;
  username: string;
  email: string;
  role: string;
  first_name: string;
  last_name: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (access: string, refresh: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchProfile = async () => {
    try {
      const res = await api.get("auth/profile/");
      setUser(res.data);
    } catch (err) {
      clearTokens();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const access = localStorage.getItem("access");
    if (access) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (access: string, refresh: string) => {
    localStorage.setItem("access", access);
    localStorage.setItem("refresh", refresh);
    await fetchProfile();
    router.push("/dashboard");
  };

  const logout = () => {
    clearTokens();
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

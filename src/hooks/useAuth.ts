"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";

type Role = "teacher" | "parent" | "admin" | "student" | "superAdmin";

interface User {
  userId: string;
  email: string;
  role: Role;
}

interface AuthContext {
  user: User | null;
  accessToken: string | null;
  role: Role | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

export function useAuth(): AuthContext {
  const [user, setUser] = useState<User | null >(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const router = useRouter();
  // --- LOGIN ---
  const login = useCallback(async (email: string, password: string) => {
   
    console.log({email, password});
    if (accessToken) {
      console.log("Already logged in, skipping new session");
    return;
    };
    
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error("Login failed");
    const data = await res.json();
    if (data){
      console.log(data);
      setAccessToken(data.accessToken);
      setRole("teacher");
      setUser({ userId: data.userId, email: email, role: data.role });
    }
  
    if (data.role) {
      console.log("role:", role);
      // router.push(`/${data.role}`);
    }

  }, [accessToken, router,role]);

  // --- LOGOUT ---
  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setAccessToken(null);
    setRole(null);
    setUser(null);
  }, []);

  // --- REFRESH ---
  const refresh = useCallback(async () => {
    const res = await fetch("/api/auth/refresh", { method: "POST" });
    if (!res.ok) {
      logout();
      return;
    }
    const data = await res.json();
    setAccessToken(data.accessToken);
  }, [logout]);

  // --- AUTO REFRESH ---
  useEffect(() => {
    if (!accessToken) return;

    const payload = JSON.parse(atob(accessToken.split(".")[1]));
    const exp = payload.exp * 1000;
    const delay = exp - Date.now() - 5000; // refresh 5s before expiry

    const timer = setTimeout(() => {
      refresh();
    }, delay);

    return () => clearTimeout(timer);
  }, [accessToken, refresh]);

  return { user, accessToken, role, login, logout, refresh };
}

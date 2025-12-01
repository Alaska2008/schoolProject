"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthContextType , User, Role } from "@/types/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const router = useRouter();

  // --- LOGIN ---
  const login = useCallback(async (email: string, password: string) => {
    if (accessToken) {
      console.log("Already logged in, skipping new session");
      console.log("Role: ", role);
      console.log("User: ", user);
      console.log("AccessToken: ", accessToken);
      return;
    }
    if (!accessToken){console.log("Not logged in, Creating a session");}
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) throw new Error("Login failed");
    const data = await res.json();

    if (data) {
        setAccessToken(data.accessToken);
        setRole(data.role as Role);
        setUser({ userId: data.userId, email, role: data.role as Role });
        // persist
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("role", data.role);
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("email", email);

        console.log("role: ", role);
        console.log("accessToken: ", accessToken);
        console.log("User: ", user);
    }

    if (data.role) {
      router.push(`/${data.role}`);
    }
  }, [accessToken, router]);

  // --- LOGOUT ---
  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setAccessToken(null);
    setRole(null);
    setUser(null);
    router.push("/login");
  }, [router]);

  // --- REFRESH ---
  const refresh = useCallback(async () => {
    const res = await fetch("/api/auth/refresh", { method: "POST" });
    if (!res.ok) throw new Error("Refresh failed");
    const data = await res.json();
    setAccessToken(data.accessToken);
    localStorage.setItem("accessToken", data.accessToken);
  }, []);

    // --- HYDRATE USER ON MOUNT ---
    //   useEffect(() => {
    //     const hydrate = async () => {
    //       try {
    //         const res = await fetch("/api/auth/me");
    //         if (res.ok) {
    //           const data = await res.json();
    //           setUser({ userId: data.user.userId, email: data.user.email, role: data.user.role });
    //           setRole(data.user.role as Role);
    //         }
    //       } catch (err) {
    //         console.error("Failed to hydrate user:", err);
    //       }
    //     };
    //     hydrate();
    //   }, []);

    useEffect(() => {
        // Hydrate from localStorage
        const storedRole = localStorage.getItem("role") as Role | null;
        const storedUserId = localStorage.getItem("userId");
        const storedAccessToken = localStorage.getItem("accessToken");
        const storedEmail = localStorage.getItem("email");
        if (storedRole && storedUserId && storedAccessToken) {
            console.log(storedRole , storedUserId , storedAccessToken)
            setRole(storedRole);
            setAccessToken(storedAccessToken);
            setUser({ userId: storedUserId, email: storedEmail as string, role: storedRole });
        }
        // Confirm with server
        const hydrate = async () => {
          const res = await fetch("/api/auth/me");
          if (res.ok) {
            const data = await res.json();
            console.log("data from me:", data)
            setUser({ userId: data.userId, email: data.email, role: data.role });
            setRole(data.role as Role);
            // setAccessToken(data.accessToken);
            localStorage.setItem("role", data.role);
            localStorage.setItem("userId", data.userId);
            localStorage.setItem("email", data.email);

          }
        };
        // hydrate();
    }, []);


  return (
    <AuthContext.Provider value={{ user,  accessToken, role, login, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to consume context
export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};

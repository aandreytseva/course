import { createContext, useContext, useState, ReactNode } from "react";

export type Role = "STUDENT" | "TEACHER";

export interface AuthUser {
  username: string;
  role: Role;
  token: string;
}

interface AuthCtx {
  user: AuthUser | null;
  login: (user: AuthUser) => void;
  logout: () => void;
  isTeacher: boolean;
}

const Ctx = createContext<AuthCtx | null>(null);

const STORAGE_KEY = "edutrack_auth";

function load(): AuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(load);

  const login = (u: AuthUser) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    setUser(u);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  return (
    <Ctx.Provider value={{ user, login, logout, isTeacher: user?.role === "TEACHER" }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth(): AuthCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

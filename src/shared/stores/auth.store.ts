import type { User } from "@/domain/types";
import { useRouter } from "next/navigation";
import { create } from "zustand";

interface AuthStore {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
  hasRole: (role: string) => boolean;
  hasDepartment: (department: string) => boolean;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  user: typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || "null") : null,
  isAuthenticated: typeof window !== "undefined" ? !!localStorage.getItem("token") : false,
  isInitialized: typeof window !== "undefined",

  setAuth: (token: string, user: User) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    }
    set({ token, user, isAuthenticated: true, isInitialized: true });
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    set({ token: null, user: null, isAuthenticated: false, isInitialized: true });
  },

  hasRole: (role: string) => {
    const { user } = get();
    return user?.role === role;
  },

  hasDepartment: (department: string) => {
    const { user } = get();
    return user?.department === department;
  },
}));

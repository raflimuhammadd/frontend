import { AuthService } from "@/application/services/auth.service";
import type { User } from "@/domain/types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const authService = new AuthService();

interface AuthStore {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  hasHydrated: boolean;
  setAuth: (token: string, user: User) => void;
  logout: () => Promise<void>;
  hasRole: (role: string) => boolean;
  hasDepartment: (department: string) => boolean;
}

const storage = createJSONStorage(() => localStorage);

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      hasHydrated: false,
      
      setAuth: (token: string, user: User) => {
        set({ 
          token, 
          user, 
          isAuthenticated: true,
          hasHydrated: true 
        });
      },
      
      logout: async () => {
        await authService.logout();
        set({ 
          token: null, 
          user: null, 
          isAuthenticated: false,
          hasHydrated: true 
        });
        if (typeof window !== "undefined") {
          localStorage.removeItem("auth-storage");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/login";
        }
      },
      
      hasRole: (role: string) => get().user?.role === role,
      hasDepartment: (department: string) => get().user?.department === department,
    }),
    {
      name: "auth-storage",
      storage,
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.hasHydrated = true;
        }
      },
    }
  )
);
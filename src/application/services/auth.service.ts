import type { AuthResponse } from "@/domain/types";
import { apiClient } from "@/infrastructure/api/client";

export class AuthService {
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await apiClient.post("/auth/login", {
      email,
      password,
    });
    return response.data;
  }

  async getCurrentUser(): Promise<any> {
    const response = await apiClient.get("/auth/me");
    return response.data.data;
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post("/auth/logout");
    } catch (error) {
      console.error("Logout API call failed:", error);
    }
  }
}

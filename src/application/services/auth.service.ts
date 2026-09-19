import { apiClient } from '@/infrastructure/api/client'
import type { AuthResponse, User } from '@/domain/types'

export class AuthService {
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', {
      email,
      password,
    })
    return response.data.data || response.data
  }

  async register(data: {
    email: string
    password: string
    firstName: string
    lastName: string
    role: string
    department: string
  }): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', data)
    return response.data.data || response.data
  }

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>('/auth/me')
    return response.data.data || response.data
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  }
}

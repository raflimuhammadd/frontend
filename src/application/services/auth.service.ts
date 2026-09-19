import { apiClient } from '@/infrastructure/api/client'
import type { AuthResponse } from '@/domain/types'

export class AuthService {
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/login', {
      email,
      password,
    })
    return response.data
  }

  async getCurrentUser(): Promise<any> {
    const response = await apiClient.get('/auth/me')
    return response.data.data
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  }
}

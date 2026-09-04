import { apiClient } from '@core/api/api-client'
import type { LoginRequest, LoginResponse } from '@core/auth/auth.types'

const AUTH_ENDPOINT = '/auth'

export class AuthService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginRequest, LoginResponse>(
      `${AUTH_ENDPOINT}/login`,
      credentials,
    )
    return response.data
  }
}

export const authService = new AuthService()

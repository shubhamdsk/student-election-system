import { authSessionStorage } from '@core/auth/auth-session.storage'
import { environment } from '@core/config/environment'
import { AUTH_SESSION_EXPIRED_EVENT } from '@core/constants/auth.constants'
import type { ApiResponse, ValidationErrorData } from '@core/types/api'
import { ApiError } from './ApiError'

type RequestOptions = Omit<RequestInit, 'body'> & { body?: unknown }

function getValidationErrors(data: unknown) {
  if (!data || typeof data !== 'object' || !('errors' in data)) return undefined
  return (data as ValidationErrorData).errors
}

async function parseEnvelope<T>(response: Response): Promise<ApiResponse<T>> {
  let envelope: ApiResponse<T>
  try {
    envelope = (await response.json()) as ApiResponse<T>
  } catch {
    throw new ApiError('The server returned an invalid response.', response.status)
  }

  if (!response.ok || !envelope.success) {
    if (response.status === 401) {
      authSessionStorage.clearSession()
      window.dispatchEvent(new Event(AUTH_SESSION_EXPIRED_EVENT))
    }
    throw new ApiError(
      envelope.message || 'Request failed.',
      response.status,
      getValidationErrors(envelope.data),
    )
  }

  return envelope
}

async function request<T>(path: string, options: RequestOptions = {}) {
  const token = authSessionStorage.getToken()
  const headers = new Headers(options.headers)
  headers.set('Accept', 'application/json')
  if (options.body !== undefined) headers.set('Content-Type', 'application/json')
  if (token) headers.set('Authorization', `Bearer ${token}`)

  let response: Response
  try {
    response = await fetch(`${environment.apiBaseUrl}${path}`, {
      ...options,
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
    })
  } catch {
    throw new ApiError('Unable to connect to the server.', 0)
  }
  return parseEnvelope<T>(response)
}

export const apiClient = {
  get<TResponse>(path: string, options?: RequestOptions) {
    return request<TResponse>(path, { ...options, method: 'GET' })
  },
  post<TRequest, TResponse>(path: string, body: TRequest, options?: RequestOptions) {
    return request<TResponse>(path, { ...options, method: 'POST', body })
  },
  put<TRequest, TResponse>(path: string, body: TRequest, options?: RequestOptions) {
    return request<TResponse>(path, { ...options, method: 'PUT', body })
  },
  patch<TRequest, TResponse>(path: string, body: TRequest, options?: RequestOptions) {
    return request<TResponse>(path, { ...options, method: 'PATCH', body })
  },
  delete<TResponse>(path: string, options?: RequestOptions) {
    return request<TResponse>(path, { ...options, method: 'DELETE' })
  },
}

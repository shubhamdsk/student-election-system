const DEFAULT_API_BASE_URL = '/api'
const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim()
const apiBaseUrl = configuredApiBaseUrl || DEFAULT_API_BASE_URL

export const environment = {
  apiBaseUrl: apiBaseUrl.replace(/\/$/, ''),
} as const

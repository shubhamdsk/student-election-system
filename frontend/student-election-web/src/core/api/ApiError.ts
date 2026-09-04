import type { ValidationErrors } from '@core/types/api'

export class ApiError extends Error {
  readonly status: number
  readonly validationErrors?: ValidationErrors

  constructor(
    message: string,
    status: number,
    validationErrors?: ValidationErrors,
  ) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.validationErrors = validationErrors
  }

  get isUnauthorized(): boolean {
    return this.status === 401
  }

  get isForbidden(): boolean {
    return this.status === 403
  }
}

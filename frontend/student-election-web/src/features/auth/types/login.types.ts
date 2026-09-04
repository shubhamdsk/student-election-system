import type { LoginRequest } from '@core/auth/auth.types'
import type { FieldErrors } from '@core/utils/form-errors'

export type LoginField = keyof LoginRequest

export interface LoginLocationState {
  from?: string
}

export interface LoginFormProps {
  isSubmitting: boolean
  fieldErrors: FieldErrors<LoginField>
  onSubmit(credentials: LoginRequest): Promise<void>
}

import { useState, type FormEvent } from 'react'
import type { FieldErrors } from '@core/utils/form-errors'
import { FormField } from '@shared/components/FormField/FormField'
import { LoadingSpinner } from '@shared/components/LoadingSpinner/LoadingSpinner'
import { PasswordInput } from '@shared/components/PasswordInput/PasswordInput'
import type { LoginField, LoginFormProps } from '../../types/login.types'
import './LoginForm.scss'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function LoginForm({ isSubmitting, fieldErrors, onSubmit }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [localErrors, setLocalErrors] = useState<FieldErrors<LoginField>>({})
  const errors = { ...fieldErrors, ...localErrors }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isSubmitting) return

    const trimmedEmail = email.trim()
    const nextErrors: FieldErrors<LoginField> = {}
    if (!trimmedEmail) nextErrors.email = 'Email is required.'
    else if (!EMAIL_PATTERN.test(trimmedEmail)) nextErrors.email = 'Enter a valid email address.'
    if (!password) nextErrors.password = 'Password is required.'
    setLocalErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    await onSubmit({ email: trimmedEmail, password })
  }

  return (
    <form className="login-form" onSubmit={handleSubmit} noValidate>
      <FormField id="login-email" label="Email" name="email" type="email" autoComplete="email" value={email} onChange={(event) => { setEmail(event.target.value); setLocalErrors((current) => ({ ...current, email: undefined })) }} error={errors.email} disabled={isSubmitting} required />
      <PasswordInput id="login-password" label="Password" name="password" autoComplete="current-password" value={password} onChange={(event) => { setPassword(event.target.value); setLocalErrors((current) => ({ ...current, password: undefined })) }} error={errors.password} disabled={isSubmitting} required />
      <button className="login-form__submit" type="submit" disabled={isSubmitting}>
        {isSubmitting ? <LoadingSpinner label="Signing in" /> : 'Sign in'}
      </button>
    </form>
  )
}

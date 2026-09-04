import { useState, type FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { ApiError } from '@core/api/ApiError'
import { useAuth } from '@core/hooks/useAuth'
import { LoadingSpinner } from '@shared/components/LoadingSpinner/LoadingSpinner'
import './LoginPage.scss'

interface LoginLocationState { from?: string }

export function LoginPage() {
  const { isAuthenticated, role, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (isAuthenticated) return <Navigate to={role === 'Admin' ? '/admin' : '/student'} replace />

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmedEmail = email.trim()
    if (!trimmedEmail || !password) {
      setErrorMessage('Email and password are required.')
      return
    }
    setIsSubmitting(true)
    setErrorMessage('')
    try {
      const user = await login({ email: trimmedEmail, password })
      const requestedPath = (location.state as LoginLocationState | null)?.from
      const roleHome = user.role === 'Admin' ? '/admin' : '/student'
      const targetPath = requestedPath?.startsWith(`/${user.role.toLowerCase()}`)
        ? requestedPath
        : roleHome
      navigate(targetPath, { replace: true })
    } catch (error: unknown) {
      setErrorMessage(error instanceof ApiError ? error.message : 'Unable to connect to the server.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="login-page">
      <h1 className="login-page__title">Sign in</h1>
      <form className="login-page__form" onSubmit={handleSubmit} noValidate>
        <div className="login-page__field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} disabled={isSubmitting} />
        </div>
        <div className="login-page__field">
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} disabled={isSubmitting} />
        </div>
        {errorMessage && <p className="login-page__error" role="alert">{errorMessage}</p>}
        <button className="login-page__submit" type="submit" disabled={isSubmitting}>
          {isSubmitting ? <LoadingSpinner label="Signing in" /> : 'Sign in'}
        </button>
      </form>
    </section>
  )
}

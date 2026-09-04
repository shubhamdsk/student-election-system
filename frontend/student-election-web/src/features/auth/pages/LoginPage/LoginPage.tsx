import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '@core/hooks/useAuth'
import { LoginForm } from '../../components/LoginForm/LoginForm'
import { useLogin } from '../../hooks/useLogin'
import './LoginPage.scss'

export function LoginPage() {
  const { isAuthenticated, role } = useAuth()
  const login = useLogin()

  if (isAuthenticated) return <Navigate to={role === 'Admin' ? '/admin' : '/student'} replace />

  return (
    <section className="login-page">
      <div className="login-page__card">
        <p className="login-page__eyebrow">Welcome back</p>
        <h1 className="login-page__title">Sign in to your account</h1>
        <p className="login-page__intro">Access your Student Election System portal.</p>
        <LoginForm {...login} onSubmit={login.submit} />
        <p className="login-page__footer">New student? <Link to="/register">Create an account</Link></p>
      </div>
    </section>
  )
}

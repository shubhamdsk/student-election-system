import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '@core/hooks/useAuth'
import { RegistrationForm } from '../../components/RegistrationForm/RegistrationForm'
import { useStudentRegistration } from '../../hooks/useStudentRegistration'
import './RegistrationPage.scss'

export function RegistrationPage() {
  const { isAuthenticated, role } = useAuth()
  const registrationState = useStudentRegistration()

  if (isAuthenticated) return <Navigate to={role === 'Admin' ? '/admin' : '/student'} replace />

  if (registrationState.registration) {
    return (
      <section className="registration-page registration-page--success" role="status">
        <div className="registration-page__card">
          <p className="registration-page__eyebrow">Registration submitted</p>
          <h1 className="registration-page__title">Your account is pending approval</h1>
          <p>An administrator must approve your student account before you receive full access.</p>
          <Link className="registration-page__action" to="/login">Go to login</Link>
        </div>
      </section>
    )
  }

  return (
    <section className="registration-page">
      <div className="registration-page__card">
        <p className="registration-page__eyebrow">Student registration</p>
        <h1 className="registration-page__title">Create your account</h1>
        <p className="registration-page__intro">Submit your details for administrator approval.</p>
        <RegistrationForm {...registrationState} onSubmit={registrationState.submit} />
        <p className="registration-page__footer">Already registered? <Link to="/login">Sign in</Link></p>
      </div>
    </section>
  )
}

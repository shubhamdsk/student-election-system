import { Link, Outlet } from 'react-router-dom'
import { useAuth } from '@core/hooks/useAuth'
import './PublicLayout.scss'

export function PublicLayout() {
  const { isAuthenticated, role } = useAuth()
  const portalPath = role === 'Admin' ? '/admin' : '/student'

  return (
    <div className="public-layout">
      <header className="public-layout__header">
        <Link className="public-layout__brand" to="/">Student Election System</Link>
        <nav className="public-layout__nav" aria-label="Public navigation">
          <Link to="/">Home</Link>
          {isAuthenticated ? (
            <Link to={portalPath}>Go to portal</Link>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
      </header>
      <main className="public-layout__content"><Outlet /></main>
    </div>
  )
}

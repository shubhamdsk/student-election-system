// src/app/layouts/PublicLayout/PublicLayout.tsx
import { Link, Outlet } from 'react-router-dom'
import { useAuth } from '@core/hooks/useAuth'
import './PublicLayout.scss'

export function PublicLayout() {
  const { isAuthenticated, role } = useAuth()
  const portalPath = role === 'Admin' ? '/admin' : '/student'

  return (
    <div className="public-layout">
      <header className="public-layout__header">
        <Link className="public-layout__brand" to="/">
          <div className="public-layout__logo-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 12 2 2 4-4"/>
              <path d="M5 7c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v12H5V7Z"/>
              <path d="M22 19H2"/>
            </svg>
          </div>
          <span className="public-layout__brand-name">
            Student<span className="gradient-text">Election</span>
          </span>
        </Link>
        <nav className="public-layout__nav" aria-label="Public navigation">
          <Link className="nav-link" to="/">Home</Link>
          {isAuthenticated ? (
            <Link className="nav-btn nav-btn--primary" to={portalPath}>
              Go to portal &rarr;
            </Link>
          ) : (
            <>
              <Link className="nav-link" to="/login">Login</Link>
              <Link className="nav-btn nav-btn--primary" to="/register">
                Register
              </Link>
            </>
          )}
        </nav>
      </header>
      <main className="public-layout__content">
        <Outlet />
      </main>
    </div>
  )
}

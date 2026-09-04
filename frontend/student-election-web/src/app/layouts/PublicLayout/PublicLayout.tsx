import { Link, Outlet } from 'react-router-dom'
import './PublicLayout.scss'

export function PublicLayout() {
  return (
    <div className="public-layout">
      <header className="public-layout__header">
        <Link className="public-layout__brand" to="/">Student Election System</Link>
        <nav className="public-layout__nav" aria-label="Public navigation">
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </nav>
      </header>
      <main className="public-layout__content"><Outlet /></main>
    </div>
  )
}

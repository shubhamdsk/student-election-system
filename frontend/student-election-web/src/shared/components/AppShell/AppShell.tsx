import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '@core/hooks/useAuth'
import type { AppShellProps } from '@shared/types/component.types'
import { NotificationBell } from '@features/notifications'
import './AppShell.scss'

export function AppShell({ title, navigationItems, isWideContent = false }: AppShellProps) {
  const { logout, role } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="app-shell">
      <header className="app-shell__header">
        <h1 className="app-shell__title">{title}</h1>
        <div className="app-shell__header-actions">{role && <NotificationBell role={role} />}<button className="app-shell__logout" type="button" onClick={handleLogout} aria-label="Logout from current session">Logout</button></div>
      </header>
      <nav className="app-shell__nav" aria-label={`${title} navigation`}>
        {navigationItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/student' || item.to === '/admin'}
            className={({ isActive }) => (isActive ? 'app-shell__nav-link app-shell__nav-link--active' : 'app-shell__nav-link')}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
      <main className={`app-shell__content${isWideContent ? ' app-shell__content--wide' : ''}`}><Outlet /></main>
    </div>
  )
}

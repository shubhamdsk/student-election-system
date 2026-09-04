import type { ReactNode } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '@core/hooks/useAuth'
import './AppShell.scss'

interface NavigationItem { label: string; to: string }
interface AppShellProps { title: string; navigationItems: NavigationItem[]; children?: ReactNode }

export function AppShell({ title, navigationItems }: AppShellProps) {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="app-shell">
      <header className="app-shell__header">
        <h1 className="app-shell__title">{title}</h1>
        <button className="app-shell__logout" type="button" onClick={handleLogout}>Logout</button>
      </header>
      <nav className="app-shell__nav" aria-label={`${title} navigation`}>
        {navigationItems.map((item) => <NavLink key={item.to} to={item.to} end>{item.label}</NavLink>)}
      </nav>
      <main className="app-shell__content"><Outlet /></main>
    </div>
  )
}

import { useEffect, useRef, useState } from 'react'
import { useUnreadNotificationCount } from '../../hooks/useUnreadNotificationCount'
import type { NotificationBellProps } from '../../types'
import { NotificationPanel } from '../NotificationPanel/NotificationPanel'
import { BellIcon } from './BellIcon'
import './NotificationBell.scss'

export function NotificationBell({ role }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const { data } = useUnreadNotificationCount()
  const count = data?.count ?? 0

  useEffect(() => {
    if (!isOpen) return
    const handlePointerDown = (event: PointerEvent) => { if (event.target instanceof Node && !containerRef.current?.contains(event.target)) setIsOpen(false) }
    const handleEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setIsOpen(false) }
    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleEscape)
    return () => { document.removeEventListener('pointerdown', handlePointerDown); document.removeEventListener('keydown', handleEscape) }
  }, [isOpen])

  return <div className="notification-bell" ref={containerRef}>
    <button className="notification-bell__trigger" type="button" aria-label={`Notifications${count ? `, ${count} unread` : ''}`} aria-expanded={isOpen} aria-haspopup="dialog" onClick={() => setIsOpen((current) => !current)}>
      <BellIcon />
      {count > 0 && <span className="notification-bell__badge" aria-hidden="true">{count > 99 ? '99+' : count}</span>}
    </button>
    {isOpen && <NotificationPanel role={role} onClose={() => setIsOpen(false)} />}
  </div>
}

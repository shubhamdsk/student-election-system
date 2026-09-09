import { useNavigate } from 'react-router-dom'
import { LoadingSpinner } from '@shared/components/LoadingSpinner/LoadingSpinner'
import { useNotifications } from '../../hooks/useNotifications'
import { useMarkNotificationRead } from '../../hooks/useMarkNotificationRead'
import { useMarkAllNotificationsRead } from '../../hooks/useMarkAllNotificationsRead'
import { getNotificationPath } from '../../utils/notification-navigation'
import type { Notification, NotificationPanelProps } from '../../types'
import { NotificationEmptyState } from '../NotificationEmptyState/NotificationEmptyState'
import { NotificationItem } from '../NotificationItem/NotificationItem'
import './NotificationPanel.scss'

export function NotificationPanel({ role, onClose }: NotificationPanelProps) {
  const navigate = useNavigate(); const query = useNotifications(); const markRead = useMarkNotificationRead(); const markAll = useMarkAllNotificationsRead()
  const notifications = query.data?.items ?? []; const hasUnread = notifications.some((notification) => !notification.isRead)
  const handleSelect = (notification: Notification) => { if (!notification.isRead) markRead.mutate(notification.id); onClose(); navigate(getNotificationPath(notification, role)) }
  return <section className="notification-panel" role="dialog" aria-modal="false" aria-labelledby="notification-panel-title">
    <header className="notification-panel__header"><h2 id="notification-panel-title">Notifications</h2><button type="button" disabled={!hasUnread || markAll.isPending} onClick={() => markAll.mutate()}>Mark all as read</button></header>
    <div className="notification-panel__content">
      {query.isLoading ? <LoadingSpinner label="Loading notifications…" /> : query.isError || notifications.length === 0 ? <NotificationEmptyState isError={query.isError} onRetry={() => void query.refetch()} /> : <ul className="notification-panel__list">{notifications.map((notification) => <NotificationItem key={notification.id} notification={notification} role={role} onSelect={handleSelect} />)}</ul>}
    </div>
  </section>
}

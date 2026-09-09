import { formatUtcDateTime } from '@core/utils/date'
import type { NotificationItemProps } from '../../types'
export function NotificationItem({ notification, onSelect }: NotificationItemProps) {
  return <li className={`notification-item${notification.isRead ? '' : ' notification-item--unread'}`}>
    <button type="button" className="notification-item__action" onClick={() => onSelect(notification)}>
      <span className="notification-item__heading"><strong>{notification.title}</strong>{!notification.isRead && <span className="notification-item__unread">Unread</span>}</span>
      <span className="notification-item__message">{notification.message}</span>
      <time className="notification-item__time" dateTime={notification.createdAt}>{formatUtcDateTime(notification.createdAt)}</time>
    </button>
  </li>
}

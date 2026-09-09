import { Button } from '@shared/components/Button/Button'
import type { NotificationEmptyStateProps } from '../../types'
export function NotificationEmptyState({ isError, onRetry }: NotificationEmptyStateProps) {
  return <div className="notification-panel__state" role={isError ? 'alert' : 'status'}><p>{isError ? 'Unable to load notifications.' : 'You have no notifications yet.'}</p>{isError && <Button size="small" variant="secondary" onClick={onRetry}>Retry</Button>}</div>
}

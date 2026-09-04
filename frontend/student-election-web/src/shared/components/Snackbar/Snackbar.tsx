import type { SnackbarProps } from '@shared/types/snackbar.types'
import './Snackbar.scss'

export function Snackbar({ snackbar, onClose }: SnackbarProps) {
  const isAssertive = snackbar.type === 'error' || snackbar.type === 'warning'

  return (
    <div
      className={`snackbar snackbar--${snackbar.type}`}
      role={isAssertive ? 'alert' : 'status'}
      aria-live={isAssertive ? 'assertive' : 'polite'}
      aria-atomic="true"
    >
      <span className="snackbar__indicator" aria-hidden="true" />
      <p className="snackbar__message">{snackbar.message}</p>
      <button className="snackbar__close" type="button" onClick={onClose} aria-label="Close notification">×</button>
    </div>
  )
}

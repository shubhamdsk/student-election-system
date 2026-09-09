import type { ProfileStatusProps } from '../types/profile.types'
import './ProfileStatus.scss'

export function ProfileStatus({ status }: ProfileStatusProps) {
  return (
    <span className={`profile-status profile-status--${status.toLowerCase()}`} role="status" aria-live="polite">
      {status}
    </span>
  )
}

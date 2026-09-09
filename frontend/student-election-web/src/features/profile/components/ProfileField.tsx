import type { ProfileFieldProps } from '../types/profile.types'
import './ProfileField.scss'

export function ProfileField({ label, value, emptyText = 'Not provided' }: ProfileFieldProps) {
  return (
    <div className="profile-field">
      <dt className="profile-field__label">{label}</dt>
      <dd className="profile-field__value">{value || emptyText}</dd>
    </div>
  )
}

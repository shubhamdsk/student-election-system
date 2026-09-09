import type { ProfileFieldProps } from '../types/profile.types'
import './ProfileField.scss'

export function ProfileField({ label, value, emptyText = 'Not provided', onCopy, isCopied }: ProfileFieldProps) {
  const displayValue = value || emptyText

  return (
    <div className="profile-field">
      <dt className="profile-field__label">{label}</dt>
      <dd className="profile-field__value-row">
        <span
          className="profile-field__value"
          title={typeof value === 'string' ? value : undefined}
        >
          {displayValue}
        </span>
        {onCopy && value && (
          <button
            type="button"
            className={`profile-field__copy-btn ${isCopied ? 'profile-field__copy-btn--copied' : ''}`}
            onClick={onCopy}
            title={`Copy ${label}`}
            aria-label={`Copy ${label}`}
          >
            {isCopied ? (
              <>
                <span className="profile-field__copy-icon">✓</span>
                <span>Copied!</span>
              </>
            ) : (
              <>
                <span className="profile-field__copy-icon">📋</span>
                <span>Copy</span>
              </>
            )}
          </button>
        )}
      </dd>
    </div>
  )
}

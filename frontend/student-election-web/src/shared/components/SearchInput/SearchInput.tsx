import { useId } from 'react'
import './SearchInput.scss'

export interface SearchInputProps {
  /** Input value */
  value: string
  /** Handler when raw input value changes */
  onChange: (value: string) => void
  /** Placeholder text */
  placeholder?: string
  /** Visible or accessible label text */
  label?: string
  /** Visually hide label while maintaining accessible screen reader support */
  hideLabel?: boolean
  /** Input element ID */
  id?: string
  /** Additional CSS class names */
  className?: string
  /** Minimum characters required to trigger search (default: 3) */
  minChars?: number
  /** Disabled state */
  disabled?: boolean
  /** Custom handler for clear button */
  onClear?: () => void
}

export function SearchInput({
  value,
  onChange,
  placeholder = 'Search…',
  label = 'Search',
  hideLabel = false,
  id,
  className = '',
  minChars = 3,
  disabled = false,
  onClear,
}: SearchInputProps) {
  const generatedId = useId()
  const inputId = id || `search-input-${generatedId}`
  const trimmedLength = value.trim().length
  const isTooShort = trimmedLength > 0 && trimmedLength < minChars

  const handleClear = () => {
    if (onClear) {
      onClear()
    } else {
      onChange('')
    }
  }

  const containerClasses = [
    'search-input',
    disabled ? 'search-input--disabled' : '',
    isTooShort ? 'search-input--too-short' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={containerClasses}>
      {label && (
        <label htmlFor={inputId} className={`search-input__label ${hideLabel ? 'sr-only' : ''}`}>
          {label}
        </label>
      )}

      <div className="search-input__control-wrapper">
        <svg
          className="search-input__icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>

        <input
          id={inputId}
          type="search"
          className="search-input__control"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          aria-label={hideLabel ? label : undefined}
          autoComplete="off"
        />

        {value.length > 0 && (
          <button
            type="button"
            className="search-input__clear"
            onClick={handleClear}
            aria-label="Clear search input"
            title="Clear search"
            disabled={disabled}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      {isTooShort && (
        <span className="search-input__hint" role="status" aria-live="polite">
          Min. {minChars} characters required
        </span>
      )}
    </div>
  )
}

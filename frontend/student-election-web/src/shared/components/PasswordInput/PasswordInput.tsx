import { useState } from 'react'
import type { PasswordInputProps } from '@shared/types/component.types'
import './PasswordInput.scss'

export function PasswordInput({ id, label, error, required, ...inputProps }: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false)
  const errorId = `${id}-error`
  return (
    <div className={`password-input${error ? ' password-input--invalid' : ''}`}>
      <label className="password-input__label" htmlFor={id}>{label}{required && <span aria-hidden="true"> *</span>}</label>
      <div className="password-input__control">
        <input {...inputProps} id={id} type={isVisible ? 'text' : 'password'} required={required} aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} />
        <button type="button" onClick={() => setIsVisible((visible) => !visible)} aria-label={`${isVisible ? 'Hide' : 'Show'} password`} disabled={inputProps.disabled}>{isVisible ? 'Hide' : 'Show'}</button>
      </div>
      <p
        className={`password-input__error${error ? ' password-input__error--visible' : ''}`}
        id={errorId}
        aria-hidden={!error}
      >
        {error ? `Error: ${error}` : ''}
      </p>
    </div>
  )
}

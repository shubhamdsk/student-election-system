import type { FormFieldProps } from '@shared/types/component.types'
import './FormField.scss'

export function FormField({ id, label, error, required, ...inputProps }: FormFieldProps) {
  const errorId = `${id}-error`
  return (
    <div className={`form-field${error ? ' form-field--invalid' : ''}`}>
      <label className="form-field__label" htmlFor={id}>
        {label}{required && <span className="form-field__required" aria-hidden="true"> *</span>}
      </label>
      <input
        {...inputProps}
        className="form-field__input"
        id={id}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
      />
      <p
        className={`form-field__error${error ? ' form-field__error--visible' : ''}`}
        id={errorId}
        aria-hidden={!error}
      >
        {error}
      </p>
    </div>
  )
}

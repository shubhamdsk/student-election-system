import { LoadingSpinner } from '@shared/components/LoadingSpinner/LoadingSpinner'
import type { ButtonProps } from '@shared/types/component.types'
import './Button.scss'

export function Button({
  variant = 'primary', size = 'medium', isLoading = false, loadingLabel = 'Loading',
  className, disabled, children, type = 'button', ...buttonProps
}: ButtonProps) {
  const classes = ['button', `button--${variant}`, `button--${size}`, className]
    .filter(Boolean)
    .join(' ')

  return (
    <button {...buttonProps} className={classes} type={type} disabled={disabled || isLoading} aria-busy={isLoading || undefined}>
      {isLoading ? <LoadingSpinner label={loadingLabel} /> : children}
    </button>
  )
}

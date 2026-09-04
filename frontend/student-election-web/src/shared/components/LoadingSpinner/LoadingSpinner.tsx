import './LoadingSpinner.scss'
import type { LoadingSpinnerProps } from '@shared/types/component.types'

export function LoadingSpinner({ label = 'Loading' }: LoadingSpinnerProps) {
  return <span className="loading-spinner" role="status"><span className="loading-spinner__indicator" aria-hidden="true" />{label}</span>
}

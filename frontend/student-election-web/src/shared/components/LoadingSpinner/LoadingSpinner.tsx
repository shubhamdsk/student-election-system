import './LoadingSpinner.scss'

export function LoadingSpinner({ label = 'Loading' }: { label?: string }) {
  return <span className="loading-spinner" role="status"><span className="loading-spinner__indicator" aria-hidden="true" />{label}</span>
}

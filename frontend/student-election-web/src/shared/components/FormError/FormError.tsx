import './FormError.scss'
import type { FormErrorProps } from '@shared/types/component.types'

export function FormError({ message }: FormErrorProps) {
  return message ? <div className="form-error" role="alert"><strong>Unable to continue.</strong> {message}</div> : null
}

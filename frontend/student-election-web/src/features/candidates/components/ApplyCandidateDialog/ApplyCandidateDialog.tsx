import { useRef, useState } from 'react'
import { Button } from '@shared/components/Button/Button'
import type { ApplyCandidateDialogProps, CandidateApplicationFormValues } from '../../types/student-candidate.types'
import './ApplyCandidateDialog.scss'

const MANIFESTO_MAX_LENGTH = 2000

function validateManifesto(value: string): string | undefined {
  const trimmed = value.trim()
  if (trimmed.length === 0) return 'Manifesto is required.'
  if (trimmed.length > MANIFESTO_MAX_LENGTH) return `Manifesto must be at most ${MANIFESTO_MAX_LENGTH} characters.`
  return undefined
}

export function ApplyCandidateDialog({ election, isSubmitting, onClose, onSubmit }: ApplyCandidateDialogProps) {
  const [values, setValues] = useState<CandidateApplicationFormValues>({ manifesto: '' })
  const [error, setError] = useState<string>()
  const submitted = useRef(false)
  const remainingChars = MANIFESTO_MAX_LENGTH - values.manifesto.length

  const handleManifestoChange = (value: string) => {
    setValues({ manifesto: value })
    if (submitted.current) setError(validateManifesto(value))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    submitted.current = true
    const err = validateManifesto(values.manifesto)
    if (err) { setError(err); return }
    onSubmit(values.manifesto)
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !isSubmitting) onClose()
  }

  return (
    <div className="apply-dialog-backdrop" role="presentation" onClick={handleBackdropClick}>
      <dialog className="apply-dialog" open aria-labelledby="apply-dialog-title" aria-modal="true">
        <header className="apply-dialog__header">
          <h2 className="apply-dialog__title" id="apply-dialog-title">Apply as Candidate</h2>
          <p className="apply-dialog__subtitle">{election.title}</p>
          <button
            className="apply-dialog__close"
            type="button"
            aria-label="Close dialog"
            onClick={onClose}
            disabled={isSubmitting}
          >
            ✕
          </button>
        </header>

        <form className="apply-dialog__form" onSubmit={handleSubmit} noValidate>
          <div className="apply-dialog__field">
            <label className="apply-dialog__label" htmlFor="apply-manifesto">
              Manifesto
              <span className="apply-dialog__required" aria-hidden="true"> *</span>
            </label>
            <p className="apply-dialog__hint">
              Tell voters who you are and why they should vote for you.
            </p>
            <textarea
              id="apply-manifesto"
              className={`apply-dialog__textarea${error ? ' apply-dialog__textarea--error' : ''}`}
              value={values.manifesto}
              onChange={(e) => handleManifestoChange(e.target.value)}
              maxLength={MANIFESTO_MAX_LENGTH}
              rows={7}
              placeholder="Write your manifesto here…"
              aria-required="true"
              aria-describedby={error ? 'apply-manifesto-error apply-manifesto-count' : 'apply-manifesto-count'}
              disabled={isSubmitting}
            />
            <div className="apply-dialog__meta">
              {error ? (
                <span className="apply-dialog__error" id="apply-manifesto-error" role="alert">{error}</span>
              ) : <span />}
              <span
                className={`apply-dialog__char-count${remainingChars < 100 ? ' apply-dialog__char-count--warn' : ''}`}
                id="apply-manifesto-count"
                aria-live="polite"
              >
                {remainingChars} remaining
              </span>
            </div>
          </div>

          <footer className="apply-dialog__footer">
            <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting} loadingLabel="Submitting…">
              Submit Application
            </Button>
          </footer>
        </form>
      </dialog>
    </div>
  )
}

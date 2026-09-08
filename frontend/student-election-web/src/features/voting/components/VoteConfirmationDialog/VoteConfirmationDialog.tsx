import { Button } from '@shared/components/Button/Button'
import './VoteConfirmationDialog.scss'

interface VoteConfirmationDialogProps {
  isOpen: boolean
  candidateName: string
  department?: string
  isSubmitting: boolean
  onConfirm(): void
  onCancel(): void
}

export function VoteConfirmationDialog({
  isOpen,
  candidateName,
  department,
  isSubmitting,
  onConfirm,
  onCancel,
}: VoteConfirmationDialogProps) {
  if (!isOpen) return null

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !isSubmitting) {
      onCancel()
    }
  }

  return (
    <div className="vcd-backdrop" role="presentation" onClick={handleBackdropClick}>
      <dialog className="vcd-dialog" open aria-labelledby="vcd-title" aria-modal="true">
        <header className="vcd-dialog__header">
          <h2 className="vcd-dialog__title" id="vcd-title">
            Confirm your vote
          </h2>
          <button
            className="vcd-dialog__close"
            type="button"
            aria-label="Close dialog"
            disabled={isSubmitting}
            onClick={onCancel}
          >
            ✕
          </button>
        </header>

        <div className="vcd-dialog__body">
          <p className="vcd-dialog__selection">
            You are casting your vote for:
            <strong className="vcd-dialog__candidate-name">
              {candidateName} {department ? `(${department})` : ''}
            </strong>
          </p>

          <div className="vcd-dialog__warning" role="alert">
            <span className="vcd-dialog__warning-icon" aria-hidden="true">⚠️</span>
            <div className="vcd-dialog__warning-content">
              <strong>Irreversible Action:</strong>
              <span> Once submitted, your vote is final and cannot be changed or recalled.</span>
            </div>
          </div>

          <div className="vcd-dialog__anonymity" role="note">
            <span className="vcd-dialog__anonymity-icon" aria-hidden="true">🔒</span>
            <p className="vcd-dialog__anonymity-text">
              Your participation is recorded to prevent duplicate voting, but your ballot does not store your identity.
            </p>
          </div>
        </div>

        <footer className="vcd-dialog__footer">
          <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="primary" onClick={onConfirm} isLoading={isSubmitting}>
            Confirm Vote
          </Button>
        </footer>
      </dialog>
    </div>
  )
}

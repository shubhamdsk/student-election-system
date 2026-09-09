import { formatUtcDateTime } from '@core/utils/date'
import type { ElectionDetails } from '@features/elections/types/election.types'
import { ElectionStatusBadge } from '@features/elections/components/ElectionStatusBadge/ElectionStatusBadge'
import { LoadingSpinner } from '@shared/components/LoadingSpinner/LoadingSpinner'
import { Button } from '@shared/components/Button/Button'
import type { ElectionStatus } from '@core/types/enums'
import './StudentElectionDetailsDialog.scss'

const LIFECYCLE_MESSAGES: Record<ElectionStatus, string> = {
  Draft: 'This election has not started yet.',
  Nominations: 'Candidate applications are currently open.',
  Voting: 'Candidate applications are closed. Voting is currently open.',
  Closed: 'Voting has ended. Results have not been published yet.',
  ResultPublished: 'Results have been published.',
  Cancelled: 'This election has been cancelled.',
}

interface StudentElectionDetailsDialogProps {
  election?: ElectionDetails
  isLoading: boolean
  onClose(): void
  onViewResults?(electionId: string): void
}

export function StudentElectionDetailsDialog({ election, isLoading, onClose, onViewResults }: StudentElectionDetailsDialogProps) {
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div className="election-details-backdrop" role="presentation" onClick={handleBackdropClick}>
      <dialog className="election-details-dialog" open aria-labelledby="election-details-title" aria-modal="true">
        <header className="election-details-dialog__header">
          <div className="election-details-dialog__title-row">
            <h2
              className="election-details-dialog__title"
              id="election-details-title"
              title={election?.title}
            >
              {isLoading ? 'Loading…' : election?.title ?? 'Election Details'}
            </h2>
            {election && <ElectionStatusBadge status={election.status} />}
          </div>
          <button
            className="election-details-dialog__close"
            type="button"
            aria-label="Close dialog"
            onClick={onClose}
          >
            ✕
          </button>
        </header>

        <div className="election-details-dialog__body">
          {isLoading && (
            <div className="election-details-dialog__loading">
              <LoadingSpinner label="Loading election details…" />
            </div>
          )}

          {!isLoading && election && (
            <>
              {election.description && (
                <p className="election-details-dialog__description">{election.description}</p>
              )}

              <div className="election-details-dialog__lifecycle">
                <span className={`election-details-dialog__lifecycle-pill election-details-dialog__lifecycle-pill--${election.status.toLowerCase()}`}>
                  <span>ℹ️</span> {LIFECYCLE_MESSAGES[election.status]}
                </span>
              </div>

              <div className="election-details-dialog__grid">
                <section className="election-details-dialog__section">
                  <h3 className="election-details-dialog__section-title">
                    <span aria-hidden="true">📅</span> Nomination Period
                  </h3>
                  <div className="election-details-dialog__date-row">
                    <span className="election-details-dialog__date-label">Opens</span>
                    <span className="election-details-dialog__date-value">{formatUtcDateTime(election.nominationStartAt)}</span>
                  </div>
                  <div className="election-details-dialog__date-row">
                    <span className="election-details-dialog__date-label">Closes</span>
                    <span className="election-details-dialog__date-value">{formatUtcDateTime(election.nominationEndAt)}</span>
                  </div>
                </section>

                <section className="election-details-dialog__section">
                  <h3 className="election-details-dialog__section-title">
                    <span aria-hidden="true">🗳️</span> Voting Period
                  </h3>
                  <div className="election-details-dialog__date-row">
                    <span className="election-details-dialog__date-label">Opens</span>
                    <span className="election-details-dialog__date-value">{formatUtcDateTime(election.votingStartAt)}</span>
                  </div>
                  <div className="election-details-dialog__date-row">
                    <span className="election-details-dialog__date-label">Closes</span>
                    <span className="election-details-dialog__date-value">{formatUtcDateTime(election.votingEndAt)}</span>
                  </div>
                </section>

                {election.maxCandidates != null && (
                  <section className="election-details-dialog__section">
                    <h3 className="election-details-dialog__section-title">
                      <span aria-hidden="true">👥</span> Max Candidates
                    </h3>
                    <p className="election-details-dialog__meta-value">{election.maxCandidates}</p>
                  </section>
                )}
              </div>
            </>
          )}
        </div>

        <footer className="election-details-dialog__footer">
          <Button variant="secondary" onClick={onClose}>Close</Button>
          {election?.status === 'ResultPublished' && onViewResults && (
            <Button onClick={() => onViewResults(election.id)}>View Results</Button>
          )}
        </footer>
      </dialog>
    </div>
  )
}

import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { formatUtcDateTime } from '@core/utils/date'
import { Button } from '@shared/components/Button/Button'
import { LoadingSpinner } from '@shared/components/LoadingSpinner/LoadingSpinner'
import { ElectionStatusBadge } from '@features/elections/components/ElectionStatusBadge/ElectionStatusBadge'
import { useElectionDetails } from '@features/elections/hooks/useElectionDetails'
import { useVotingCandidates, useVotingParticipation, useCastVote } from '../../hooks'
import { VoteConfirmationDialog } from '../../components/VoteConfirmationDialog/VoteConfirmationDialog'
import './StudentVotingPage.scss'

export function StudentVotingPage() {
  const { electionId = '' } = useParams<{ electionId: string }>()
  const navigate = useNavigate()

  const { election, isLoading: isLoadingElection } = useElectionDetails(electionId)
  const { candidates, isLoading: isLoadingCandidates } = useVotingCandidates(electionId)
  const { hasVoted, isLoading: isLoadingParticipation } = useVotingParticipation(electionId)

  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null)
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)

  const castVoteMutation = useCastVote(electionId, {
    onSuccess: () => {
      setIsConfirmDialogOpen(false)
      setSelectedCandidateId(null)
    },
  })

  const isLoading = isLoadingElection || isLoadingCandidates || isLoadingParticipation
  const isVotingClosed = election && election.status !== 'Voting'
  const selectedCandidate = candidates.find((c) => c.candidateId === selectedCandidateId)

  return (
    <section className="svp-page" aria-label="Student voting portal">
      <nav className="svp-page__nav">
        <button
          type="button"
          className="svp-page__back-btn"
          onClick={() => navigate('/student/elections')}
        >
          ← Back to Elections
        </button>
      </nav>

      {isLoading && (
        <div className="svp-page__state">
          <LoadingSpinner label="Loading voting session…" />
        </div>
      )}

      {!isLoading && election && (
        <>
          <header className="svp-page__header">
            <div className="svp-page__header-title-row">
              <h1 className="svp-page__heading">{election.title}</h1>
              <ElectionStatusBadge status={election.status} />
            </div>
            {election.description && (
              <p className="svp-page__description">{election.description}</p>
            )}

            <div className="svp-page__meta-row">
              <span className="svp-page__meta-item">
                <strong>Voting Period:</strong> {formatUtcDateTime(election.votingStartAt)} – {formatUtcDateTime(election.votingEndAt)}
              </span>
            </div>

            <div className="svp-page__anonymity-banner" role="note">
              <span className="svp-page__banner-icon" aria-hidden="true">🛡️</span>
              <span>
                Your participation is recorded to prevent duplicate voting, but your ballot does not store your identity.
              </span>
            </div>
          </header>

          {isVotingClosed && (
            <div className="svp-page__notice svp-page__notice--warning" role="alert">
              <span className="svp-page__notice-icon" aria-hidden="true">⚠️</span>
              <p className="svp-page__notice-text">
                Voting is no longer available for this election. The election phase is <strong>{election.status}</strong>.
              </p>
            </div>
          )}

          {!isVotingClosed && hasVoted && (
            <div className="svp-page__notice svp-page__notice--success" role="status">
              <span className="svp-page__notice-icon" aria-hidden="true">✓</span>
              <div>
                <strong className="svp-page__notice-title">Vote Submitted</strong>
                <p className="svp-page__notice-text">
                  You have already cast your vote in this election. Thank you for participating!
                </p>
              </div>
            </div>
          )}

          {!isVotingClosed && !hasVoted && (
            <main className="svp-page__main">
              <div className="svp-page__instructions">
                <h2 className="svp-page__section-title">Select a Candidate</h2>
                <p className="svp-page__section-hint">
                  Review candidate manifestos below and select one candidate to cast your vote.
                </p>
              </div>

              {candidates.length === 0 && (
                <div className="svp-page__state" role="status">
                  <span className="svp-page__empty-icon" aria-hidden="true">🗳️</span>
                  <p className="svp-page__empty-text">
                    No approved candidates are available for this election.
                  </p>
                </div>
              )}

              {candidates.length > 0 && (
                <form
                  className="svp-page__candidates-grid"
                  onSubmit={(e) => {
                    e.preventDefault()
                    if (selectedCandidateId) setIsConfirmDialogOpen(true)
                  }}
                >
                  {candidates.map((c) => {
                    const isSelected = selectedCandidateId === c.candidateId
                    return (
                      <article
                        key={c.candidateId}
                        className={`svp-card ${isSelected ? 'svp-card--selected' : ''}`}
                        onClick={() => setSelectedCandidateId(c.candidateId)}
                      >
                        <header className="svp-card__header">
                          <label className="svp-card__radio-label">
                            <input
                              type="radio"
                              name="candidate-selection"
                              value={c.candidateId}
                              checked={isSelected}
                              onChange={() => setSelectedCandidateId(c.candidateId)}
                              className="svp-card__radio-input"
                            />
                            <span className="svp-card__radio-custom" aria-hidden="true" />
                            <span className="svp-card__name">{c.fullName}</span>
                          </label>
                        </header>

                        <div className="svp-card__meta">
                          <span className="svp-card__meta-tag">{c.department}</span>
                          <span className="svp-card__meta-tag">Year {c.yearOfStudy}</span>
                        </div>

                        {c.manifesto && (
                          <section className="svp-card__manifesto">
                            <h3 className="svp-card__manifesto-heading">Manifesto</h3>
                            <p className="svp-card__manifesto-body">{c.manifesto}</p>
                          </section>
                        )}
                      </article>
                    )
                  })}

                  <footer className="svp-page__actions">
                    <Button
                      type="submit"
                      variant="primary"
                      size="medium"
                      disabled={!selectedCandidateId}
                    >
                      Cast Vote
                    </Button>
                  </footer>
                </form>
              )}
            </main>
          )}

          <VoteConfirmationDialog
            isOpen={isConfirmDialogOpen}
            candidateName={selectedCandidate?.fullName ?? ''}
            department={selectedCandidate?.department}
            isSubmitting={castVoteMutation.isPending}
            onConfirm={() => {
              if (selectedCandidateId) {
                castVoteMutation.mutate({ candidateId: selectedCandidateId })
              }
            }}
            onCancel={() => setIsConfirmDialogOpen(false)}
          />
        </>
      )}
    </section>
  )
}

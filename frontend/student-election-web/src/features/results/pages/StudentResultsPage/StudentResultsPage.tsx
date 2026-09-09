import { useNavigate, useParams } from 'react-router-dom'
import { ApiError } from '@core/api/ApiError'
import { Skeleton } from '@components/Skeleton/Skeleton'
import { Button } from '@shared/components/Button/Button'
import { useElectionResults } from '../../hooks/useElectionResults'
import { formatVoteCount } from '../../utils/vote-label'
import './StudentResultsPage.scss'

function getResultsErrorMessage(error: unknown): string {
  if (error instanceof ApiError && (error.status === 403 || error.status === 409)) {
    return 'Results are not available yet.'
  }

  return 'Unable to load election results.'
}

export function StudentResultsPage() {
  const navigate = useNavigate()
  const { electionId } = useParams<{ electionId: string }>()
  const { results, error, isLoading, retry } = useElectionResults(electionId)

  if (isLoading) {
    return (
      <main className="sr-page" aria-label="Loading election results">
        <Skeleton width="120px" height="32px" borderRadius="6px" />
        <header className="sr-page__header" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Skeleton width="100px" height="16px" />
          <Skeleton width="60%" height="32px" />
        </header>
        <section className="sr-page__standings" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
          {[1, 2, 3].map((i) => (
            <div key={i} className="sr-standing" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Skeleton width="48px" height="48px" borderRadius="8px" />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <Skeleton width="40%" height="20px" />
                <Skeleton width="60%" height="16px" />
              </div>
              <Skeleton width="60px" height="24px" />
            </div>
          ))}
        </section>
      </main>
    )
  }

  if (!electionId || error || !results) {
    return (
      <section className="sr-page sr-page--state" aria-labelledby="results-error-title">
        <div className="sr-page__message" role="alert">
          <h1 className="sr-page__message-title" id="results-error-title">
            Results unavailable
          </h1>
          <p className="sr-page__message-text">
            {electionId ? getResultsErrorMessage(error) : 'The election could not be identified.'}
          </p>
          <div className="sr-page__message-actions">
            {electionId && <Button onClick={() => void retry()}>Try Again</Button>}
            <Button variant="secondary" onClick={() => navigate('/student/elections')}>Back to Elections</Button>
          </div>
        </div>
      </section>
    )
  }

  const winners = results.candidates.filter((candidate) => candidate.isWinner)

  return (
    <main className="sr-page" aria-labelledby="results-title">
      <Button variant="secondary" size="small" onClick={() => navigate('/student/elections')}>
        Back to Elections
      </Button>

      <header className="sr-page__header">
        <div className="sr-page__title-row">
          <div>
            <p className="sr-page__eyebrow">Final Results</p>
            <h1 className="sr-page__title" id="results-title">{results.electionTitle}</h1>
          </div>
        </div>
        <p className="sr-page__total" aria-label={`Total votes: ${results.totalVotes}`}>
          <span>Total Votes</span>
          <strong>{results.totalVotes}</strong>
        </p>
      </header>

      {results.totalVotes === 0 && (
        <section className="sr-page__notice" aria-labelledby="no-votes-title">
          <h2 id="no-votes-title">No votes were cast in this election.</h2>
          <p>Candidate standings are shown below exactly as published.</p>
        </section>
      )}

      {winners.length > 0 && (
        <section className="sr-page__winners" aria-labelledby="winner-title">
          <p className="sr-page__winners-label">Official Result</p>
          <h2 className="sr-page__section-title" id="winner-title">
            {results.isTie ? 'Joint Winners' : 'Winner'}
          </h2>
          <div className="sr-page__winner-grid" role="list">
            {winners.map((winner) => (
              <article className="sr-winner" key={winner.candidateId} role="listitem">
                <span className="sr-winner__mark" aria-hidden="true">★</span>
                <div className="sr-winner__details">
                  <h3 className="sr-winner__name">{winner.fullName}</h3>
                  <p className="sr-winner__meta">{winner.department} · Year {winner.yearOfStudy}</p>
                </div>
                <div className="sr-winner__result">
                  <strong>{formatVoteCount(winner.voteCount)}</strong>
                  <span>Rank {winner.rank}</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="sr-page__standings" aria-labelledby="standings-title">
        <div className="sr-page__section-heading">
          <h2 className="sr-page__section-title" id="standings-title">Final Standings</h2>
          <span>{results.candidates.length} {results.candidates.length === 1 ? 'candidate' : 'candidates'}</span>
        </div>

        {results.candidates.length === 0 ? (
          <p className="sr-page__empty">No approved candidates were available for this election.</p>
        ) : (
          <ol className="sr-standings" aria-label="Candidate rankings">
            {results.candidates.map((candidate) => (
              <li className={`sr-standing${candidate.isWinner ? ' sr-standing--winner' : ''}`} key={candidate.candidateId}>
                <div className="sr-standing__rank" aria-label={`Rank ${candidate.rank}`}>
                  <span>Rank</span>
                  <strong>{candidate.rank}</strong>
                </div>
                <div className="sr-standing__candidate">
                  <div className="sr-standing__name-row">
                    <h3>{candidate.fullName}</h3>
                    {candidate.isWinner && <span className="sr-standing__winner-badge">Winner</span>}
                  </div>
                  <p>{candidate.department} · Year {candidate.yearOfStudy}</p>
                  {candidate.manifesto && <p className="sr-standing__manifesto">{candidate.manifesto}</p>}
                </div>
                <strong className="sr-standing__votes">{formatVoteCount(candidate.voteCount)}</strong>
              </li>
            ))}
          </ol>
        )}
      </section>
    </main>
  )
}

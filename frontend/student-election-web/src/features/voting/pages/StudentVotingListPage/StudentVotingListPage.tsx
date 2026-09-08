import { useNavigate } from 'react-router-dom'
import { formatUtcDateTime } from '@core/utils/date'
import { Button } from '@shared/components/Button/Button'
import { LoadingSpinner } from '@shared/components/LoadingSpinner/LoadingSpinner'
import { useElections } from '@features/elections/hooks/useElections'
import type { ElectionListItem } from '@features/elections/types/election.types'
import { useVotingParticipation } from '../../hooks/useVotingParticipation'
import './StudentVotingListPage.scss'

function VotingElectionCard({ election }: { election: ElectionListItem }) {
  const navigate = useNavigate()
  const { hasVoted, isLoading } = useVotingParticipation(election.id)

  return (
    <article className="svl-card" aria-label={election.title}>
      <header className="svl-card__header">
        <div className="svl-card__title-row">
          <h2 className="svl-card__title" title={election.title}>{election.title}</h2>
        </div>
      </header>

      <div className="svl-card__schedule">
        <span className="svl-card__schedule-label">Voting Period</span>
        <span className="svl-card__schedule-value">
          {formatUtcDateTime(election.votingStartAt)} – {formatUtcDateTime(election.votingEndAt)}
        </span>
      </div>

      <footer className="svl-card__footer">
        {isLoading ? (
          <LoadingSpinner label="Checking participation…" />
        ) : hasVoted ? (
          <span className="svl-card__voted-badge" role="status">
            ✓ Vote Submitted
          </span>
        ) : (
          <Button
            variant="primary"
            size="medium"
            onClick={() => navigate(`/student/elections/${election.id}/vote`)}
          >
            Vote Now
          </Button>
        )}
      </footer>
    </article>
  )
}

export function StudentVotingListPage() {
  const { result, isLoading } = useElections({
    pageNumber: 1,
    pageSize: 100,
    status: 'Voting',
  })

  const elections = result.items
  const isEmpty = !isLoading && elections.length === 0

  return (
    <section className="svl-page" aria-label="Active Voting Sessions">
      <header className="svl-page__header">
        <h1 className="svl-page__heading">Voting</h1>
        <p className="svl-page__subheading">
          Cast your vote in active student elections.
        </p>
      </header>

      {isLoading && (
        <div className="svl-page__state">
          <LoadingSpinner label="Loading active voting sessions…" />
        </div>
      )}

      {isEmpty && (
        <div className="svl-page__state" role="status">
          <span className="svl-page__empty-icon" aria-hidden="true">🗳️</span>
          <p className="svl-page__empty-text">No elections are currently open for voting.</p>
          <p className="svl-page__empty-hint">
            Visit the <strong>Elections</strong> page to view election schedules and nomination dates.
          </p>
        </div>
      )}

      {!isLoading && elections.length > 0 && (
        <div className="svl-page__grid" role="list" aria-label="Active voting elections">
          {elections.map((election) => (
            <div key={election.id} role="listitem">
              <VotingElectionCard election={election} />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

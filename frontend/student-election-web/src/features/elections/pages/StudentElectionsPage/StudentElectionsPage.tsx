import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { ElectionStatus } from '@core/types/enums'
import { formatUtcDateTime } from '@core/utils/date'
import { useDebouncedValue } from '@shared/hooks/useDebouncedValue'
import { Button } from '@shared/components/Button/Button'
import { LoadingSpinner } from '@shared/components/LoadingSpinner/LoadingSpinner'
import { ElectionStatusBadge } from '../../components/ElectionStatusBadge/ElectionStatusBadge'
import { StudentElectionDetailsDialog } from '../../components/StudentElectionDetailsDialog/StudentElectionDetailsDialog'
import { useElections } from '../../hooks/useElections'
import { useElectionDetails } from '../../hooks/useElectionDetails'
import type { ElectionListItem } from '../../types/election.types'
import { ApplyCandidateDialog } from '@features/candidates/components/ApplyCandidateDialog/ApplyCandidateDialog'
import { useCandidateApplication } from '@features/candidates/hooks/useCandidateApplication'
import { useMyCandidateApplications } from '@features/candidates/hooks/useMyCandidateApplications'
import type { CandidateApplication } from '@features/candidates/types/candidate.types'
import type { ApplicationsByElection } from '@features/candidates/types/student-candidate.types'
import './StudentElectionsPage.scss'

const ELECTION_STATUSES: Array<{ label: string; value: ElectionStatus | '' }> = [
  { label: 'All statuses', value: '' },
  { label: 'Draft', value: 'Draft' },
  { label: 'Nominations', value: 'Nominations' },
  { label: 'Voting', value: 'Voting' },
  { label: 'Closed', value: 'Closed' },
  { label: 'Result Published', value: 'ResultPublished' },
  { label: 'Cancelled', value: 'Cancelled' },
]

const LIFECYCLE_LABEL: Record<ElectionStatus, string> = {
  Draft: 'Election has not started yet.',
  Nominations: 'Candidate applications are open.',
  Voting: 'Voting is currently open.',
  Closed: 'Voting has ended.',
  ResultPublished: 'Results are available.',
  Cancelled: 'Election has been cancelled.',
}

function buildApplicationMap(applications: CandidateApplication[]): ApplicationsByElection {
  const map = new Map<string, CandidateApplication>()
  for (const app of applications) map.set(app.electionId, app)
  return map
}

function ApplicationBadge({ status }: { status: CandidateApplication['status'] }) {
  const labels: Record<string, string> = { Pending: 'Application Pending', Approved: 'Candidate Approved', Rejected: 'Application Rejected' }
  return (
    <span className={`se-page__app-badge se-page__app-badge--${status.toLowerCase()}`} aria-label={`Your candidate status: ${status}`}>
      {labels[status] ?? status}
    </span>
  )
}

interface ElectionCardProps {
  election: ElectionListItem
  application: CandidateApplication | undefined
  onViewDetails(election: ElectionListItem): void
  onApply(election: ElectionListItem): void
  onVote(election: ElectionListItem): void
}

function ElectionCard({ election, application, onViewDetails, onApply, onVote }: ElectionCardProps) {
  const showApply = election.status === 'Nominations' && !application
  const showVote = election.status === 'Voting'

  return (
    <article className="se-card" aria-label={election.title}>
      <header className="se-card__header">
        <div className="se-card__header-top">
          <ElectionStatusBadge status={election.status} />
          {election.maxCandidates != null && (
            <span className="se-card__max-candidates">Max candidates: {election.maxCandidates}</span>
          )}
        </div>
        <h2 className="se-card__title">{election.title}</h2>
        <p className="se-card__lifecycle">{LIFECYCLE_LABEL[election.status]}</p>
      </header>

      <div className="se-card__schedule">
        <div className="se-card__schedule-row">
          <span className="se-card__schedule-label">Nominations</span>
          <span className="se-card__schedule-range">
            {formatUtcDateTime(election.nominationStartAt)} – {formatUtcDateTime(election.nominationEndAt)}
          </span>
        </div>
        <div className="se-card__schedule-row">
          <span className="se-card__schedule-label">Voting</span>
          <span className="se-card__schedule-range">
            {formatUtcDateTime(election.votingStartAt)} – {formatUtcDateTime(election.votingEndAt)}
          </span>
        </div>
      </div>

      <footer className="se-card__footer">
        {application && <ApplicationBadge status={application.status} />}
        <div className="se-card__actions">
          <Button variant="secondary" size="small" onClick={() => onViewDetails(election)}>
            View Details
          </Button>
          {showApply && (
            <Button variant="primary" size="small" onClick={() => onApply(election)}>
              Apply as Candidate
            </Button>
          )}
          {showVote && (
            <Button variant="primary" size="small" onClick={() => onVote(election)}>
              Vote Now
            </Button>
          )}
        </div>
      </footer>
    </article>
  )
}

export function StudentElectionsPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<ElectionStatus | ''>('')
  const [detailsId, setDetailsId] = useState<string>()
  const [applyElection, setApplyElection] = useState<ElectionListItem>()

  const debouncedSearch = useDebouncedValue(search, 400)
  const { result, isLoading } = useElections({
    pageNumber: 1,
    pageSize: 100,
    search: debouncedSearch,
    status: status || undefined,
  })
  const { election: detailsElection, isLoading: detailsLoading } = useElectionDetails(detailsId)
  const { applications, isLoading: applicationsLoading } = useMyCandidateApplications()
  const { apply, isSubmitting } = useCandidateApplication()

  // Build lookup map once — avoids N+1 requests
  const applicationsByElection = buildApplicationMap(applications)

  const hasFilters = Boolean(debouncedSearch.trim() || status)
  const isEmpty = !isLoading && result.items.length === 0

  const handleApplySubmit = async (manifesto: string) => {
    if (!applyElection) return
    await apply(applyElection.id, manifesto)
    setApplyElection(undefined)
  }

  return (
    <section className="se-page" aria-label="Student elections">
      <header className="se-page__header">
        <h1 className="se-page__heading">Elections</h1>
        <p className="se-page__subheading">Browse available elections and apply as a candidate.</p>
      </header>

      <div className="se-page__toolbar">
        <div className="se-page__search-wrap">
          <label htmlFor="se-search" className="sr-only">Search elections</label>
          <input
            id="se-search"
            className="se-page__search"
            type="search"
            placeholder="Search elections…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search elections"
          />
        </div>
        <div className="se-page__filter-wrap">
          <label htmlFor="se-status-filter" className="sr-only">Filter by status</label>
          <select
            id="se-status-filter"
            className="se-page__status-filter"
            value={status}
            onChange={(e) => setStatus(e.target.value as ElectionStatus | '')}
            aria-label="Filter by election status"
          >
            {ELECTION_STATUSES.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {(isLoading || applicationsLoading) && (
        <div className="se-page__state">
          <LoadingSpinner label="Loading elections…" />
        </div>
      )}

      {isEmpty && !isLoading && (
        <div className="se-page__state" role="status">
          {hasFilters
            ? 'No elections match the current filters.'
            : 'No elections are currently available.'}
        </div>
      )}

      {!isLoading && !applicationsLoading && result.items.length > 0 && (
        <div className="se-page__grid" role="list" aria-label="Election list">
          {result.items.map((election) => (
            <div key={election.id} role="listitem">
              <ElectionCard
                election={election}
                application={applicationsByElection.get(election.id)}
                onViewDetails={(e) => setDetailsId(e.id)}
                onApply={(e) => setApplyElection(e)}
                onVote={(e) => navigate(`/student/elections/${e.id}/vote`)}
              />
            </div>
          ))}
        </div>
      )}

      {detailsId && (
        <StudentElectionDetailsDialog
          election={detailsElection}
          isLoading={detailsLoading}
          onClose={() => setDetailsId(undefined)}
        />
      )}

      {applyElection && (
        <ApplyCandidateDialog
          election={applyElection}
          isSubmitting={isSubmitting}
          onClose={() => setApplyElection(undefined)}
          onSubmit={handleApplySubmit}
        />
      )}
    </section>
  )
}

import { formatUtcDateTime } from '@core/utils/date'
import { Skeleton } from '@components/Skeleton/Skeleton'
import { ElectionStatusBadge } from '@features/elections/components/ElectionStatusBadge/ElectionStatusBadge'
import { useMyCandidateApplications } from '@features/candidates/hooks/useMyCandidateApplications'
import type { CandidateApplication } from '@features/candidates/types/candidate.types'
import './StudentCandidatesPage.scss'

const STATUS_CONFIG = {
  Pending: {
    label: 'Awaiting Review',
    message: 'Your candidate application is awaiting administrator review.',
    modifier: 'pending',
  },
  Approved: {
    label: 'Approved',
    message: 'Your candidate application has been approved.',
    modifier: 'approved',
  },
  Rejected: {
    label: 'Rejected',
    message: 'Your candidate application was rejected.',
    modifier: 'rejected',
  },
} as const

interface ApplicationCardProps {
  application: CandidateApplication
}

function ApplicationCard({ application }: ApplicationCardProps) {
  const config = STATUS_CONFIG[application.status] ?? STATUS_CONFIG.Pending

  return (
    <article className="scp-card" aria-label={`Application for ${application.electionTitle}`}>
      <header className="scp-card__header">
        <div className="scp-card__title-group">
          <h2 className="scp-card__election">{application.electionTitle}</h2>
          {application.electionStatus && (
            <div className="scp-card__badge-wrapper" title="Election Lifecycle Phase">
              <ElectionStatusBadge status={application.electionStatus} />
            </div>
          )}
        </div>
        <span
          className={`scp-card__badge scp-card__badge--${config.modifier}`}
          aria-label={`Application Status: ${config.label}`}
          title="Application Status"
        >
          {config.label}
        </span>
      </header>

      <div className={`scp-card__status-message scp-card__status-message--${config.modifier}`} role="status">
        {config.message}
        {application.status === 'Rejected' && application.rejectionReason && (
          <blockquote className="scp-card__rejection-reason">
            <span className="scp-card__rejection-label">Reason: </span>
            {application.rejectionReason}
          </blockquote>
        )}
      </div>

      {application.manifesto && (
        <section className="scp-card__manifesto" aria-label="Your manifesto">
          <h3 className="scp-card__manifesto-label">Your Manifesto</h3>
          <p className="scp-card__manifesto-text">{application.manifesto}</p>
        </section>
      )}

      <footer className="scp-card__footer">
        <div className="scp-card__date">
          <span className="scp-card__date-label">Applied</span>
          <span className="scp-card__date-value">{formatUtcDateTime(application.createdAt)}</span>
        </div>
        {application.approvedAt && (
          <div className="scp-card__date">
            <span className="scp-card__date-label">Approved</span>
            <span className="scp-card__date-value">{formatUtcDateTime(application.approvedAt)}</span>
          </div>
        )}
        {application.rejectedAt && (
          <div className="scp-card__date">
            <span className="scp-card__date-label">Rejected</span>
            <span className="scp-card__date-value">{formatUtcDateTime(application.rejectedAt)}</span>
          </div>
        )}
      </footer>
    </article>
  )
}

export function StudentCandidatesPage() {
  const { applications, isLoading } = useMyCandidateApplications()

  return (
    <section className="scp-page" aria-label="My candidate applications">
      <header className="scp-page__header">
        <h1 className="scp-page__heading">My Applications</h1>
        <p className="scp-page__subheading">Track the status of your candidate applications.</p>
      </header>

      {isLoading && (
        <div className="scp-page__list" role="status" aria-label="Loading your applications">
          {[1, 2].map((i) => (
            <div key={i} className="scp-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Skeleton width="60%" height="24px" />
                <Skeleton width="100px" height="24px" borderRadius="12px" />
              </div>
              <Skeleton width="100%" height="40px" borderRadius="6px" />
              <Skeleton width="100%" height="60px" borderRadius="6px" />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Skeleton width="140px" height="16px" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && applications.length === 0 && (
        <div className="scp-page__state" role="status">
          <span className="scp-page__empty-icon" aria-hidden="true">📋</span>
          <p className="scp-page__empty-text">You have not applied as a candidate in any election yet.</p>
          <p className="scp-page__empty-hint">
            Visit the <strong>Elections</strong> page to browse available elections and apply.
          </p>
        </div>
      )}

      {!isLoading && applications.length > 0 && (
        <div className="scp-page__list" role="list" aria-label="Candidate applications">
          {applications.map((app) => (
            <div key={app.candidateId} role="listitem">
              <ApplicationCard application={app} />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

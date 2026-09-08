import { Link } from 'react-router-dom'
import { formatUtcDateTime } from '@core/utils/date'
import { CandidateStatusBadge } from '@features/candidates/components/CandidateStatusBadge/CandidateStatusBadge'
import { ElectionStatusBadge } from '@features/elections/components/ElectionStatusBadge/ElectionStatusBadge'
import { Button } from '@shared/components/Button/Button'
import { LoadingSpinner } from '@shared/components/LoadingSpinner/LoadingSpinner'
import { useStudentDashboard } from '../../hooks/useStudentDashboard'
import { getActionPath } from '../../utils/dashboard.utils'
import './StudentDashboardPage.scss'

export function StudentDashboardPage() {
  const dashboard = useStudentDashboard()
  const isAttentionLoading = dashboard.isElectionsLoading || dashboard.isApplicationsLoading || dashboard.isParticipationLoading

  return (
    <main className="sd-page" aria-labelledby="student-dashboard-title">
      <header className="sd-page__header">
        <div>
          <p className="sd-page__eyebrow">Student portal</p>
          <h1 className="sd-page__title" id="student-dashboard-title">Dashboard</h1>
          <p className="sd-page__subtitle">Your elections, applications, and results at a glance.</p>
        </div>
        <div className="sd-page__quick-actions" aria-label="Quick actions">
          <Link className="sd-page__quick-link" to="/student/elections">Browse Elections</Link>
          <Link className="sd-page__quick-link sd-page__quick-link--secondary" to="/student/candidates">My Applications</Link>
        </div>
      </header>

      <section className="sd-section sd-section--attention" aria-labelledby="attention-title">
        <div className="sd-section__heading">
          <div>
            <p className="sd-section__eyebrow">Priority</p>
            <h2 id="attention-title">Needs Your Attention</h2>
          </div>
          {!isAttentionLoading && <span>{dashboard.attentionItems.length} open</span>}
        </div>

        {isAttentionLoading ? (
          <div className="sd-section__state"><LoadingSpinner label="Checking current activity…" /></div>
        ) : dashboard.attentionItems.length > 0 ? (
          <div className="sd-attention-list" role="list">
            {dashboard.attentionItems.map((item) => (
              <article className={`sd-attention sd-attention--${item.tone}`} key={item.id} role="listitem">
                <div className="sd-attention__marker" aria-hidden="true" />
                <div className="sd-attention__content">
                  <p className="sd-attention__type">{item.title}</p>
                  <h3>{item.electionTitle}</h3>
                  <p>{item.message}</p>
                </div>
                <Link className="sd-attention__action" to={getActionPath(item.actionKind, item.electionId)}>
                  {item.actionLabel}
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="sd-section__state" role="status">
            <strong>You’re all caught up.</strong>
            <span>There are no urgent actions right now.</span>
          </div>
        )}

        {dashboard.hasParticipationError && (
          <div className="sd-section__inline-error" role="alert">
            <span>We couldn’t confirm voting participation for every active election.</span>
            <Button variant="secondary" size="small" onClick={dashboard.retryParticipation}>Retry</Button>
          </div>
        )}
      </section>

      <div className="sd-page__grid">
        <section className="sd-section" aria-labelledby="latest-elections-title">
          <div className="sd-section__heading">
            <h2 id="latest-elections-title">Latest Elections</h2>
            <Link to="/student/elections">View all</Link>
          </div>
          {dashboard.isElectionsLoading ? (
            <div className="sd-section__state"><LoadingSpinner label="Loading elections…" /></div>
          ) : dashboard.electionsError ? (
            <div className="sd-section__state" role="alert">
              <span>Unable to load elections.</span>
              <Button variant="secondary" size="small" onClick={() => void dashboard.retryElections()}>Try Again</Button>
            </div>
          ) : dashboard.latestElections.length > 0 ? (
            <div className="sd-election-list" role="list">
              {dashboard.latestElections.map((election) => (
                <article className="sd-election" key={election.id} role="listitem">
                  <div className="sd-election__topline">
                    <ElectionStatusBadge status={election.status} />
                    <span>{election.dateLabel}: {formatUtcDateTime(election.dateValue)}</span>
                  </div>
                  <div className="sd-election__body">
                    <h3 title={election.title}>{election.title}</h3>
                    <Link to={election.action.path}>{election.action.label}</Link>
                  </div>
                </article>
              ))}
            </div>
          ) : <div className="sd-section__state" role="status">No active elections are currently available.</div>}
        </section>

        <section className="sd-section" aria-labelledby="applications-title">
          <div className="sd-section__heading">
            <h2 id="applications-title">My Candidate Applications</h2>
            <Link to="/student/candidates">View all</Link>
          </div>
          {dashboard.isApplicationsLoading ? (
            <div className="sd-section__state"><LoadingSpinner label="Loading applications…" /></div>
          ) : dashboard.applicationsError ? (
            <div className="sd-section__state" role="alert">
              <span>Unable to load your applications.</span>
              <Button variant="secondary" size="small" onClick={() => void dashboard.retryApplications()}>Try Again</Button>
            </div>
          ) : dashboard.applications.length > 0 ? (
            <div className="sd-application-list" role="list">
              {dashboard.applications.map((application) => (
                <article className="sd-application" key={application.candidateId} role="listitem">
                  <div className="sd-application__heading">
                    <h3 title={application.electionTitle}>{application.electionTitle}</h3>
                    <CandidateStatusBadge status={application.status} />
                  </div>
                  <div className="sd-application__meta">
                    <ElectionStatusBadge status={application.electionStatus} />
                    <span>Applied {formatUtcDateTime(application.createdAt)}</span>
                  </div>
                  {application.status === 'Rejected' && application.rejectionReason && (
                    <p className="sd-application__reason">Reason: {application.rejectionReason}</p>
                  )}
                  <Link to="/student/candidates">View Application</Link>
                </article>
              ))}
            </div>
          ) : <div className="sd-section__state" role="status">You have not applied as a candidate yet.</div>}
        </section>
      </div>

      <section className="sd-section" aria-labelledby="recent-results-title">
        <div className="sd-section__heading">
          <h2 id="recent-results-title">Recent Results</h2>
        </div>
        {dashboard.isElectionsLoading ? (
          <div className="sd-section__state"><LoadingSpinner label="Checking published results…" /></div>
        ) : dashboard.electionsError ? (
          <div className="sd-section__state">Results are temporarily unavailable.</div>
        ) : dashboard.recentResults.length > 0 ? (
          <div className="sd-results" role="list">
            {dashboard.recentResults.map((election) => (
              <article className="sd-result" key={election.id} role="listitem">
                <div>
                  <p>Final results available</p>
                  <h3 title={election.title}>{election.title}</h3>
                </div>
                <Link to={`/student/elections/${election.id}/results`}>View Results</Link>
              </article>
            ))}
          </div>
        ) : <div className="sd-section__state" role="status">No election results have been published yet.</div>}
      </section>
    </main>
  )
}

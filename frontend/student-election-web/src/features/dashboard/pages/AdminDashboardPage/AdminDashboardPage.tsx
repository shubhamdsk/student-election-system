import { Link } from 'react-router-dom'
import { formatUtcDateTime } from '@core/utils/date'
import { ElectionStatusBadge } from '@features/elections/components/ElectionStatusBadge/ElectionStatusBadge'
import { Button } from '@shared/components/Button/Button'
import { Skeleton } from '@components/Skeleton/Skeleton'
import { useAdminDashboard } from '../../hooks/useAdminDashboard'
import './AdminDashboardPage.scss'

export function AdminDashboardPage() {
  const dashboard = useAdminDashboard()
  const isAttentionLoading = dashboard.isStudentsLoading || dashboard.isCandidatesLoading || dashboard.isElectionsLoading

  return (
    <main className="ad-page" aria-labelledby="admin-dashboard-title">
      <header className="ad-page__header">
        <div>
          <p className="ad-page__eyebrow">Administration</p>
          <h1 className="ad-page__title" id="admin-dashboard-title">Dashboard</h1>
          <p className="ad-page__subtitle">Review pending work and manage current elections.</p>
        </div>
        <nav className="ad-page__quick-actions" aria-label="Admin quick actions">
          <Link to="/admin/students">Review Students</Link>
          <Link to="/admin/candidates">Review Candidates</Link>
          <Link className="ad-page__quick-link--primary" to="/admin/elections">Manage Elections</Link>
        </nav>
      </header>

      <section className="ad-section ad-section--attention" aria-labelledby="admin-attention-title">
        <div className="ad-section__heading">
          <div>
            <p className="ad-section__eyebrow">Operational priority</p>
            <h2 id="admin-attention-title">Needs Your Attention</h2>
          </div>
          {!isAttentionLoading && <span>{dashboard.attentionItems.length} items</span>}
        </div>
        {isAttentionLoading ? (
          <div className="ad-attention-list" role="status" aria-label="Checking administrative activity">
            <div className="ad-attention" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Skeleton width="50%" height="20px" />
              <Skeleton width="80%" height="16px" />
            </div>
          </div>
        ) : dashboard.attentionItems.length > 0 ? (
          <div className="ad-attention-list" role="list">
            {dashboard.attentionItems.map((item) => (
              <article className={`ad-attention ad-attention--${item.tone}`} key={item.id} role="listitem">
                <span className="ad-attention__marker" aria-hidden="true" />
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.message}</p>
                </div>
                <Link to={item.path}>{item.actionLabel}</Link>
              </article>
            ))}
          </div>
        ) : dashboard.hasAttentionError ? (
          <div className="ad-section__state" role="alert">
            <strong>Some attention data is unavailable.</strong>
            <span>Use the section retries below to refresh the missing information.</span>
          </div>
        ) : (
          <div className="ad-section__state" role="status">
            <strong>No urgent administrative actions.</strong>
            <span>Everything requiring review is currently up to date.</span>
          </div>
        )}
      </section>

      <section className="ad-section" aria-labelledby="pending-reviews-title">
        <div className="ad-section__heading"><h2 id="pending-reviews-title">Pending Reviews</h2></div>
        <div className="ad-review-grid">
          <article className="ad-review" aria-labelledby="pending-students-title">
            <div className="ad-review__header">
              <div><p>Registrations</p><h3 id="pending-students-title">Pending Students</h3></div>
              {!dashboard.isStudentsLoading && !dashboard.studentsError && <strong>{dashboard.students.totalCount}</strong>}
            </div>
            {dashboard.isStudentsLoading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1rem 0' }} role="status">
                <Skeleton width="100%" height="24px" />
                <Skeleton width="100%" height="24px" />
                <Skeleton width="100%" height="24px" />
              </div>
            ) : dashboard.studentsError ? (
              <div className="ad-review__state" role="alert"><span>Unable to load pending students.</span><Button variant="secondary" size="small" onClick={() => void dashboard.retryStudents()}>Retry</Button></div>
            ) : dashboard.students.items.length > 0 ? (
              <ul className="ad-review__list">
                {dashboard.students.items.slice(0, 3).map((student) => (
                  <li key={student.studentId}><span><strong>{student.fullName}</strong><small>{student.registrationNumber}</small></span><time dateTime={student.createdAt}>{formatUtcDateTime(student.createdAt)}</time></li>
                ))}
              </ul>
            ) : <p className="ad-review__empty">No pending student registrations.</p>}
            <Link className="ad-review__action" to="/admin/students">Review Students</Link>
          </article>

          <article className="ad-review" aria-labelledby="pending-candidates-title">
            <div className="ad-review__header">
              <div><p>Applications</p><h3 id="pending-candidates-title">Pending Candidates</h3></div>
              {!dashboard.isCandidatesLoading && !dashboard.candidatesError && <strong>{dashboard.candidates.totalCount}</strong>}
            </div>
            {dashboard.isCandidatesLoading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1rem 0' }} role="status">
                <Skeleton width="100%" height="24px" />
                <Skeleton width="100%" height="24px" />
                <Skeleton width="100%" height="24px" />
              </div>
            ) : dashboard.candidatesError ? (
              <div className="ad-review__state" role="alert"><span>Unable to load pending candidates.</span><Button variant="secondary" size="small" onClick={() => void dashboard.retryCandidates()}>Retry</Button></div>
            ) : dashboard.candidates.items.length > 0 ? (
              <ul className="ad-review__list">
                {dashboard.candidates.items.slice(0, 3).map((candidate) => (
                  <li key={candidate.candidateId}><span><strong>{candidate.studentFullName}</strong><small>{candidate.electionTitle}</small></span><time dateTime={candidate.nominatedAt}>{formatUtcDateTime(candidate.nominatedAt)}</time></li>
                ))}
              </ul>
            ) : <p className="ad-review__empty">No pending candidate applications.</p>}
            <Link className="ad-review__action" to="/admin/candidates">Review Candidates</Link>
          </article>
        </div>
      </section>

      <section className="ad-section" aria-labelledby="recent-elections-title">
        <div className="ad-section__heading">
          <div><p className="ad-section__eyebrow">Most recently changed</p><h2 id="recent-elections-title">Active & Recent Elections</h2></div>
          <Link to="/admin/elections">Manage all</Link>
        </div>
        {dashboard.isElectionsLoading ? (
          <div className="ad-election-list" role="status" aria-label="Loading recent elections">
            {[1, 2].map((i) => (
              <div key={i} className="ad-election" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <Skeleton width="140px" height="18px" borderRadius="10px" />
                <Skeleton width="60%" height="20px" />
              </div>
            ))}
          </div>
        ) : dashboard.electionsError ? (
          <div className="ad-section__state" role="alert"><span>Unable to load elections.</span><Button variant="secondary" size="small" onClick={() => void dashboard.retryElections()}>Try Again</Button></div>
        ) : dashboard.elections.length > 0 ? (
          <div className="ad-election-list" role="list">
            {dashboard.elections.map((election) => (
              <article className="ad-election" key={election.id} role="listitem">
                <div className="ad-election__status"><ElectionStatusBadge status={election.status} /><span>{election.activityLabel}: {formatUtcDateTime(election.activityAt)}</span></div>
                <div className="ad-election__content"><div><h3 title={election.title}>{election.title}</h3><p>{election.message}</p></div><Link to="/admin/elections">Manage</Link></div>
              </article>
            ))}
          </div>
        ) : <div className="ad-section__state" role="status">No elections found.</div>}
      </section>
    </main>
  )
}

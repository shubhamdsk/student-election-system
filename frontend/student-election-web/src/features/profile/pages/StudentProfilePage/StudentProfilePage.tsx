import { useState } from 'react'
import { Link } from 'react-router-dom'
import { formatUtcDateTime } from '@core/utils/date'
import { useCurrentStudentProfile } from '@features/profile/hooks/useCurrentStudentProfile'
import { useMyCandidateApplications } from '@features/candidates/hooks/useMyCandidateApplications'
import { CandidateStatusBadge } from '@features/candidates/components/CandidateStatusBadge/CandidateStatusBadge'
import { ElectionStatusBadge } from '@features/elections/components/ElectionStatusBadge/ElectionStatusBadge'
import { ProfileField } from '@features/profile/components/ProfileField'
import { ProfileSection } from '@features/profile/components/ProfileSection'
import { ProfileStatus } from '@features/profile/components/ProfileStatus'
import { Skeleton } from '@components/Skeleton/Skeleton'
import { Button } from '@shared/components/Button/Button'
import './StudentProfilePage.scss'

type ProfileTab = 'overview' | 'academic' | 'security'

function getInitials(name: string): string {
  if (!name) return 'ST'
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  return parts[0].substring(0, 2).toUpperCase()
}

export function StudentProfilePage() {
  const { data: student, isLoading, error, refetch } = useCurrentStudentProfile()
  const { applications } = useMyCandidateApplications()
  const [activeTab, setActiveTab] = useState<ProfileTab>('overview')
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(fieldName)
    setTimeout(() => setCopiedField(null), 2000)
  }

  return (
    <main className="student-profile-page" aria-labelledby="student-profile-title">
      <header className="page-header">
        <div>
          <p className="page-header__eyebrow">Student account</p>
          <h1 className="page-header__title" id="student-profile-title">Profile</h1>
        </div>
      </header>

      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} role="status" aria-label="Loading your profile">
          {/* Avatar Banner Skeleton */}
          <section className="profile-summary" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flex: 1 }}>
              <Skeleton width="4rem" height="4rem" borderRadius="50%" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <Skeleton width="100px" height="14px" />
                  <Skeleton width="80px" height="14px" />
                </div>
                <Skeleton width="220px" height="24px" />
                <Skeleton width="150px" height="16px" />
              </div>
            </div>
            <Skeleton width="100px" height="32px" borderRadius="16px" />
          </section>

          {/* Quick Stats Grid Skeleton */}
          <div className="profile-stats">
            {[1, 2, 3].map((i) => (
              <div key={i} className="profile-stat-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <Skeleton width="90px" height="14px" />
                <Skeleton width="110px" height="24px" />
              </div>
            ))}
          </div>

          {/* Tabs Nav Skeleton */}
          <div className="profile-tabs" style={{ display: 'flex', gap: '0.5rem' }}>
            <Skeleton width="130px" height="38px" borderRadius="8px" />
            <Skeleton width="180px" height="38px" borderRadius="8px" />
            <Skeleton width="160px" height="38px" borderRadius="8px" />
          </div>

          {/* Section Grid Skeleton */}
          <div className="profile-grid">
            {[1, 2].map((i) => (
              <div key={i} className="profile-section" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Skeleton width="45%" height="22px" />
                <Skeleton width="70%" height="16px" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginTop: '0.5rem' }}>
                  <Skeleton width="100%" height="20px" />
                  <Skeleton width="100%" height="20px" />
                  <Skeleton width="100%" height="20px" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : error ? (
        <div className="page-state page-state--error" role="alert">
          <p>Unable to load your profile right now.</p>
          <Button variant="secondary" size="small" onClick={() => void refetch()}>Retry</Button>
        </div>
      ) : student ? (
        <>
          {/* Avatar & Summary Banner */}
          <section className="profile-summary" aria-labelledby="student-profile-summary-title">
            <div className="profile-summary__user">
              <div className="profile-summary__avatar" aria-hidden="true">
                {getInitials(student.fullName)}
              </div>
              <div className="profile-summary__details">
                <div className="profile-summary__tag-row">
                  <span className="profile-summary__eyebrow">Student Account</span>
                  <span className="profile-summary__dept">{student.department}</span>
                </div>
                <h2 className="profile-summary__name" id="student-profile-summary-title">{student.fullName}</h2>
                <p className="profile-summary__reg">Reg. No: <strong>{student.registrationNumber}</strong></p>
              </div>
            </div>
            <div className="profile-summary__actions">
              <ProfileStatus status={student.approvalStatus} />
            </div>
          </section>

          {/* Quick Stats Grid */}
          <div className="profile-stats">
            <div className="profile-stat-card">
              <span className="profile-stat-card__label">Year of Study</span>
              <strong className="profile-stat-card__value">Year {student.yearOfStudy}</strong>
            </div>
            <div className="profile-stat-card">
              <span className="profile-stat-card__label">Applications</span>
              <strong className="profile-stat-card__value">{applications.length}</strong>
            </div>
            <div className="profile-stat-card">
              <span className="profile-stat-card__label">Approval Status</span>
              <strong className="profile-stat-card__value">{student.approvalStatus}</strong>
            </div>
          </div>

          {/* Interactive Navigation Tabs */}
          <nav className="profile-tabs" aria-label="Profile section tabs">
            <button
              type="button"
              className={`profile-tab ${activeTab === 'overview' ? 'profile-tab--active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              📋 Overview
            </button>
            <button
              type="button"
              className={`profile-tab ${activeTab === 'academic' ? 'profile-tab--active' : ''}`}
              onClick={() => setActiveTab('academic')}
            >
              🎓 Academic & Applications
            </button>
            <button
              type="button"
              className={`profile-tab ${activeTab === 'security' ? 'profile-tab--active' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              🛡️ Account & Security
            </button>
          </nav>

          {/* Tab 1: Overview */}
          {activeTab === 'overview' && (
            <div className="profile-grid">
              <ProfileSection title="Personal Information" description="Your registered personal details.">
                <dl className="profile-list">
                  <ProfileField label="Full Name" value={student.fullName} />
                  <ProfileField label="Email" value={student.email} />
                  <ProfileField label="Phone Number" value={student.phoneNumber} emptyText="Not provided" />
                  <ProfileField label="Gender" value={student.gender} />
                </dl>
              </ProfileSection>

              <ProfileSection title="Academic Snapshot" description="Quick summary of your current enrollment.">
                <dl className="profile-list">
                  <ProfileField label="Registration Number" value={student.registrationNumber} />
                  <ProfileField label="Department" value={student.department} />
                  <ProfileField label="Year of Study" value={`Year ${student.yearOfStudy}`} />
                </dl>
              </ProfileSection>
            </div>
          )}

          {/* Tab 2: Academic & Applications */}
          {activeTab === 'academic' && (
            <div className="profile-grid">
              <ProfileSection title="Academic Enrollment Details" description="Institutional registration record.">
                <dl className="profile-list">
                  <ProfileField label="Registration Number" value={student.registrationNumber} />
                  <ProfileField label="Department" value={student.department} />
                  <ProfileField label="Year of Study" value={`Year ${student.yearOfStudy}`} />
                  <ProfileField label="Approval Status" value={student.approvalStatus} />
                </dl>
              </ProfileSection>

              <ProfileSection title="Candidate Application History" description="Overview of election candidacy applications you have submitted.">
                {applications.length === 0 ? (
                  <div className="profile-empty-state">
                    <p>You have not submitted any candidate applications yet.</p>
                    <Link to="/student/elections" className="profile-link-btn">Browse Open Elections &rarr;</Link>
                  </div>
                ) : (
                  <div className="profile-app-list">
                    {applications.map((app) => (
                      <div key={app.candidateId} className="profile-app-item">
                        <div>
                          <h4>{app.electionTitle}</h4>
                          <span className="profile-app-item__date">Applied {formatUtcDateTime(app.createdAt)}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <CandidateStatusBadge status={app.status} />
                          {app.electionStatus && <ElectionStatusBadge status={app.electionStatus} />}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ProfileSection>
            </div>
          )}

          {/* Tab 3: Account & Security */}
          {activeTab === 'security' && (
            <div className="profile-grid">
              <ProfileSection title="Account & Identity Details" description="System privileges, account status, and utility actions.">
                <dl className="profile-list">
                  <ProfileField label="Account Role" value="Student" />
                  <ProfileField label="Approval Status" value={student.approvalStatus} />
                  <ProfileField
                    label="Registered Email"
                    value={student.email}
                    onCopy={() => handleCopy(student.email, 'email')}
                    isCopied={copiedField === 'email'}
                  />
                  <ProfileField
                    label="Registration Number"
                    value={student.registrationNumber}
                    onCopy={() => handleCopy(student.registrationNumber, 'reg')}
                    isCopied={copiedField === 'reg'}
                  />
                </dl>
              </ProfileSection>
            </div>
          )}
        </>
      ) : null}
    </main>
  )
}

import { useState } from 'react'
import { useAuth } from '@core/hooks/useAuth'
import { ProfileField } from '@features/profile/components/ProfileField'
import { ProfileSection } from '@features/profile/components/ProfileSection'
import './AdminProfilePage.scss'

type AdminTab = 'overview' | 'security'

export function AdminProfilePage() {
  const { currentUser } = useAuth()
  const [activeTab, setActiveTab] = useState<AdminTab>('overview')
  const [copied, setCopied] = useState(false)

  const handleCopyEmail = () => {
    if (currentUser?.email) {
      navigator.clipboard.writeText(currentUser.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <main className="admin-profile-page" aria-labelledby="admin-profile-title">
      <header className="page-header">
        <div>
          <p className="page-header__eyebrow">Administrator account</p>
          <h1 className="page-header__title" id="admin-profile-title">Profile</h1>
        </div>
      </header>

      <section className="profile-summary" aria-labelledby="admin-profile-summary-title">
        <div className="profile-summary__user" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              width: '3.5rem',
              height: '3.5rem',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
              color: '#fff',
              fontSize: '1.35rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(6, 182, 212, 0.4)',
            }}
            aria-hidden="true"
          >
            AD
          </div>
          <div>
            <p className="profile-summary__eyebrow" style={{ margin: 0, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.1em' }}>
              System Administrator
            </p>
            <h2 className="profile-summary__name" id="admin-profile-summary-title" style={{ margin: 0 }}>
              {currentUser?.email ?? 'Administrator'}
            </h2>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <nav className="profile-tabs" style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '0.5rem' }}>
        <button
          type="button"
          className={`profile-tab ${activeTab === 'overview' ? 'profile-tab--active' : ''}`}
          style={{
            padding: '0.5rem 1rem',
            background: activeTab === 'overview' ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
            border: activeTab === 'overview' ? '1px solid rgba(99, 102, 241, 0.3)' : 'none',
            borderRadius: '6px',
            color: activeTab === 'overview' ? '#a5b4fc' : '#94a3b8',
            fontWeight: 600,
            cursor: 'pointer',
          }}
          onClick={() => setActiveTab('overview')}
        >
          📋 Account Details
        </button>
        <button
          type="button"
          className={`profile-tab ${activeTab === 'security' ? 'profile-tab--active' : ''}`}
          style={{
            padding: '0.5rem 1rem',
            background: activeTab === 'security' ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
            border: activeTab === 'security' ? '1px solid rgba(99, 102, 241, 0.3)' : 'none',
            borderRadius: '6px',
            color: activeTab === 'security' ? '#a5b4fc' : '#94a3b8',
            fontWeight: 600,
            cursor: 'pointer',
          }}
          onClick={() => setActiveTab('security')}
        >
          🛡️ Permissions & Security
        </button>
      </nav>

      {activeTab === 'overview' && (
        <div className="profile-grid">
          <ProfileSection title="Account Information" description="Signed-in administrator details available from the current session.">
            <dl className="profile-list">
              <ProfileField
                label="Email"
                value={currentUser?.email ?? null}
                onCopy={currentUser?.email ? handleCopyEmail : undefined}
                isCopied={copied}
              />
              <ProfileField label="Role" value={currentUser?.role ?? 'Admin'} />
            </dl>
          </ProfileSection>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="profile-grid">
          <ProfileSection title="Administrative Privileges" description="Security rights granted to your active session.">
            <dl className="profile-list">
              <ProfileField label="Privilege Level" value="Full System Governance" />
              <ProfileField label="Student Oversight" value="Approve / Reject Student Registrations" />
              <ProfileField label="Election Control" value="Create, Edit, Transition & Publish Elections" />
              <ProfileField label="Candidate Vetting" value="Approve / Reject Candidate Applications" />
            </dl>
          </ProfileSection>
        </div>
      )}
    </main>
  )
}

import { useAuth } from '@core/hooks/useAuth'
import { ProfileField } from '@features/profile/components/ProfileField'
import { ProfileSection } from '@features/profile/components/ProfileSection'
import './AdminProfilePage.scss'

export function AdminProfilePage() {
  const { currentUser } = useAuth()

  return (
    <main className="admin-profile-page" aria-labelledby="admin-profile-title">
      <header className="page-header">
        <div>
          <p className="page-header__eyebrow">Administrator account</p>
          <h1 className="page-header__title" id="admin-profile-title">Profile</h1>
        </div>
      </header>

      <section className="profile-summary" aria-labelledby="admin-profile-summary-title">
        <div>
          <p className="profile-summary__eyebrow">Account</p>
          <h2 className="profile-summary__name" id="admin-profile-summary-title">{currentUser?.role ?? 'Admin'}</h2>
        </div>
      </section>

      <div className="profile-grid">
        <ProfileSection title="Account Information" description="Signed-in administrator details available from the current session.">
          <dl className="profile-list">
            <ProfileField label="Email" value={currentUser?.email ?? null} />
            <ProfileField label="Role" value={currentUser?.role ?? 'Admin'} />
          </dl>
        </ProfileSection>
      </div>
    </main>
  )
}

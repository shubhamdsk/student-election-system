import { useCurrentStudentProfile } from '@features/profile/hooks/useCurrentStudentProfile'
import { ProfileField } from '@features/profile/components/ProfileField'
import { ProfileSection } from '@features/profile/components/ProfileSection'
import { ProfileStatus } from '@features/profile/components/ProfileStatus'
import { Button } from '@shared/components/Button/Button'
import { LoadingSpinner } from '@shared/components/LoadingSpinner/LoadingSpinner'
import './StudentProfilePage.scss'

export function StudentProfilePage() {
  const { data: student, isLoading, error, refetch } = useCurrentStudentProfile()

  return (
    <main className="student-profile-page" aria-labelledby="student-profile-title">
      <header className="page-header">
        <div>
          <p className="page-header__eyebrow">Student account</p>
          <h1 className="page-header__title" id="student-profile-title">Profile</h1>
        </div>
      </header>

      {isLoading ? (
        <div className="page-state page-state--loading" role="status">
          <LoadingSpinner label="Loading your profile…" />
        </div>
      ) : error ? (
        <div className="page-state page-state--error" role="alert">
          <p>Unable to load your profile right now.</p>
          <Button variant="secondary" size="small" onClick={() => void refetch()}>Retry</Button>
        </div>
      ) : student ? (
        <>
          <section className="profile-summary" aria-labelledby="student-profile-summary-title">
            <div>
              <p className="profile-summary__eyebrow">Student</p>
              <h2 className="profile-summary__name" id="student-profile-summary-title">{student.fullName}</h2>
            </div>
            <ProfileStatus status={student.approvalStatus} />
          </section>

          <div className="profile-grid">
            <ProfileSection title="Personal Information" description="Your personal and contact details.">
              <dl className="profile-list">
                <ProfileField label="Full Name" value={student.fullName} />
                <ProfileField label="Email" value={student.email} />
                <ProfileField label="Phone Number" value={student.phoneNumber} emptyText="Not provided" />
                <ProfileField label="Gender" value={student.gender} />
              </dl>
            </ProfileSection>

            <ProfileSection title="Academic Information" description="Your registration and course details.">
              <dl className="profile-list">
                <ProfileField label="Registration Number" value={student.registrationNumber} />
                <ProfileField label="Department" value={student.department} />
                <ProfileField label="Year of Study" value={String(student.yearOfStudy)} />
              </dl>
            </ProfileSection>

            <ProfileSection title="Account Status" description="Approval status for this account.">
              <dl className="profile-list">
                <ProfileField label="Approval Status" value={student.approvalStatus} />
                <ProfileField label="Account Role" value="Student" />
              </dl>
            </ProfileSection>
          </div>
        </>
      ) : null}
    </main>
  )
}

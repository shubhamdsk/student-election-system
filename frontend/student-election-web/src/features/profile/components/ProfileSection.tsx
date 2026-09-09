import type { ProfileSectionProps } from '../types/profile.types'
import './ProfileSection.scss'

export function ProfileSection({ title, description, children }: ProfileSectionProps) {
  return (
    <section className="profile-section" aria-labelledby={title.replace(/\s+/g, '-').toLowerCase()}>
      <div className="profile-section__header">
        <div>
          <h2 className="profile-section__title" id={title.replace(/\s+/g, '-').toLowerCase()}>{title}</h2>
          {description && <p className="profile-section__description">{description}</p>}
        </div>
      </div>
      <div className="profile-section__body">{children}</div>
    </section>
  )
}

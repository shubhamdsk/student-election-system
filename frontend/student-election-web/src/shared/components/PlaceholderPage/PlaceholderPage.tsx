import './PlaceholderPage.scss'
import type { PlaceholderPageProps } from '@shared/types/component.types'

export function PlaceholderPage({ title }: PlaceholderPageProps) {
  return <section className="placeholder-page"><h2 className="placeholder-page__title">{title}</h2><p>This area is ready for feature implementation.</p></section>
}

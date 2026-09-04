import './PlaceholderPage.scss'

export function PlaceholderPage({ title }: { title: string }) {
  return <section className="placeholder-page"><h2 className="placeholder-page__title">{title}</h2><p>This area is ready for feature implementation.</p></section>
}

import { Link } from 'react-router-dom'
import './HomePage.scss'

export function HomePage() {
  return <section className="home-page"><h1 className="home-page__title">Student Election System</h1><p>Securely manage and participate in student elections.</p><Link className="home-page__action" to="/login">Sign in</Link></section>
}

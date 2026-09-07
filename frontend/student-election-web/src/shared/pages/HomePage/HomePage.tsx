// src/shared/pages/HomePage/HomePage.tsx
import { Link } from 'react-router-dom'
import { Card } from '@components/Card/Card'
import { Badge } from '@components/Badge/Badge'
import './HomePage.scss'

export function HomePage() {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="home-hero">
        <div className="home-hero__badge">
          <Badge variant="info">Next-Gen Election Portal</Badge>
          <span className="badge-text">100% Anonymous & Verifiable Voting</span>
        </div>

        <h1 className="home-hero__title">
          Empowering Student Voices with <br />
          <span className="hero-gradient">Transparent & Secure Elections</span>
        </h1>

        <p className="home-hero__subtitle">
          A modern, high-integrity platform for managing student governance elections.
          Anonymous voting, instant cryptographic verification, and real-time tallying.
        </p>

        <div className="home-hero__actions">
          <Link className="hero-btn hero-btn--primary" to="/login">
            Get Started &rarr;
          </Link>
          <Link className="hero-btn hero-btn--secondary" to="/register">
            Register Student
          </Link>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="home-features">
        <Card className="feature-card">
          <div className="feature-card__icon icon-indigo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h3 className="feature-card__title">Anonymous Ballots</h3>
          <p className="feature-card__desc">
            Votes remain completely decoupled from voter identities, maintaining full ballot anonymity.
          </p>
        </Card>

        <Card className="feature-card">
          <div className="feature-card__icon icon-violet">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          </div>
          <h3 className="feature-card__title">Real-time Tallying</h3>
          <p className="feature-card__desc">
            Automated verification and candidate vote counts published instantly when elections close.
          </p>
        </Card>

        <Card className="feature-card">
          <div className="feature-card__icon icon-cyan">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <h3 className="feature-card__title">Role-Based Access</h3>
          <p className="feature-card__desc">
            Admin oversight for election control and nomination approval, with seamless student participation.
          </p>
        </Card>
      </section>
    </div>
  )
}

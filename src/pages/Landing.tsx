import {
  BarChart3,
  CalendarCheck,
  Menu,
  Moon,
  Sun,
  Users,
  Workflow,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { DashboardMock } from '../components/landing/DashboardMock'
import { Button } from '../components/ui/Button'
import { Logo } from '../components/ui/Logo'
import { useApp } from '../context/AppContext'
import { usePageTitle } from '../lib/hooks'

const features = [
  {
    title: 'Contact Management',
    body: 'Keep customer information organized and accessible.',
    icon: Users,
  },
  {
    title: 'Sales Pipeline',
    body: 'Track every opportunity from lead to close.',
    icon: Workflow,
  },
  {
    title: 'Smart Tasks',
    body: 'Stay ahead of follow-ups and important activities.',
    icon: CalendarCheck,
  },
  {
    title: 'Analytics',
    body: "Understand your team's performance with real-time insights.",
    icon: BarChart3,
  },
  {
    title: 'Team Collaboration',
    body: 'Keep your sales team aligned.',
    icon: Users,
  },
  {
    title: 'Reports',
    body: 'Turn sales data into actionable insights.',
    icon: BarChart3,
  },
]

export function Landing() {
  const { theme, setTheme } = useApp()
  const [menuOpen, setMenuOpen] = useState(false)
  usePageTitle('NEXORA CRM — Turn relationships into revenue')

  return (
    <div className="marketing">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="m-header">
        <Link to="/" aria-label="NEXORA CRM">
          <Logo />
        </Link>
        <nav className={menuOpen ? 'm-nav open' : 'm-nav'} aria-label="Marketing">
          <a href="#features" onClick={() => setMenuOpen(false)}>
            Features
          </a>
          <a href="#preview" onClick={() => setMenuOpen(false)}>
            Product
          </a>
          <a href="#preview" onClick={() => setMenuOpen(false)}>
            Analytics
          </a>
          <Link to="/help" onClick={() => setMenuOpen(false)}>
            Help
          </Link>
        </nav>
        <div className="m-actions">
          <button
            type="button"
            className="icon-btn"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <Button to="/dashboard" variant="secondary" className="desktop-only">
            View Demo
          </Button>
          <Button to="/dashboard">Start Free</Button>
          <button
            type="button"
            className="icon-btn mobile-only"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      <main id="main">
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">NEXORA CRM</p>
            <h1>
              Turn relationships into <span className="gradient-text">revenue.</span>
            </h1>
            <p className="lede">
              NEXORA CRM helps modern teams manage contacts, track deals, automate follow-ups, and understand
              their sales pipeline from one powerful workspace.
            </p>
            <div className="hero-actions">
              <Button to="/dashboard">Start Free</Button>
              <Button to="/dashboard" variant="secondary">
                View Demo
              </Button>
            </div>
            <dl className="trust-metrics">
              <div>
                <dt>Revenue tracked</dt>
                <dd>$284,500</dd>
              </div>
              <div>
                <dt>Active deals</dt>
                <dd>48</dd>
              </div>
              <div>
                <dt>Conversion</dt>
                <dd>24.8%</dd>
              </div>
            </dl>
          </div>
          <div className="hero-visual">
            <DashboardMock />
          </div>
        </section>

        <section id="features" className="section">
          <div className="section-head">
            <h2>Everything your team needs to grow.</h2>
            <p>One workspace for the conversations, pipeline, and follow-through that move revenue.</p>
          </div>
          <div className="feature-grid">
            {features.map((feature) => (
              <article key={feature.title} className="feature-card">
                <span className="feature-icon" aria-hidden="true">
                  <feature.icon size={18} />
                </span>
                <h3>{feature.title}</h3>
                <p>{feature.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="preview" className="section preview-section">
          <div className="section-head">
            <h2>A dashboard your forecast can live in.</h2>
            <p>Revenue, active deals, new contacts, and the work due today — visible before the first meeting.</p>
          </div>
          <figure className="preview-frame">
            <DashboardMock />
            <figcaption className="sr-only">
              Preview of the NEXORA dashboard with revenue, active deals, new contacts, conversion rate, a sales
              chart, recent deals, and tasks.
            </figcaption>
          </figure>
        </section>

        <section className="cta-band">
          <div>
            <h2>Your sales team deserves a smarter workspace.</h2>
            <p>Open the demo workspace and walk the pipeline the way a revenue team would.</p>
          </div>
          <Button to="/dashboard">Explore NEXORA CRM</Button>
        </section>
      </main>

      <footer className="m-footer">
        <Logo />
        <p>Frontend demo workspace. No account, backend, or live sending.</p>
        <div className="row">
          <Link to="/dashboard">Demo</Link>
          <a href="#features">Features</a>
          <Link to="/help">Help</Link>
        </div>
      </footer>
    </div>
  )
}

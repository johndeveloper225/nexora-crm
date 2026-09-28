import { Moon, Sun } from 'lucide-react'
import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import { Avatar } from '../components/ui/Avatar'
import { Button } from '../components/ui/Button'
import { Toggle } from '../components/ui/Toggle'
import { useApp } from '../context/AppContext'
import { fullName } from '../lib/format'
import { usePageTitle } from '../lib/hooks'
import type { CompanyProfile, UserProfile } from '../types'

const sections = [
  { id: 'profile', label: 'Profile' },
  { id: 'company', label: 'Company' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'appearance', label: 'Appearance' },
]

export function Settings() {
  const {
    profile,
    companyProfile,
    prefs,
    theme,
    setTheme,
    updateProfile,
    updateCompanyProfile,
    updatePrefs,
    resetWorkspace,
    pushToast,
  } = useApp()
  const [draft, setDraft] = useState<UserProfile>(profile)
  const [company, setCompany] = useState<CompanyProfile>(companyProfile)
  usePageTitle('Settings · NEXORA CRM')

  useEffect(() => {
    setDraft(profile)
  }, [profile])

  useEffect(() => {
    setCompany(companyProfile)
  }, [companyProfile])

  function onAvatar(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = () => setDraft((current) => ({ ...current, avatarUrl: String(reader.result) }))
    reader.readAsDataURL(file)
  }

  function saveProfile(event: FormEvent) {
    event.preventDefault()
    if (!draft.firstName.trim() || !draft.lastName.trim() || !draft.email.includes('@')) {
      pushToast('Add a name and valid email before saving.', 'info')
      return
    }
    updateProfile({ ...draft, firstName: draft.firstName.trim(), lastName: draft.lastName.trim() })
    pushToast('Profile saved')
  }

  function saveCompany(event: FormEvent) {
    event.preventDefault()
    updateCompanyProfile(company)
    pushToast('Company details saved')
  }

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>Settings</h1>
          <p>Profile, company, notifications, and appearance for this preview workspace.</p>
        </div>
      </header>
      <div className="settings-layout">
        <nav className="settings-nav" aria-label="Settings sections">
          {sections.map((section) => (
            <a key={section.id} href={`#${section.id}`}>
              {section.label}
            </a>
          ))}
        </nav>
        <div className="stack">
          <section id="profile" className="card settings-section">
            <h2>Profile</h2>
            <form onSubmit={saveProfile} className="stack-sm">
              <div className="profile-row">
                <Avatar name={fullName(draft)} src={draft.avatarUrl || undefined} size="lg" />
                <label className="file-btn">
                  Profile image
                  <input type="file" accept="image/*" onChange={onAvatar} />
                </label>
              </div>
              <div className="field-grid">
                <label className="field">
                  Name
                  <input
                    className="input"
                    aria-label="First name"
                    value={draft.firstName}
                    onChange={(event) => setDraft((current) => ({ ...current, firstName: event.target.value }))}
                  />
                </label>
                <label className="field">
                  Last name
                  <input
                    className="input"
                    aria-label="Last name"
                    value={draft.lastName}
                    onChange={(event) => setDraft((current) => ({ ...current, lastName: event.target.value }))}
                  />
                </label>
                <label className="field">
                  Email
                  <input
                    className="input"
                    type="email"
                    value={draft.email}
                    onChange={(event) => setDraft((current) => ({ ...current, email: event.target.value }))}
                  />
                </label>
                <label className="field">
                  Phone
                  <input
                    className="input"
                    value={draft.phone}
                    onChange={(event) => setDraft((current) => ({ ...current, phone: event.target.value }))}
                  />
                </label>
              </div>
              <Button type="submit">Save profile</Button>
            </form>
          </section>

          <section id="company" className="card settings-section">
            <h2>Company</h2>
            <form onSubmit={saveCompany} className="field-grid">
              <label className="field">
                Company name
                <input
                  className="input"
                  value={company.name}
                  onChange={(event) => setCompany((current) => ({ ...current, name: event.target.value }))}
                />
              </label>
              <label className="field">
                Industry
                <input
                  className="input"
                  value={company.industry}
                  onChange={(event) => setCompany((current) => ({ ...current, industry: event.target.value }))}
                />
              </label>
              <label className="field">
                Company size
                <select
                  className="input"
                  value={company.size}
                  onChange={(event) => setCompany((current) => ({ ...current, size: event.target.value }))}
                >
                  {['1–10', '11–24', '25–50', '51–200', '201–500', '500+'].map((size) => (
                    <option key={size}>{size}</option>
                  ))}
                </select>
              </label>
              <label className="field">
                Website
                <input
                  className="input"
                  value={company.website}
                  onChange={(event) => setCompany((current) => ({ ...current, website: event.target.value }))}
                />
              </label>
              <div className="span-2">
                <Button type="submit">Save company</Button>
              </div>
            </form>
          </section>

          <section id="notifications" className="card settings-section">
            <h2>Notifications</h2>
            <div className="pref-list">
              <Pref
                label="Email notifications"
                description="A daily digest of assignments and pipeline changes."
                checked={prefs.email}
                onChange={(email) => updatePrefs({ ...prefs, email })}
              />
              <Pref
                label="Task reminders"
                description="Alerts when a follow-up is due today."
                checked={prefs.tasks}
                onChange={(tasks) => updatePrefs({ ...prefs, tasks })}
              />
              <Pref
                label="Deal updates"
                description="Stage changes on deals you own."
                checked={prefs.deals}
                onChange={(deals) => updatePrefs({ ...prefs, deals })}
              />
              <Pref
                label="Weekly reports"
                description="Monday summary of revenue and win rate."
                checked={prefs.reports}
                onChange={(reports) => updatePrefs({ ...prefs, reports })}
              />
            </div>
          </section>

          <section id="appearance" className="card settings-section">
            <h2>Appearance</h2>
            <div className="theme-choices">
              <button
                type="button"
                className={theme === 'light' ? 'choice on' : 'choice'}
                onClick={() => setTheme('light')}
                aria-pressed={theme === 'light'}
              >
                <Sun size={18} />
                <strong>Light mode</strong>
                <span>White surfaces, navy text, blue accents.</span>
              </button>
              <button
                type="button"
                className={theme === 'dark' ? 'choice on' : 'choice'}
                onClick={() => setTheme('dark')}
                aria-pressed={theme === 'dark'}
              >
                <Moon size={18} />
                <strong>Dark mode</strong>
                <span>Deep navy canvas with bright blue highlights.</span>
              </button>
            </div>
          </section>

          <section className="card settings-section">
            <h2>Workspace</h2>
            <p className="muted">
              This preview stores changes in the browser session. Resetting restores the original demo accounts,
              deals, and tasks.
            </p>
            <Button
              variant="secondary"
              onClick={() => {
                resetWorkspace()
                pushToast('Demo data restored', 'info')
              }}
            >
              Reset demo data
            </Button>
          </section>
        </div>
      </div>
    </div>
  )
}

function Pref({
  label,
  description,
  checked,
  onChange,
}: {
  label: string
  description: string
  checked: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <div className="pref">
      <div>
        <strong>{label}</strong>
        <p className="muted">{description}</p>
      </div>
      <Toggle checked={checked} onChange={onChange} label={label} />
    </div>
  )
}

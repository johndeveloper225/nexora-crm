import { Building2, MapPin, Search } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Badge } from '../components/ui/Badge'
import { Modal } from '../components/ui/Modal'
import { EmptyState } from '../components/ui/EmptyState'
import { useApp } from '../context/AppContext'
import { formatEmployees, fullName, money } from '../lib/format'
import { usePageTitle } from '../lib/hooks'
import type { Company } from '../types'

export function Companies() {
  const { companies, contacts, deals } = useApp()
  const [params, setParams] = useSearchParams()
  const [query, setQuery] = useState('')
  const [industry, setIndustry] = useState('All')
  const [selectedId, setSelectedId] = useState<string | null>(params.get('company'))
  usePageTitle('Companies · NEXORA CRM')

  useEffect(() => {
    setSelectedId(params.get('company'))
  }, [params])

  const industries = useMemo(
    () => ['All', ...Array.from(new Set(companies.map((company) => company.industry))).sort()],
    [companies],
  )

  const filtered = companies.filter((company) => {
    const needle = query.trim().toLowerCase()
    const matchesIndustry = industry === 'All' || company.industry === industry
    const haystack = `${company.name} ${company.industry} ${company.owner} ${company.location}`.toLowerCase()
    return matchesIndustry && haystack.includes(needle)
  })

  const selected = companies.find((company) => company.id === selectedId) ?? null

  function openCompany(company: Company) {
    setSelectedId(company.id)
    setParams({ company: company.id })
  }

  function closeCompany() {
    setSelectedId(null)
    setParams({})
  }

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>Companies</h1>
          <p>Accounts, ownership, and the deals attached to each relationship.</p>
        </div>
      </header>
      <div className="toolbar">
        <label className="search-field">
          <Search size={16} />
          <span className="sr-only">Search companies</span>
          <input
            value={query}
            placeholder="Search companies, industries, or owners"
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <label className="filter-select">
          <span className="sr-only">Filter by industry</span>
          <select className="input" value={industry} onChange={(event) => setIndustry(event.target.value)}>
            {industries.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
      </div>
      {filtered.length === 0 ? (
        <EmptyState
          icon={<Building2 size={18} />}
          title="No companies found"
          description="Try another industry or search for an account already in this workspace."
        />
      ) : (
        <div className="company-grid">
          {filtered.map((company) => {
            const activeDeals = deals.filter(
              (deal) => deal.companyId === company.id && deal.stage !== 'Won' && deal.stage !== 'Lost',
            )
            return (
              <button key={company.id} type="button" className="company-card" onClick={() => openCompany(company)}>
                <div className="spread">
                  <span className="company-mark" aria-hidden="true">
                    {company.name.slice(0, 1)}
                  </span>
                  <Badge>{company.industry}</Badge>
                </div>
                <h2>{company.name}</h2>
                <p className="muted row">
                  <MapPin size={14} /> {company.location}
                </p>
                <dl>
                  <div>
                    <dt>Employees</dt>
                    <dd>{formatEmployees(company.employees)}</dd>
                  </div>
                  <div>
                    <dt>Revenue</dt>
                    <dd>{company.revenue}</dd>
                  </div>
                  <div>
                    <dt>Active deals</dt>
                    <dd>{activeDeals.length}</dd>
                  </div>
                  <div>
                    <dt>Account owner</dt>
                    <dd>{company.owner}</dd>
                  </div>
                </dl>
              </button>
            )
          })}
        </div>
      )}
      <CompanyDialog company={selected} contacts={contacts} deals={deals} onClose={closeCompany} />
    </div>
  )
}

function CompanyDialog({
  company,
  contacts,
  deals,
  onClose,
}: {
  company: Company | null
  contacts: ReturnType<typeof useApp>['contacts']
  deals: ReturnType<typeof useApp>['deals']
  onClose: () => void
}) {
  const people = company ? contacts.filter((contact) => contact.companyId === company.id) : []
  const related = company ? deals.filter((deal) => deal.companyId === company.id) : []
  return (
    <Modal open={Boolean(company)} title={company?.name ?? 'Company'} onClose={onClose}>
      {company ? (
        <div className="stack-sm">
          <p>{company.about}</p>
          <dl className="info-list">
            <div>
              <dt>Industry</dt>
              <dd>{company.industry}</dd>
            </div>
            <div>
              <dt>Employees</dt>
              <dd>{formatEmployees(company.employees)}</dd>
            </div>
            <div>
              <dt>Revenue</dt>
              <dd>{company.revenue}</dd>
            </div>
            <div>
              <dt>Account owner</dt>
              <dd>{company.owner}</dd>
            </div>
            <div>
              <dt>Location</dt>
              <dd>{company.location}</dd>
            </div>
            <div>
              <dt>Website</dt>
              <dd>{company.website || 'Not specified'}</dd>
            </div>
          </dl>
          <h3>People</h3>
          {people.length === 0 ? (
            <p className="muted">No contacts are linked to this account yet.</p>
          ) : (
            <ul className="mini-list">
              {people.map((person) => (
                <li key={person.id}>
                  <div>
                    <strong>{fullName(person)}</strong>
                    <small>
                      {person.title} · {person.status}
                    </small>
                  </div>
                  <a href={`mailto:${person.email}`}>{person.email}</a>
                </li>
              ))}
            </ul>
          )}
          <h3>Deals</h3>
          {related.length === 0 ? (
            <p className="muted">No deals are recorded for this account.</p>
          ) : (
            <ul className="mini-list">
              {related.map((deal) => (
                <li key={deal.id}>
                  <div>
                    <strong>{deal.name}</strong>
                    <small>
                      {deal.stage} · {deal.owner}
                    </small>
                  </div>
                  <b>{money(deal.value)}</b>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </Modal>
  )
}

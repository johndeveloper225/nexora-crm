import { Building2, Handshake, ListChecks, Search, Users } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { fullName } from '../../lib/format'
import { Modal } from '../ui/Modal'
import { EmptyState } from '../ui/EmptyState'

interface Hit {
  id: string
  group: string
  title: string
  meta: string
  to: string
}

export function SearchModal() {
  const { searchOpen, setSearchOpen, contacts, companies, deals, tasks } = useApp()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [debounced, setDebounced] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(query), 140)
    return () => window.clearTimeout(timer)
  }, [query])

  useEffect(() => {
    if (!searchOpen) return
    setQuery('')
    setDebounced('')
    setActive(0)
    const timer = window.setTimeout(() => inputRef.current?.focus(), 30)
    return () => window.clearTimeout(timer)
  }, [searchOpen])

  const pending = query.trim() !== debounced.trim()
  const needle = debounced.trim().toLowerCase()

  const hits = useMemo<Hit[]>(() => {
    const contactHits = contacts
      .filter((contact) =>
        `${fullName(contact)} ${contact.email} ${contact.company}`.toLowerCase().includes(needle),
      )
      .slice(0, needle ? 6 : 3)
      .map((contact) => ({
        id: contact.id,
        group: 'Contacts',
        title: fullName(contact),
        meta: `${contact.company} · ${contact.status}`,
        to: `/contacts/${contact.id}`,
      }))
    const companyHits = companies
      .filter((company) =>
        `${company.name} ${company.industry} ${company.owner}`.toLowerCase().includes(needle),
      )
      .slice(0, needle ? 6 : 3)
      .map((company) => ({
        id: company.id,
        group: 'Companies',
        title: company.name,
        meta: `${company.industry} · ${company.location}`,
        to: `/companies?company=${company.id}`,
      }))
    const dealHits = deals
      .filter((deal) => `${deal.name} ${deal.company} ${deal.owner}`.toLowerCase().includes(needle))
      .slice(0, needle ? 6 : 3)
      .map((deal) => ({
        id: deal.id,
        group: 'Deals',
        title: deal.name,
        meta: `${deal.company} · ${deal.stage}`,
        to: `/deals?q=${encodeURIComponent(deal.name)}`,
      }))
    const taskHits = tasks
      .filter((task) => `${task.title} ${task.related} ${task.owner}`.toLowerCase().includes(needle))
      .slice(0, needle ? 6 : 3)
      .map((task) => ({
        id: task.id,
        group: 'Tasks',
        title: task.title,
        meta: `${task.related} · ${task.priority}`,
        to: `/tasks?q=${encodeURIComponent(task.title)}`,
      }))
    return [...contactHits, ...companyHits, ...dealHits, ...taskHits]
  }, [companies, contacts, deals, needle, tasks])

  useEffect(() => {
    setActive(0)
  }, [needle])

  function openHit(hit: Hit) {
    navigate(hit.to)
    setSearchOpen(false)
  }

  const groups = ['Contacts', 'Companies', 'Deals', 'Tasks']
    .map((group) => ({ group, items: hits.filter((hit) => hit.group === group) }))
    .filter((group) => group.items.length > 0)

  return (
    <Modal open={searchOpen} title="Search the workspace" onClose={() => setSearchOpen(false)}>
      <div className="search-modal" role="search">
        <label className="sr-only" htmlFor="global-search">
          Search contacts, companies, deals, and tasks
        </label>
        <div className="search-input">
          <Search size={16} />
          <input
            id="global-search"
            ref={inputRef}
            value={query}
            placeholder="Search contacts, companies, deals, tasks"
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'ArrowDown') {
                event.preventDefault()
                setActive((index) => Math.min(index + 1, Math.max(hits.length - 1, 0)))
              }
              if (event.key === 'ArrowUp') {
                event.preventDefault()
                setActive((index) => Math.max(index - 1, 0))
              }
              if (event.key === 'Enter' && hits[active]) {
                event.preventDefault()
                openHit(hits[active])
              }
            }}
          />
        </div>
        {pending ? (
          <div className="search-skeleton" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        ) : groups.length === 0 ? (
          <EmptyState
            icon={<Search size={18} />}
            title="No matches"
            description="Try a contact, company, deal, or task from this workspace."
          />
        ) : (
          <div className="search-results">
            {groups.map((group) => (
              <section key={group.group}>
                <h3>{group.group}</h3>
                <ul>
                  {group.items.map((hit) => {
                    const index = hits.findIndex((item) => item.id === hit.id && item.group === hit.group)
                    const Icon =
                      group.group === 'Contacts'
                        ? Users
                        : group.group === 'Companies'
                          ? Building2
                          : group.group === 'Deals'
                            ? Handshake
                            : ListChecks
                    return (
                      <li key={`${hit.group}-${hit.id}`}>
                        <button
                          type="button"
                          className={index === active ? 'search-hit active' : 'search-hit'}
                          onMouseEnter={() => setActive(index)}
                          onClick={() => openHit(hit)}
                        >
                          <Icon size={16} />
                          <span>
                            <strong>{hit.title}</strong>
                            <small>{hit.meta}</small>
                          </span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </section>
            ))}
          </div>
        )}
      </div>
    </Modal>
  )
}

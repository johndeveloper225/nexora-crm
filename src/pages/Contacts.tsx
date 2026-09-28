import { Plus, Search } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ContactModal } from '../components/contacts/ContactModal'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { DataTable } from '../components/ui/DataTable'
import { EmptyState } from '../components/ui/EmptyState'
import { useApp } from '../context/AppContext'
import { formatDate, fullName, telHref } from '../lib/format'
import { usePageTitle } from '../lib/hooks'
import type { Contact, ContactStatus } from '../types'

const filters = ['All', 'Leads', 'Customers', 'Prospects'] as const
const statusMap: Record<string, ContactStatus | 'All'> = {
  All: 'All',
  Leads: 'Lead',
  Customers: 'Customer',
  Prospects: 'Prospect',
}

const PAGE_SIZE = 8

export function Contacts() {
  const { contacts } = useApp()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<(typeof filters)[number]>('All')
  const [page, setPage] = useState(1)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Contact | null>(null)
  usePageTitle('Contacts · NEXORA CRM')

  useEffect(() => {
    setPage(1)
  }, [query, filter])

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    const status = statusMap[filter]
    return contacts.filter((contact) => {
      const matchesStatus = status === 'All' || contact.status === status
      const haystack = `${fullName(contact)} ${contact.company} ${contact.email} ${contact.owner}`.toLowerCase()
      return matchesStatus && haystack.includes(needle)
    })
  }, [contacts, filter, query])

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const rows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>Contacts</h1>
          <p>Manage relationships and keep your customer information organized.</p>
        </div>
        <Button
          icon={<Plus size={16} />}
          onClick={() => {
            setEditing(null)
            setOpen(true)
          }}
        >
          Add Contact
        </Button>
      </header>

      <div className="toolbar">
        <label className="search-field">
          <Search size={16} />
          <span className="sr-only">Search contacts</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name, company, or email"
          />
        </label>
        <div className="chip-row" role="tablist" aria-label="Contact status">
          {filters.map((item) => (
            <button
              key={item}
              type="button"
              role="tab"
              aria-selected={filter === item}
              className={filter === item ? 'chip active' : 'chip'}
              onClick={() => setFilter(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <section className="card table-card">
        {filtered.length === 0 ? (
          <EmptyState
            icon={<Search size={18} />}
            title="No contacts found"
            description="Adjust the search or create a contact to keep this relationship in the workspace."
            action={
              <Button
                onClick={() => {
                  setEditing(null)
                  setOpen(true)
                }}
              >
                Add Contact
              </Button>
            }
          />
        ) : (
          <>
            <DataTable
              rows={rows}
              getRowId={(row) => row.id}
              onRowClick={(row) => navigate(`/contacts/${row.id}`)}
              columns={[
                {
                  key: 'name',
                  header: 'Name',
                  render: (row) => (
                    <span className="cell-title">
                      <strong>{fullName(row)}</strong>
                      <small>{row.title}</small>
                    </span>
                  ),
                },
                { key: 'company', header: 'Company', render: (row) => row.company },
                {
                  key: 'email',
                  header: 'Email',
                  render: (row) => (
                    <a href={`mailto:${row.email}`} onClick={(event) => event.stopPropagation()}>
                      {row.email}
                    </a>
                  ),
                },
                {
                  key: 'phone',
                  header: 'Phone',
                  render: (row) => (
                    <a href={telHref(row.phone)} onClick={(event) => event.stopPropagation()}>
                      {row.phone}
                    </a>
                  ),
                },
                {
                  key: 'status',
                  header: 'Status',
                  render: (row) => <Badge>{row.status}</Badge>,
                },
                { key: 'owner', header: 'Owner', render: (row) => row.owner },
                {
                  key: 'last',
                  header: 'Last Contacted',
                  render: (row) => formatDate(row.lastContacted),
                },
                {
                  key: 'actions',
                  header: 'Actions',
                  render: (row) => (
                    <span className="row-actions" onClick={(event) => event.stopPropagation()}>
                      <button type="button" className="text-btn" onClick={() => navigate(`/contacts/${row.id}`)}>
                        View
                      </button>
                      <button
                        type="button"
                        className="text-btn"
                        onClick={() => {
                          setEditing(row)
                          setOpen(true)
                        }}
                      >
                        Edit
                      </button>
                    </span>
                  ),
                },
              ]}
            />
            <div className="pager">
              <span className="muted">
                {filtered.length} contact{filtered.length === 1 ? '' : 's'}
              </span>
              <div className="row">
                <button type="button" className="btn btn-secondary btn-sm" disabled={page === 1} onClick={() => setPage((value) => value - 1)}>
                  Previous
                </button>
                <span>
                  {page} / {pages}
                </span>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  disabled={page === pages}
                  onClick={() => setPage((value) => value + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </section>
      <ContactModal open={open} contact={editing} onClose={() => setOpen(false)} />
    </div>
  )
}

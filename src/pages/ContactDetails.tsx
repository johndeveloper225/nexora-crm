import { Mail, Phone, Plus } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ContactModal } from '../components/contacts/ContactModal'
import { Avatar } from '../components/ui/Avatar'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { useApp } from '../context/AppContext'
import { formatDate, fullName, money, telHref } from '../lib/format'
import { usePageTitle } from '../lib/hooks'

const tabs = ['Overview', 'Activity', 'Notes', 'Deals'] as const

export function ContactDetails() {
  const { id } = useParams()
  const { contacts, deals, activities, notes, addNote, pushToast } = useApp()
  const contact = contacts.find((item) => item.id === id)
  const [tab, setTab] = useState<(typeof tabs)[number]>('Overview')
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  usePageTitle(contact ? `${fullName(contact)} · NEXORA CRM` : 'Contact · NEXORA CRM')

  if (!contact) {
    return (
      <div className="page">
        <EmptyState
          title="Contact not found"
          description="This contact is not in the current workspace. It may have been reset with the demo data."
          action={
            <Button to="/contacts" variant="secondary">
              Back to contacts
            </Button>
          }
        />
      </div>
    )
  }

  const name = fullName(contact)
  const relatedDeals = deals.filter((deal) => deal.companyId === contact.companyId)
  const relatedActivity = activities.filter((item) => item.contactId === contact.id)
  const activity =
    relatedActivity.length > 0
      ? relatedActivity
      : [
          {
            id: 'synthetic',
            actor: contact.owner,
            text: `last reached ${name}.`,
            time: formatDate(contact.lastContacted),
            type: 'call' as const,
          },
        ]
  const relatedNotes = notes.filter((note) => note.contactId === contact.id)
  const openValue = relatedDeals
    .filter((deal) => deal.stage !== 'Won' && deal.stage !== 'Lost')
    .reduce((sum, deal) => sum + deal.value, 0)

  function saveNote(event: FormEvent) {
    event.preventDefault()
    if (!draft.trim()) return
    addNote(contact!.id, draft)
    setDraft('')
    pushToast('Note added')
  }

  return (
    <div className="page">
      <header className="detail-hero card">
        <Avatar name={name} size="lg" alt="" />
        <div className="detail-copy">
          <p className="eyebrow">
            <Link to="/contacts">Contacts</Link> / {contact.company}
          </p>
          <h1>{name}</h1>
          <p>
            {contact.title} · {contact.company}
          </p>
          <div className="row wrap">
            <Badge>{contact.status}</Badge>
            <span className="muted">Owner {contact.owner}</span>
          </div>
        </div>
        <Button variant="secondary" onClick={() => setEditing(true)}>
          Edit Contact
        </Button>
      </header>

      <div className="stat-row">
        <article>
          <span>Open pipeline</span>
          <strong>{money(openValue)}</strong>
        </article>
        <article>
          <span>Associated deals</span>
          <strong>{relatedDeals.length}</strong>
        </article>
        <article>
          <span>Last contacted</span>
          <strong>{formatDate(contact.lastContacted)}</strong>
        </article>
      </div>

      <div className="tabs" role="tablist" aria-label="Contact sections">
        {tabs.map((item) => (
          <button
            key={item}
            type="button"
            role="tab"
            aria-selected={tab === item}
            className={tab === item ? 'tab active' : 'tab'}
            onClick={() => setTab(item)}
          >
            {item}
          </button>
        ))}
      </div>

      {tab === 'Overview' ? (
        <div className="detail-grid">
          <section className="card">
            <h2>Contact Information</h2>
            <dl className="info-list">
              <div>
                <dt>Email</dt>
                <dd>
                  <a href={`mailto:${contact.email}`}>
                    <Mail size={14} /> {contact.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt>Phone</dt>
                <dd>
                  <a href={telHref(contact.phone)}>
                    <Phone size={14} /> {contact.phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt>Company</dt>
                <dd>{contact.company}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>{contact.status}</dd>
              </div>
              <div>
                <dt>Owner</dt>
                <dd>{contact.owner}</dd>
              </div>
            </dl>
          </section>
          <section className="card">
            <h2>Recent Activity</h2>
            <ol className="timeline">
              {activity.slice(0, 4).map((item) => (
                <li key={item.id} className="timeline-item">
                  <span className={`timeline-dot ${item.type}`} />
                  <div>
                    <p>
                      <strong>{item.actor}</strong> {item.text}
                    </p>
                    <time className="muted">{item.time}</time>
                  </div>
                </li>
              ))}
            </ol>
          </section>
          <section className="card">
            <h2>Associated Deals</h2>
            <DealList deals={relatedDeals.slice(0, 3)} />
          </section>
          <section className="card">
            <h2>Notes</h2>
            {contact.notes ? <p>{contact.notes}</p> : <p className="muted">No profile note yet.</p>}
            {relatedNotes[0] ? (
              <blockquote>
                <p>{relatedNotes[0].body}</p>
                <footer>
                  {relatedNotes[0].author} · {formatDate(relatedNotes[0].createdAt)}
                </footer>
              </blockquote>
            ) : null}
          </section>
        </div>
      ) : null}

      {tab === 'Activity' ? (
        <section className="card">
          <h2>Activity</h2>
          <ol className="timeline">
            {activity.map((item) => (
              <li key={item.id} className="timeline-item">
                <span className={`timeline-dot ${item.type}`} />
                <div>
                  <p>
                    <strong>{item.actor}</strong> {item.text}
                  </p>
                  <time className="muted">{item.time}</time>
                </div>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {tab === 'Notes' ? (
        <section className="card stack-sm">
          <h2>Notes</h2>
          <form className="note-form" onSubmit={saveNote}>
            <label htmlFor="new-note" className="sr-only">
              Add a note
            </label>
            <textarea
              id="new-note"
              className="input textarea"
              rows={3}
              value={draft}
              placeholder="Log a call, objection, or next step."
              onChange={(event) => setDraft(event.target.value)}
            />
            <Button type="submit" icon={<Plus size={16} />}>
              Add Note
            </Button>
          </form>
          {relatedNotes.length === 0 && !contact.notes ? (
            <EmptyState title="No notes yet" description="Add context from the last conversation so the next owner can pick it up." />
          ) : (
            <ul className="note-list">
              {contact.notes ? (
                <li>
                  <p>{contact.notes}</p>
                  <footer>Profile note</footer>
                </li>
              ) : null}
              {relatedNotes.map((note) => (
                <li key={note.id}>
                  <p>{note.body}</p>
                  <footer>
                    {note.author} · {formatDate(note.createdAt)}
                  </footer>
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : null}

      {tab === 'Deals' ? (
        <section className="card">
          <div className="card-head">
            <h2>Deals</h2>
            <Button to="/deals" variant="secondary" size="sm">
              Go to pipeline
            </Button>
          </div>
          {relatedDeals.length === 0 ? (
            <EmptyState
              title="No deals found"
              description="Create your first deal to start tracking your sales pipeline."
              action={
                <Button to="/deals">Create Deal</Button>
              }
            />
          ) : (
            <DealList deals={relatedDeals} />
          )}
        </section>
      ) : null}

      <ContactModal open={editing} contact={contact} onClose={() => setEditing(false)} />
    </div>
  )
}

function DealList({ deals }: { deals: ReturnType<typeof useApp>['deals'] }) {
  if (deals.length === 0) return <p className="muted">No open or historical deals for this company yet.</p>
  return (
    <ul className="mini-list">
      {deals.map((deal) => (
        <li key={deal.id}>
          <div>
            <strong>{deal.name}</strong>
            <small>
              {deal.stage} · {deal.probability}% · {deal.owner}
            </small>
          </div>
          <b>{money(deal.value)}</b>
        </li>
      ))}
    </ul>
  )
}

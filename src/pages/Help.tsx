import { usePageTitle } from '../lib/hooks'

const articles = [
  {
    title: 'Move through the workspace',
    body: 'Use the sidebar for dashboard, contacts, companies, deals, tasks, calendar, and reports. On a smaller screen, open the same destinations from the menu button.',
  },
  {
    title: 'Contacts and companies',
    body: 'Search the contact table, filter by lead, customer, or prospect, and open a record for activity, notes, and associated deals. New contacts stay in this browser session.',
  },
  {
    title: 'Pipeline',
    body: 'Drag a deal card into another stage or use the stage menu on the card. Create a deal with value, probability, owner, and an expected close date.',
  },
  {
    title: 'Tasks and calendar',
    body: 'Mark work complete, add a follow-up, or remove one. The calendar shows meetings, follow-ups, and tasks for the day you select. Switch between month, week, and day.',
  },
  {
    title: 'Search and notifications',
    body: 'Press Ctrl K or click the search bar to look across contacts, companies, deals, and tasks. The bell keeps assignment, stage, and deadline notices. Mark them read individually or all at once.',
  },
  {
    title: 'Appearance',
    body: 'Light and dark mode are in Settings and in the account menu. The choice stays with you while you move between pages in this session.',
  },
]

export function Help() {
  usePageTitle('Help · NEXORA CRM')
  return (
    <div className="page help-page">
      <header className="page-header">
        <div>
          <h1>Help</h1>
          <p>A short guide to the NEXORA preview workspace. Nothing here leaves the browser.</p>
        </div>
      </header>
      <div className="help-grid">
        {articles.map((article) => (
          <article key={article.title} className="card">
            <h2>{article.title}</h2>
            <p>{article.body}</p>
          </article>
        ))}
      </div>
      <section className="card">
        <h2>Keyboard</h2>
        <ul className="shortcut-list">
          <li>
            <kbd>Ctrl</kbd> + <kbd>K</kbd>
            <span>Open search</span>
          </li>
          <li>
            <kbd>Esc</kbd>
            <span>Close dialogs, search, and menus</span>
          </li>
          <li>
            <kbd>Enter</kbd>
            <span>Open the highlighted search result</span>
          </li>
        </ul>
      </section>
    </div>
  )
}

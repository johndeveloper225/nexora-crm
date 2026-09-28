import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { usePageTitle } from '../lib/hooks'

export function NotFound() {
  usePageTitle('Page not found · NEXORA CRM')
  return (
    <div className="not-found">
      <p className="eyebrow">404</p>
      <h1>That page is not in this workspace.</h1>
      <p>The link may be out of date. Head back to the product story or the live demo.</p>
      <div className="row">
        <Button to="/">Back home</Button>
        <Button to="/dashboard" variant="secondary">
          Open demo
        </Button>
      </div>
      <Link to="/help" className="text-btn">
        Help center
      </Link>
    </div>
  )
}

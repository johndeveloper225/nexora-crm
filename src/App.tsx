import { Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { ToastNotification } from './components/ui/ToastNotification'
import { CalendarPage } from './pages/CalendarPage'
import { Companies } from './pages/Companies'
import { ContactDetails } from './pages/ContactDetails'
import { Contacts } from './pages/Contacts'
import { Dashboard } from './pages/Dashboard'
import { Deals } from './pages/Deals'
import { Help } from './pages/Help'
import { Landing } from './pages/Landing'
import { NotFound } from './pages/NotFound'
import { Reports } from './pages/Reports'
import { Settings } from './pages/Settings'
import { Tasks } from './pages/Tasks'

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/contacts/:id" element={<ContactDetails />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/deals" element={<Deals />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/help" element={<Help />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastNotification />
    </>
  )
}

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { activitySeed, noteSeed } from '../data/activities'
import { companySeed } from '../data/companies'
import { contactSeed } from '../data/contacts'
import { dealSeed } from '../data/deals'
import { notificationSeed } from '../data/notifications'
import { taskSeed } from '../data/tasks'
import { createId, fullName, isoDate, money } from '../lib/format'
import type {
  Activity,
  Company,
  CompanyProfile,
  Contact,
  ContactInput,
  Deal,
  DealInput,
  DealStage,
  Note,
  NotificationItem,
  NotificationPrefs,
  Task,
  TaskInput,
  ThemeMode,
  ToastItem,
  UserProfile,
} from '../types'

const SESSION_KEY = 'nexora-workspace'

interface WorkspaceSnapshot {
  contacts: Contact[]
  companies: Company[]
  deals: Deal[]
  tasks: Task[]
  notifications: NotificationItem[]
  activities: Activity[]
  notes: Note[]
  profile: UserProfile
  companyProfile: CompanyProfile
  prefs: NotificationPrefs
}

const defaultProfile: UserProfile = {
  firstName: 'Alex',
  lastName: 'Morgan',
  email: 'alex.morgan@nexora.example',
  phone: '+1 (415) 555-0108',
  role: 'Head of Sales',
  avatarUrl: '',
}

const defaultCompanyProfile: CompanyProfile = {
  name: 'NEXORA',
  industry: 'Software',
  size: '25–50',
  website: 'nexora.example',
}

const defaultPrefs: NotificationPrefs = {
  email: true,
  tasks: true,
  deals: true,
  reports: false,
}

function seedSnapshot(): WorkspaceSnapshot {
  return {
    contacts: contactSeed,
    companies: companySeed,
    deals: dealSeed,
    tasks: taskSeed,
    notifications: notificationSeed,
    activities: activitySeed,
    notes: noteSeed,
    profile: defaultProfile,
    companyProfile: defaultCompanyProfile,
    prefs: defaultPrefs,
  }
}

function loadSnapshot(): WorkspaceSnapshot {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (!raw) return seedSnapshot()
    const parsed = JSON.parse(raw) as WorkspaceSnapshot
    if (!parsed.contacts || !parsed.deals || !parsed.tasks) return seedSnapshot()
    return { ...seedSnapshot(), ...parsed }
  } catch {
    return seedSnapshot()
  }
}

interface AppContextValue extends WorkspaceSnapshot {
  theme: ThemeMode
  setTheme: (theme: ThemeMode) => void
  sidebarCollapsed: boolean
  setSidebarCollapsed: (value: boolean) => void
  mobileNavOpen: boolean
  setMobileNavOpen: (value: boolean) => void
  searchOpen: boolean
  setSearchOpen: (value: boolean) => void
  toasts: ToastItem[]
  pushToast: (message: string, tone?: ToastItem['tone'], undo?: () => void) => void
  dismissToast: (id: string) => void
  addContact: (input: ContactInput) => void
  updateContact: (id: string, input: ContactInput) => void
  addDeal: (input: DealInput) => void
  moveDeal: (id: string, stage: DealStage) => void
  addTask: (input: TaskInput) => void
  toggleTask: (id: string) => void
  deleteTask: (id: string) => void
  addNote: (contactId: string, body: string) => void
  markNotificationRead: (id: string) => void
  markAllNotificationsRead: () => void
  updateProfile: (profile: UserProfile) => void
  updateCompanyProfile: (profile: CompanyProfile) => void
  updatePrefs: (prefs: NotificationPrefs) => void
  resetWorkspace: () => void
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [snapshot, setSnapshot] = useState<WorkspaceSnapshot>(loadSnapshot)
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const stored = sessionStorage.getItem('nexora-theme')
    return stored === 'dark' ? 'dark' : 'light'
  })
  const [sidebarCollapsed, setSidebarCollapsedState] = useState(
    () => sessionStorage.getItem('nexora-sidebar') === 'collapsed',
  )
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [toasts, setToasts] = useState<ToastItem[]>([])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    sessionStorage.setItem('nexora-theme', theme)
  }, [theme])

  useEffect(() => {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(snapshot))
  }, [snapshot])

  const setTheme = useCallback((next: ThemeMode) => setThemeState(next), [])

  const setSidebarCollapsed = useCallback((value: boolean) => {
    setSidebarCollapsedState(value)
    sessionStorage.setItem('nexora-sidebar', value ? 'collapsed' : 'expanded')
  }, [])

  const dismissToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const pushToast = useCallback(
    (message: string, tone: ToastItem['tone'] = 'success', undo?: () => void) => {
      const id = createId('toast')
      setToasts((current) => [...current, { id, message, tone, undo }])
      window.setTimeout(() => dismissToast(id), 3600)
    },
    [dismissToast],
  )

  const addContact = useCallback((input: ContactInput) => {
    const name = input.company.trim()
    setSnapshot((current) => {
        const existing = current.companies.find(
          (company) => company.name.toLowerCase() === name.toLowerCase(),
        )
        const nextCompanies = [...current.companies]
        let companyId = existing?.id ?? ''
        let companyName = existing?.name ?? name
        if (!existing) {
          companyId = createId('co')
          companyName = name
          nextCompanies.unshift({
            id: companyId,
            name,
            industry: 'Technology',
            employees: 0,
            revenue: '—',
            owner: input.owner,
            location: 'Not specified',
            website: '',
            about: 'Added from a new contact in this workspace.',
          })
        }
        const contact: Contact = {
          id: createId('contact'),
          firstName: input.firstName.trim(),
          lastName: input.lastName.trim(),
          email: input.email.trim(),
          phone: input.phone.trim(),
          company: companyName,
          companyId,
          title: input.title.trim() || 'Contact',
          status: input.status,
          owner: input.owner,
          lastContacted: isoDate(0),
          notes: input.notes.trim(),
        }
        const notes = input.notes.trim()
          ? [
              {
                id: createId('note'),
                contactId: contact.id,
                body: input.notes.trim(),
                author: fullName(current.profile),
                createdAt: isoDate(0),
              },
              ...current.notes,
            ]
          : current.notes
        return {
          ...current,
          companies: nextCompanies,
          contacts: [contact, ...current.contacts],
          notes,
          activities: [
            {
              id: createId('act'),
              actor: fullName(current.profile),
              text: `added ${fullName(contact)}.`,
              time: 'Just now',
              type: 'contact',
              contactId: contact.id,
            },
            ...current.activities,
          ],
          notifications: [
            {
              id: createId('notice'),
              title: 'New contact added.',
              body: `${fullName(contact)} at ${companyName} is now in the workspace.`,
              time: 'Just now',
              read: false,
              type: 'contact' as const,
            },
            ...current.notifications,
          ],
        }
      })
  }, [])

  const updateContact = useCallback((id: string, input: ContactInput) => {
    setSnapshot((current) => {
      const name = input.company.trim()
      const existing = current.companies.find(
        (company) => company.name.toLowerCase() === name.toLowerCase(),
      )
      let companies = current.companies
      let companyId = existing?.id ?? ''
      let companyName = existing?.name ?? name
      if (!existing) {
        companyId = createId('co')
        companyName = name
        companies = [
          {
            id: companyId,
            name,
            industry: 'Technology',
            employees: 0,
            revenue: '—',
            owner: input.owner,
            location: 'Not specified',
            website: '',
            about: 'Added from a contact update in this workspace.',
          },
          ...companies,
        ]
      }
      return {
        ...current,
        companies,
        contacts: current.contacts.map((contact) =>
          contact.id === id
            ? {
                ...contact,
                firstName: input.firstName.trim(),
                lastName: input.lastName.trim(),
                email: input.email.trim(),
                phone: input.phone.trim(),
                company: companyName,
                companyId,
                title: input.title.trim() || contact.title,
                status: input.status,
                owner: input.owner,
                notes: input.notes.trim(),
              }
            : contact,
        ),
      }
    })
  }, [])

  const addDeal = useCallback((input: DealInput) => {
    setSnapshot((current) => {
      const company = current.companies.find((item) => item.id === input.companyId)
      if (!company) return current
      const deal: Deal = {
        id: createId('deal'),
        name: input.name.trim(),
        company: company.name,
        companyId: company.id,
        value: input.value,
        probability: input.probability,
        stage: input.stage,
        expectedClose: input.expectedClose,
        owner: input.owner,
        contactId: current.contacts.find((contact) => contact.companyId === company.id)?.id,
      }
      return {
        ...current,
        deals: [deal, ...current.deals],
        activities: [
          {
            id: createId('act'),
            actor: fullName(current.profile),
            text: `created ${deal.name} for ${money(deal.value)}.`,
            time: 'Just now',
            type: 'deal',
            contactId: deal.contactId,
          },
          ...current.activities,
        ],
        notifications: [
          {
            id: createId('notice'),
            title: 'New deal created.',
            body: `${deal.name} was added to ${deal.stage}.`,
            time: 'Just now',
            read: false,
            type: 'deal',
          },
          ...current.notifications,
        ],
      }
    })
  }, [])

  const moveDeal = useCallback((id: string, stage: DealStage) => {
    setSnapshot((current) => {
      const deal = current.deals.find((item) => item.id === id)
      if (!deal || deal.stage === stage) return current
      return {
        ...current,
        deals: current.deals.map((item) => (item.id === id ? { ...item, stage } : item)),
        activities: [
          {
            id: createId('act'),
            actor: fullName(current.profile),
            text: `moved ${deal.company} to ${stage}.`,
            time: 'Just now',
            type: 'deal',
            contactId: deal.contactId,
          },
          ...current.activities,
        ],
      }
    })
  }, [])

  const addTask = useCallback((input: TaskInput) => {
    setSnapshot((current) => ({
      ...current,
      tasks: [
        {
          id: createId('task'),
          title: input.title.trim(),
          due: input.due,
          priority: input.priority,
          completed: false,
          related: input.related.trim() || 'General',
          owner: input.owner,
          type: input.type,
        },
        ...current.tasks,
      ],
    }))
  }, [])

  const toggleTask = useCallback((id: string) => {
    setSnapshot((current) => {
      const task = current.tasks.find((item) => item.id === id)
      if (!task) return current
      const completed = !task.completed
      return {
        ...current,
        tasks: current.tasks.map((item) => (item.id === id ? { ...item, completed } : item)),
        activities: completed
          ? [
              {
                id: createId('act'),
                actor: fullName(current.profile),
                text: `completed “${task.title}”.`,
                time: 'Just now',
                type: 'task',
              },
              ...current.activities,
            ]
          : current.activities,
      }
    })
  }, [])

  const deleteTask = useCallback(
    (id: string) => {
      const task = snapshot.tasks.find((item) => item.id === id)
      if (!task) return
      setSnapshot((current) => ({
        ...current,
        tasks: current.tasks.filter((item) => item.id !== id),
      }))
      pushToast('Task deleted', 'info', () => {
        setSnapshot((current) => {
          if (current.tasks.some((item) => item.id === task.id)) return current
          return { ...current, tasks: [task, ...current.tasks] }
        })
      })
    },
    [pushToast, snapshot.tasks],
  )

  const addNote = useCallback((contactId: string, body: string) => {
    const trimmed = body.trim()
    if (!trimmed) return
    setSnapshot((current) => ({
      ...current,
      notes: [
        {
          id: createId('note'),
          contactId,
          body: trimmed,
          author: fullName(current.profile),
          createdAt: isoDate(0),
        },
        ...current.notes,
      ],
      activities: [
        {
          id: createId('act'),
          actor: fullName(current.profile),
          text: 'added a note.',
          time: 'Just now',
          type: 'note',
          contactId,
        },
        ...current.activities,
      ],
    }))
  }, [])

  const markNotificationRead = useCallback((id: string) => {
    setSnapshot((current) => ({
      ...current,
      notifications: current.notifications.map((item) =>
        item.id === id ? { ...item, read: true } : item,
      ),
    }))
  }, [])

  const markAllNotificationsRead = useCallback(() => {
    setSnapshot((current) => ({
      ...current,
      notifications: current.notifications.map((item) => ({ ...item, read: true })),
    }))
  }, [])

  const updateProfile = useCallback((profile: UserProfile) => {
    setSnapshot((current) => ({ ...current, profile }))
  }, [])

  const updateCompanyProfile = useCallback((companyProfile: CompanyProfile) => {
    setSnapshot((current) => ({ ...current, companyProfile }))
  }, [])

  const updatePrefs = useCallback((prefs: NotificationPrefs) => {
    setSnapshot((current) => ({ ...current, prefs }))
  }, [])

  const resetWorkspace = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY)
    setSnapshot(seedSnapshot())
  }, [])

  const value = useMemo<AppContextValue>(
    () => ({
      ...snapshot,
      theme,
      setTheme,
      sidebarCollapsed,
      setSidebarCollapsed,
      mobileNavOpen,
      setMobileNavOpen,
      searchOpen,
      setSearchOpen,
      toasts,
      pushToast,
      dismissToast,
      addContact,
      updateContact,
      addDeal,
      moveDeal,
      addTask,
      toggleTask,
      deleteTask,
      addNote,
      markNotificationRead,
      markAllNotificationsRead,
      updateProfile,
      updateCompanyProfile,
      updatePrefs,
      resetWorkspace,
    }),
    [
      snapshot,
      theme,
      setTheme,
      sidebarCollapsed,
      setSidebarCollapsed,
      mobileNavOpen,
      searchOpen,
      toasts,
      pushToast,
      dismissToast,
      addContact,
      updateContact,
      addDeal,
      moveDeal,
      addTask,
      toggleTask,
      deleteTask,
      addNote,
      markNotificationRead,
      markAllNotificationsRead,
      updateProfile,
      updateCompanyProfile,
      updatePrefs,
      resetWorkspace,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used within AppProvider')
  return context
}

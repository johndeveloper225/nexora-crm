export type ContactStatus = 'Lead' | 'Customer' | 'Prospect'

export type DealStage =
  | 'New Lead'
  | 'Qualified'
  | 'Proposal'
  | 'Negotiation'
  | 'Won'
  | 'Lost'

export type TaskPriority = 'High' | 'Medium' | 'Low'

export type TaskType = 'Follow-up' | 'Call' | 'Proposal' | 'Email' | 'Meeting'

export type ThemeMode = 'light' | 'dark'

export interface Contact {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  company: string
  companyId: string
  title: string
  status: ContactStatus
  owner: string
  lastContacted: string
  notes: string
}

export interface Company {
  id: string
  name: string
  industry: string
  employees: number
  revenue: string
  owner: string
  location: string
  website: string
  about: string
}

export interface Deal {
  id: string
  name: string
  company: string
  companyId: string
  value: number
  probability: number
  stage: DealStage
  expectedClose: string
  owner: string
  contactId?: string
}

export interface Task {
  id: string
  title: string
  due: string
  priority: TaskPriority
  completed: boolean
  related: string
  owner: string
  type: TaskType
}

export interface NotificationItem {
  id: string
  title: string
  body: string
  time: string
  read: boolean
  type: 'lead' | 'deal' | 'task' | 'contact' | 'report'
}

export interface Activity {
  id: string
  actor: string
  text: string
  time: string
  type: 'contact' | 'deal' | 'task' | 'note' | 'call'
  contactId?: string
}

export interface Note {
  id: string
  contactId: string
  body: string
  author: string
  createdAt: string
}

export interface CalendarEvent {
  id: string
  title: string
  date: string
  time: string
  minutes: number
  type: 'meeting' | 'task' | 'follow-up'
  duration: string
  related: string
}

export interface UserProfile {
  firstName: string
  lastName: string
  email: string
  phone: string
  role: string
  avatarUrl: string
}

export interface CompanyProfile {
  name: string
  industry: string
  size: string
  website: string
}

export interface NotificationPrefs {
  email: boolean
  tasks: boolean
  deals: boolean
  reports: boolean
}

export interface ContactInput {
  firstName: string
  lastName: string
  email: string
  phone: string
  company: string
  status: ContactStatus
  owner: string
  notes: string
  title: string
}

export interface DealInput {
  name: string
  companyId: string
  value: number
  probability: number
  stage: DealStage
  expectedClose: string
  owner: string
}

export interface TaskInput {
  title: string
  due: string
  priority: TaskPriority
  related: string
  owner: string
  type: TaskType
}

export interface ToastItem {
  id: string
  message: string
  tone: 'success' | 'info'
  undo?: () => void
}

export const OWNERS = ['Alex Morgan', 'Sarah Carter', 'James Wilson', 'Michael Brooks'] as const

export const CONTACT_STATUSES: ContactStatus[] = ['Lead', 'Customer', 'Prospect']

export const DEAL_STAGES: DealStage[] = [
  'New Lead',
  'Qualified',
  'Proposal',
  'Negotiation',
  'Won',
  'Lost',
]

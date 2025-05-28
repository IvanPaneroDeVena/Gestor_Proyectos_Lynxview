// lib/types.ts

// Enums para estados y prioridades
export enum ProjectStatus {
  PLANNING = "planning",
  ACTIVE = "active",
  ON_HOLD = "on_hold",
  COMPLETED = "completed"
}

export enum TaskStatus {
  PENDING = "pending",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  CANCELLED = "cancelled"
}

export enum TaskPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  URGENT = "urgent"
}

export enum InvoiceStatus {
  DRAFT = "draft",
  SENT = "sent",
  PAID = "paid",
  OVERDUE = "overdue",
  CANCELLED = "cancelled"
}

// Interfaces principales
export interface User {
  id: number
  email: string
  username: string
  full_name?: string
  role?: string
  seniority?: string
  department?: string
  hourly_rate?: number
  skills?: string
  is_active: boolean
  is_superuser: boolean
  created_at: string
  updated_at?: string
  last_login?: string
  projects: Project[]
  total_tasks: number
  total_hours: number
}

export interface Technology {
  id: number
  name: string
  category?: string
  description?: string
  projects: Project[]
  project_count: number
}

export interface Project {
  id: number
  name: string
  description?: string
  client_name?: string
  status: ProjectStatus
  start_date?: string
  end_date?: string
  budget?: number
  hourly_rate?: number
  created_at: string
  updated_at?: string
  members: User[]
  technologies: Technology[]
  total_hours: number
  total_invoiced: number
}

export interface Task {
  id: number
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  project_id: number
  assignee_id?: number
  created_by_id: number
  estimated_hours?: number
  actual_hours?: number
  start_date?: string
  due_date?: string
  completed_at?: string
  created_at: string
  updated_at?: string
  project?: Project
  assignee?: User
  created_by?: User
}

export interface Invoice {
  id: number
  invoice_number: string
  status: InvoiceStatus
  project_id: number
  issue_date?: string
  due_date?: string
  paid_date?: string
  subtotal: number
  tax_rate: number
  tax_amount?: number
  total: number
  notes?: string
  payment_terms?: string
  created_at: string
  updated_at?: string
  project?: Project
}

export interface TimeEntry {
  id: number
  hours: number
  description?: string
  date: string
  user_id: number
  project_id: number
  task_id?: number
  billable: string
  billed: string
  invoice_id?: number
  created_at: string
  updated_at?: string
  user?: User
  project?: Project
  task?: Task
}

// Interfaces para respuestas de la API
export interface ProjectList {
  total: number
  projects: Project[]
}

export interface UserList {
  total: number
  users: User[]
}

export interface TaskList {
  total: number
  tasks: Task[]
}

export interface InvoiceList {
  total: number
  invoices: Invoice[]
}

export interface TimeEntryList {
  total: number
  time_entries: TimeEntry[]
}

export interface TechnologyList {
  total: number
  technologies: Technology[]
}

// Interfaces para crear/actualizar
export interface CreateProject {
  name: string
  description?: string
  client_name?: string
  status?: ProjectStatus
  start_date?: string
  end_date?: string
  budget?: number
  hourly_rate?: number
  member_ids?: number[]
  technology_ids?: number[]
}

export interface CreateUser {
  email: string
  username: string
  password: string
  full_name?: string
  role?: string
  seniority?: string
  department?: string
  hourly_rate?: number
  skills?: string
  is_active?: boolean
}

export interface CreateTask {
  title: string
  description?: string
  status?: TaskStatus
  priority?: TaskPriority
  project_id: number
  assignee_id?: number
  created_by_id: number
  estimated_hours?: number
  start_date?: string
  due_date?: string
}

export interface CreateInvoice {
  invoice_number: string
  status?: InvoiceStatus
  project_id: number
  issue_date?: string
  due_date?: string
  subtotal: number
  tax_rate?: number
  tax_amount?: number
  total: number
  notes?: string
  payment_terms?: string
}

// Interfaces para respuestas de error
export interface ApiError {
  detail: string
  status_code: number
}

// Interfaces para estadísticas del dashboard
export interface DashboardStats {
  total_projects: number
  active_projects: number
  total_team_members: number
  total_billable_hours: number
  monthly_revenue: number
  projects_by_status: Record<ProjectStatus, number>
  recent_activities: RecentActivity[]
}

export interface RecentActivity {
  id: number
  user_name: string
  action: string
  target: string
  project_name?: string
  timestamp: string
}
// lib/api/client.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

class ApiClient {
  private baseURL: string

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
      },
    }

    const config = { ...defaultOptions, ...options }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // Métodos para Proyectos
  async getProjects(params?: {
    skip?: number
    limit?: number
    status?: string
    search?: string
  }) {
    const searchParams = new URLSearchParams()
    if (params?.skip) searchParams.append('skip', params.skip.toString())
    if (params?.limit) searchParams.append('limit', params.limit.toString())
    if (params?.status) searchParams.append('status', params.status)
    if (params?.search) searchParams.append('search', params.search)
    
    const query = searchParams.toString()
    return this.request(`/api/projects${query ? `?${query}` : ''}`)
  }

  async getProject(id: number) {
    return this.request(`/api/projects/${id}`)
  }

  async createProject(data: any) {
    return this.request('/api/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateProject(id: number, data: any) {
    return this.request(`/api/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteProject(id: number) {
    return this.request(`/api/projects/${id}`, {
      method: 'DELETE',
    })
  }

  // Métodos para Usuarios/Equipo
  async getUsers(params?: {
    skip?: number
    limit?: number
    role?: string
    department?: string
    search?: string
    is_active?: boolean
  }) {
    const searchParams = new URLSearchParams()
    if (params?.skip) searchParams.append('skip', params.skip.toString())
    if (params?.limit) searchParams.append('limit', params.limit.toString())
    if (params?.role) searchParams.append('role', params.role)
    if (params?.department) searchParams.append('department', params.department)
    if (params?.search) searchParams.append('search', params.search)
    if (params?.is_active !== undefined) searchParams.append('is_active', params.is_active.toString())
    
    const query = searchParams.toString()
    return this.request(`/api/users${query ? `?${query}` : ''}`)
  }

  async getUser(id: number) {
    return this.request(`/api/users/${id}`)
  }

  async createUser(data: any) {
    return this.request('/api/users', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateUser(id: number, data: any) {
    return this.request(`/api/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  // Métodos para Tareas
  async getTasks(params?: {
    skip?: number
    limit?: number
    status?: string
    priority?: string
    project_id?: number
    assignee_id?: number
    search?: string
  }) {
    const searchParams = new URLSearchParams()
    if (params?.skip) searchParams.append('skip', params.skip.toString())
    if (params?.limit) searchParams.append('limit', params.limit.toString())
    if (params?.status) searchParams.append('status', params.status)
    if (params?.priority) searchParams.append('priority', params.priority)
    if (params?.project_id) searchParams.append('project_id', params.project_id.toString())
    if (params?.assignee_id) searchParams.append('assignee_id', params.assignee_id.toString())
    if (params?.search) searchParams.append('search', params.search)
    
    const query = searchParams.toString()
    return this.request(`/api/tasks${query ? `?${query}` : ''}`)
  }

  async createTask(data: any) {
    return this.request('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateTask(id: number, data: any) {
    return this.request(`/api/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  // Métodos para Facturas
  async getInvoices(params?: {
    skip?: number
    limit?: number
    status?: string
    project_id?: number
    search?: string
  }) {
    const searchParams = new URLSearchParams()
    if (params?.skip) searchParams.append('skip', params.skip.toString())
    if (params?.limit) searchParams.append('limit', params.limit.toString())
    if (params?.status) searchParams.append('status', params.status)
    if (params?.project_id) searchParams.append('project_id', params.project_id.toString())
    if (params?.search) searchParams.append('search', params.search)
    
    const query = searchParams.toString()
    return this.request(`/api/invoices${query ? `?${query}` : ''}`)
  }

  async createInvoice(data: any) {
    return this.request('/api/invoices', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Métodos para Tecnologías
  async getTechnologies(params?: {
    skip?: number
    limit?: number
    category?: string
    search?: string
  }) {
    const searchParams = new URLSearchParams()
    if (params?.skip) searchParams.append('skip', params.skip.toString())
    if (params?.limit) searchParams.append('limit', params.limit.toString())
    if (params?.category) searchParams.append('category', params.category)
    if (params?.search) searchParams.append('search', params.search)
    
    const query = searchParams.toString()
    return this.request(`/api/technologies${query ? `?${query}` : ''}`)
  }

  // Métodos para Entradas de Tiempo
  async getTimeEntries(params?: {
    skip?: number
    limit?: number
    user_id?: number
    project_id?: number
    task_id?: number
    billable?: string
    billed?: string
    start_date?: string
    end_date?: string
  }) {
    const searchParams = new URLSearchParams()
    if (params?.skip) searchParams.append('skip', params.skip.toString())
    if (params?.limit) searchParams.append('limit', params.limit.toString())
    if (params?.user_id) searchParams.append('user_id', params.user_id.toString())
    if (params?.project_id) searchParams.append('project_id', params.project_id.toString())
    if (params?.task_id) searchParams.append('task_id', params.task_id.toString())
    if (params?.billable) searchParams.append('billable', params.billable)
    if (params?.billed) searchParams.append('billed', params.billed)
    if (params?.start_date) searchParams.append('start_date', params.start_date)
    if (params?.end_date) searchParams.append('end_date', params.end_date)
    
    const query = searchParams.toString()
    return this.request(`/api/time-entries${query ? `?${query}` : ''}`)
  }
}

export const apiClient = new ApiClient()
export default apiClient
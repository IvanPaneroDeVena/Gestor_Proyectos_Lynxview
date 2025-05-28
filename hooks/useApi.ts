// hooks/useApi.ts
import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '@/lib/api/client'
import { ProjectList, UserList, TaskList, Project, User, CreateProject, CreateUser } from '@/lib/types'

// Hook genérico para manejar estados de API
interface UseApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

function useApiState<T>(initialData: T | null = null): UseApiState<T> & {
  setData: (data: T | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
} {
  const [data, setData] = useState<T | null>(initialData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  return { data, loading, error, setData, setLoading, setError }
}

// Hook para proyectos
export function useProjects(params?: {
  skip?: number
  limit?: number
  status?: string
  search?: string
}) {
  const { data, loading, error, setData, setLoading, setError } = useApiState<ProjectList>()

  const fetchProjects = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await apiClient.getProjects(params)
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching projects')
    } finally {
      setLoading(false)
    }
  }, [params])

  const createProject = async (projectData: CreateProject) => {
    setLoading(true)
    setError(null)
    try {
      const newProject = await apiClient.createProject(projectData)
      // Refrescar la lista después de crear
      await fetchProjects()
      return newProject
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating project')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateProject = async (id: number, projectData: Partial<CreateProject>) => {
    setLoading(true)
    setError(null)
    try {
      const updatedProject = await apiClient.updateProject(id, projectData)
      // Refrescar la lista después de actualizar
      await fetchProjects()
      return updatedProject
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating project')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteProject = async (id: number) => {
    setLoading(true)
    setError(null)
    try {
      await apiClient.deleteProject(id)
      // Refrescar la lista después de eliminar
      await fetchProjects()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error deleting project')
      throw err
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  return {
    projects: data?.projects || [],
    total: data?.total || 0,
    loading,
    error,
    refetch: fetchProjects,
    createProject,
    updateProject,
    deleteProject
  }
}

// Hook para un proyecto específico
export function useProject(id: number) {
  const { data, loading, error, setData, setLoading, setError } = useApiState<Project>()

  const fetchProject = useCallback(async () => {
    if (!id) return
    setLoading(true)
    setError(null)
    try {
      const result = await apiClient.getProject(id)
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching project')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchProject()
  }, [fetchProject])

  return {
    project: data,
    loading,
    error,
    refetch: fetchProject
  }
}

// Hook para usuarios/equipo
export function useUsers(params?: {
  skip?: number
  limit?: number
  role?: string
  department?: string
  search?: string
  is_active?: boolean
}) {
  const { data, loading, error, setData, setLoading, setError } = useApiState<UserList>()

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await apiClient.getUsers(params)
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching users')
    } finally {
      setLoading(false)
    }
  }, [params])

  const createUser = async (userData: CreateUser) => {
    setLoading(true)
    setError(null)
    try {
      const newUser = await apiClient.createUser(userData)
      // Refrescar la lista después de crear
      await fetchUsers()
      return newUser
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating user')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateUser = async (id: number, userData: Partial<CreateUser>) => {
    setLoading(true)
    setError(null)
    try {
      const updatedUser = await apiClient.updateUser(id, userData)
      // Refrescar la lista después de actualizar
      await fetchUsers()
      return updatedUser
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating user')
      throw err
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  return {
    users: data?.users || [],
    total: data?.total || 0,
    loading,
    error,
    refetch: fetchUsers,
    createUser,
    updateUser
  }
}

// Hook para tareas
export function useTasks(params?: {
  skip?: number
  limit?: number
  status?: string
  priority?: string
  project_id?: number
  assignee_id?: number
  search?: string
}) {
  const { data, loading, error, setData, setLoading, setError } = useApiState<TaskList>()

  const fetchTasks = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await apiClient.getTasks(params)
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching tasks')
    } finally {
      setLoading(false)
    }
  }, [params])

  const createTask = async (taskData: any) => {
    setLoading(true)
    setError(null)
    try {
      const newTask = await apiClient.createTask(taskData)
      await fetchTasks()
      return newTask
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating task')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateTask = async (id: number, taskData: any) => {
    setLoading(true)
    setError(null)
    try {
      const updatedTask = await apiClient.updateTask(id, taskData)
      await fetchTasks()
      return updatedTask
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating task')
      throw err
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  return {
    tasks: data?.tasks || [],
    total: data?.total || 0,
    loading,
    error,
    refetch: fetchTasks,
    createTask,
    updateTask
  }
}

// Hook para tecnologías
export function useTechnologies(params?: {
  skip?: number
  limit?: number
  category?: string
  search?: string
}) {
  const { data, loading, error, setData, setLoading, setError } = useApiState<any>()

  const fetchTechnologies = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await apiClient.getTechnologies(params)
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching technologies')
    } finally {
      setLoading(false)
    }
  }, [params])

  useEffect(() => {
    fetchTechnologies()
  }, [fetchTechnologies])

  return {
    technologies: data?.technologies || [],
    total: data?.total || 0,
    loading,
    error,
    refetch: fetchTechnologies
  }
}
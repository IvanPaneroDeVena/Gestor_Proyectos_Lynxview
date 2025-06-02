'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2,
  Filter,
  AlertTriangle,
  Calendar
} from 'lucide-react'
import { apiClient } from '@/lib/api/client'
import { useRouter } from 'next/navigation'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

// Datos de respaldo en caso de error de API
const fallbackProjects = [
  {
    id: 1,
    name: 'Plataforma E-commerce',
    client_name: 'Retail Solutions',
    status: 'active',
    budget: 50000,
    start_date: '2025-01-15T09:00:00Z',
    end_date: '2025-06-15T18:00:00Z',
    created_at: '2025-01-01T10:00:00Z',
    updated_at: '2025-01-10T14:30:00Z',
    hourly_rate: 75,
    description: 'Desarrollo de plataforma de comercio electrónico'
  },
  {
    id: 2,
    name: 'App Móvil Banca',
    client_name: 'Fintech Innovations',
    status: 'active',
    budget: 80000,
    start_date: '2025-02-01T09:00:00Z',
    end_date: '2025-07-30T18:00:00Z',
    created_at: '2025-01-15T11:00:00Z',
    updated_at: '2025-01-20T16:45:00Z',
    hourly_rate: 85,
    description: 'Aplicación móvil para servicios bancarios'
  },
  {
    id: 3,
    name: 'Sistema CRM',
    client_name: 'Global Services',
    status: 'active',
    budget: 35000,
    start_date: '2025-01-01T09:00:00Z',
    end_date: '2025-06-05T18:00:00Z',
    created_at: '2024-12-20T09:00:00Z',
    updated_at: '2025-01-25T12:15:00Z',
    hourly_rate: 65,
    description: 'Sistema de gestión de relaciones con clientes'
  },
  {
    id: 4,
    name: 'Portal Educativo',
    client_name: 'EduTech',
    status: 'planning',
    budget: 25000,
    start_date: '2025-03-01T09:00:00Z',
    end_date: '2025-08-10T18:00:00Z',
    created_at: '2025-01-28T14:00:00Z',
    updated_at: '2025-01-28T14:00:00Z',
    hourly_rate: 60,
    description: 'Plataforma educativa online'
  }
]

const statusColors = {
  planning: 'bg-blue-100 text-blue-800',
  active: 'bg-green-100 text-green-800',
  on_hold: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800'
}

const statusLabels = {
  planning: 'Planificación',
  active: 'Activo',
  on_hold: 'En Pausa',
  completed: 'Completado',
  cancelled: 'Cancelado'
}

export default function ProyectosPage() {
  const router = useRouter()
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [deletingProject, setDeletingProject] = useState<number | null>(null)

  // Función para cargar proyectos desde la API
  const loadProjects = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('🔄 Intentando cargar proyectos desde la API...')
      
      // Cargar proyectos desde la API
      const projectsData = await apiClient.getProjects()
      console.log('✅ Proyectos cargados desde API:', projectsData)
      console.log('📊 Tipo de datos recibidos:', typeof projectsData, Array.isArray(projectsData))
      
      // Asegurar que siempre tengamos un array
      if (Array.isArray(projectsData)) {
        setProjects(projectsData)
        console.log('✅ Proyectos establecidos correctamente:', projectsData.length)
      } else {
        console.warn('⚠️ Los datos recibidos no son un array:', projectsData)
        // Si la respuesta tiene una propiedad que contiene el array
        if (projectsData && projectsData.data && Array.isArray(projectsData.data)) {
          setProjects(projectsData.data)
        } else if (projectsData && projectsData.projects && Array.isArray(projectsData.projects)) {
          setProjects(projectsData.projects)
        } else {
          throw new Error('La API no devolvió un array de proyectos válido')
        }
      }
      
    } catch (error) {
      console.error('❌ Error loading projects:', error)
      console.log('🔧 Detalles del error:', {
        message: error.message,
        status: error.status,
        response: error.response
      })
      
      setError(`No se pudieron cargar los proyectos desde la API: ${error.message}`)
      
      // En caso de error, usar datos de respaldo
      console.log('📦 Usando datos de respaldo')
      setProjects(fallbackProjects)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProjects()
  }, [])

  // Filtrar proyectos - con protección adicional
  const filteredProjects = Array.isArray(projects) ? projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (project.client_name && project.client_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter
    return matchesSearch && matchesStatus
  }) : []

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  }

  const formatDateTime = (dateString: string) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Calcular progreso basado en fechas (estimación simple)
  const calculateProgress = (startDate: string, endDate: string) => {
    if (!startDate || !endDate) return 0
    
    const now = new Date()
    const start = new Date(startDate)
    const end = new Date(endDate)
    
    if (now < start) return 0
    if (now > end) return 100
    
    const totalDuration = end.getTime() - start.getTime()
    const elapsed = now.getTime() - start.getTime()
    
    return Math.round((elapsed / totalDuration) * 100)
  }

  // Función para eliminar proyecto
  const handleDeleteProject = async (projectId: number) => {
    try {
      setDeletingProject(projectId)
      
      console.log('🗑️ Eliminando proyecto:', projectId)
      await apiClient.deleteProject(projectId)
      
      // Actualizar la lista local
      setProjects(prevProjects => 
        prevProjects.filter(project => project.id !== projectId)
      )
      
      console.log('✅ Proyecto eliminado correctamente')
      
    } catch (error) {
      console.error('❌ Error eliminando proyecto:', error)
      setError(`Error al eliminar el proyecto: ${error.message}`)
    } finally {
      setDeletingProject(null)
    }
  }

  // Función para navegar a detalles
  const handleViewDetails = (projectId: number) => {
    router.push(`/proyectos/${projectId}`)
  }

  // Función para navegar a editar
  const handleEditProject = (projectId: number) => {
    router.push(`/proyectos/${projectId}/editar`)
  }

  return (
    <div className="container mx-auto py-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Proyectos</h1>
          <p className="text-muted-foreground">
            Gestiona todos los proyectos de la empresa
          </p>
        </div>
        <Link href="/proyectos/nuevo">
          <Button className="bg-teal-600 hover:bg-teal-700">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Proyecto
          </Button>
        </Link>
      </div>

      {/* Mensaje de error */}
      {error && (
        <Card className="mb-6 border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-orange-800">
              <div className="text-sm flex-1">{error}</div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    console.log('🔄 Reintentar manual - Estado actual:', { 
                      projectsCount: Array.isArray(projects) ? projects.length : 'NO ES ARRAY',
                      projectsType: typeof projects,
                      isArray: Array.isArray(projects),
                      loading,
                      error 
                    })
                    loadProjects()
                  }}
                >
                  Reintentar
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    console.log('🧹 Limpiando estado...')
                    setProjects([])
                    setError(null)
                    loadProjects()
                  }}
                >
                  Limpiar y Recargar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info de debug */}
      {process.env.NODE_ENV === 'development' && (
        <Card className="mb-6 border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="text-sm text-blue-800">
              <strong>Debug Info:</strong> {projects.length} proyectos cargados | 
              Loading: {loading ? 'Sí' : 'No'} | 
              Error: {error ? 'Sí' : 'No'}
              <br />
              <strong>IDs de proyectos:</strong> {projects.map(p => p.id).join(', ')}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filtros y búsqueda */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar proyectos por nombre o cliente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Estado
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                    Todos
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('planning')}>
                    Planificación
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('active')}>
                    Activo
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('on_hold')}>
                    En Pausa
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('completed')}>
                    Completado
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('cancelled')}>
                    Cancelado
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de proyectos */}
      <Card>
        <CardHeader>
          <CardTitle>
            Proyectos ({filteredProjects.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Proyecto</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Progreso</TableHead>
                  <TableHead>Presupuesto</TableHead>
                  <TableHead>Tarifa/hora</TableHead>
                  <TableHead>Fecha Fin</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      Cargando proyectos...
                    </TableCell>
                  </TableRow>
                ) : filteredProjects.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      No se encontraron proyectos
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProjects.map((project) => {
                    const progress = calculateProgress(project.start_date, project.end_date)
                    return (
                      <TableRow 
                        key={project.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => router.push(`/proyectos/${project.id}/tareas`)}
                      >
                        <TableCell>
                          <div>
                            <div className="font-medium">{project.name}</div>
                            {project.description && (
                              <div className="text-sm text-muted-foreground truncate max-w-xs">
                                {project.description}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {project.client_name || '-'}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            className={statusColors[project.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}
                          >
                            {statusLabels[project.status as keyof typeof statusLabels] || project.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-teal-600 h-2 rounded-full transition-all" 
                                style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
                              />
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {progress}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {project.budget ? formatCurrency(project.budget) : '-'}
                        </TableCell>
                        <TableCell>
                          {project.hourly_rate ? `${formatCurrency(project.hourly_rate)}/h` : '-'}
                        </TableCell>
                        <TableCell>
                          {formatDate(project.end_date)}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={(e) => e.stopPropagation()} // Evitar que se active el click de la fila
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation()
                                handleViewDetails(project.id)
                              }}>
                                <Eye className="h-4 w-4 mr-2" />
                                Ver detalles
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation()
                                router.push(`/proyectos/${project.id}/tareas`)
                              }}>
                                <Calendar className="h-4 w-4 mr-2" />
                                Ver tareas
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation()
                                handleEditProject(project.id)
                              }}>
                                <Edit className="h-4 w-4 mr-2" />
                                Editar
                              </DropdownMenuItem>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem 
                                    className="text-red-600"
                                    onSelect={(e) => e.preventDefault()}
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Eliminar
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle className="flex items-center gap-2">
                                      <AlertTriangle className="h-5 w-5 text-red-500" />
                                      ¿Eliminar proyecto?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      ¿Estás seguro de que quieres eliminar el proyecto "<strong>{project.name}</strong>"? 
                                      Esta acción no se puede deshacer y se eliminarán todos los datos asociados.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDeleteProject(project.id)}
                                      className="bg-red-600 hover:bg-red-700"
                                      disabled={deletingProject === project.id}
                                    >
                                      {deletingProject === project.id ? 'Eliminando...' : 'Eliminar'}
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Plus, Search, MoreHorizontal, Eye, Edit, Trash2, Filter, ArrowLeft, AlertTriangle, Calendar, Clock, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
import { apiClient } from '@/lib/api/client'

// Datos de respaldo para tareas
const fallbackTasks = [
  {
    id: 1,
    title: 'Diseño de interfaz principal',
    description: 'Crear el diseño de la página principal del proyecto',
    status: 'in_progress',
    priority: 'high',
    project_id: 1,
    assignee_id: 1,
    created_by_id: 1,
    estimated_hours: 20,
    actual_hours: 12,
    start_date: '2025-01-15T09:00:00Z',
    due_date: '2025-01-25T18:00:00Z',
    created_at: '2025-01-10T10:00:00Z',
    assignee: { id: 1, full_name: 'Ana Martínez', avatar: null },
    created_by: { id: 1, full_name: 'Ana Martínez', avatar: null }
  },
  {
    id: 2,
    title: 'Implementar autenticación',
    description: 'Sistema de login y registro de usuarios',
    status: 'pending',
    priority: 'medium',
    project_id: 1,
    assignee_id: 2,
    created_by_id: 1,
    estimated_hours: 15,
    actual_hours: 0,
    start_date: '2025-01-20T09:00:00Z',
    due_date: '2025-01-30T18:00:00Z',
    created_at: '2025-01-10T11:00:00Z',
    assignee: { id: 2, full_name: 'Carlos Ruiz', avatar: null },
    created_by: { id: 1, full_name: 'Ana Martínez', avatar: null }
  }
]

const statusColors = {
  pending: 'bg-gray-100 text-gray-800',
  in_progress: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
}

const statusLabels = {
  pending: 'Pendiente',
  in_progress: 'En Progreso',
  completed: 'Completada',
  cancelled: 'Cancelada'
}

const priorityColors = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800'
}

const priorityLabels = {
  low: 'Baja',
  medium: 'Media',
  high: 'Alta',
  urgent: 'Urgente'
}

export default function ProjectTasksPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = parseInt(params.id as string)
  
  const [project, setProject] = useState<any>(null)
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [assigneeFilter, setAssigneeFilter] = useState('all')
  const [deletingTask, setDeletingTask] = useState<number | null>(null)

  // Cargar proyecto y tareas
  const loadProjectAndTasks = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('📋 Cargando proyecto y tareas para proyecto:', projectId)
      
      // Cargar proyecto
      const projectData = await apiClient.getProject(projectId)
      console.log('✅ Proyecto cargado:', projectData)
      setProject(projectData)
      
      // Cargar tareas del proyecto
      const tasksData = await apiClient.getTasks({ project_id: projectId })
      console.log('✅ Tareas cargadas:', tasksData)
      
      // Manejar diferentes formatos de respuesta
      let tasksArray = []
      if (Array.isArray(tasksData)) {
        tasksArray = tasksData
      } else if (tasksData && Array.isArray(tasksData.data)) {
        tasksArray = tasksData.data
      } else if (tasksData && Array.isArray(tasksData.tasks)) {
        tasksArray = tasksData.tasks
      } else {
        console.warn('⚠️ Formato de tareas no reconocido, usando datos de respaldo')
        tasksArray = fallbackTasks.filter(task => task.project_id === projectId)
      }
      
      setTasks(tasksArray)
      
    } catch (error) {
      console.error('❌ Error cargando datos:', error)
      setError(`No se pudieron cargar los datos: ${error.message}`)
      
      // Usar datos de respaldo
      setTasks(fallbackTasks.filter(task => task.project_id === projectId))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (projectId) {
      loadProjectAndTasks()
    }
  }, [projectId])

  // Función para eliminar tarea
  const handleDeleteTask = async (taskId: number) => {
    try {
      setDeletingTask(taskId)
      
      console.log('🗑️ Eliminando tarea:', taskId)
      await apiClient.deleteTask(taskId)
      
      // Actualizar la lista local
      setTasks(prevTasks => 
        prevTasks.filter(task => task.id !== taskId)
      )
      
      console.log('✅ Tarea eliminada correctamente')
      
    } catch (error) {
      console.error('❌ Error eliminando tarea:', error)
      setError(`Error al eliminar la tarea: ${error.message}`)
    } finally {
      setDeletingTask(null)
    }
  }

  // Navegación
  const handleViewTask = (taskId: number) => {
    router.push(`/proyectos/${projectId}/tareas/${taskId}`)
  }

  const handleEditTask = (taskId: number) => {
    router.push(`/proyectos/${projectId}/tareas/${taskId}/editar`)
  }

  // Filtrar tareas
  const filteredTasks = Array.isArray(tasks) ? tasks.filter(task => {
    const matchesSearch = task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter
    const matchesAssignee = assigneeFilter === 'all' || task.assignee_id?.toString() === assigneeFilter
    return matchesSearch && matchesStatus && matchesPriority && matchesAssignee
  }) : []

  const formatDate = (dateString: string) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'
  }

  // Obtener lista única de asignados para el filtro
  const uniqueAssignees = tasks.reduce((acc, task) => {
    if (task.assignee && !acc.find(a => a.id === task.assignee.id)) {
      acc.push(task.assignee)
    }
    return acc
  }, [] as any[])

  // Calcular estadísticas
  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    in_progress: tasks.filter(t => t.status === 'in_progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    overdue: tasks.filter(t => 
      t.due_date && new Date(t.due_date) < new Date() && t.status !== 'completed'
    ).length
  }

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-lg">Cargando tareas...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link href="/proyectos">
            <Button variant="outline" size="sm" className="mr-4">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Tareas del Proyecto
            </h1>
            {project && (
              <p className="text-muted-foreground">
                {project.name} • {project.client_name}
              </p>
            )}
          </div>
        </div>
        
        <Link href={`/proyectos/${projectId}/tareas/nueva`}>
          <Button className="bg-teal-600 hover:bg-teal-700">
            <Plus className="h-4 w-4 mr-2" />
            Nueva Tarea
          </Button>
        </Link>
      </div>

      {/* Mensaje de error */}
      {error && (
        <Card className="mb-6 border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-orange-800">
              <div className="text-sm flex-1">{error}</div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={loadProjectAndTasks}
                className="ml-auto"
              >
                Reintentar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Estadísticas */}
      <div className="grid gap-4 md:grid-cols-5 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pendientes</p>
                <p className="text-2xl font-bold text-gray-600">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">En Progreso</p>
                <p className="text-2xl font-bold text-blue-600">{stats.in_progress}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completadas</p>
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <Calendar className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Vencidas</p>
                <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar tareas..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="pending">Pendiente</SelectItem>
                <SelectItem value="in_progress">En Progreso</SelectItem>
                <SelectItem value="completed">Completada</SelectItem>
                <SelectItem value="cancelled">Cancelada</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Prioridad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="low">Baja</SelectItem>
                <SelectItem value="medium">Media</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
                <SelectItem value="urgent">Urgente</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Asignado a" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {uniqueAssignees.map((assignee) => (
                  <SelectItem key={assignee.id} value={assignee.id.toString()}>
                    {assignee.full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de tareas */}
      <Card>
        <CardHeader>
          <CardTitle>
            Tareas ({filteredTasks.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tarea</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Prioridad</TableHead>
                  <TableHead>Asignado a</TableHead>
                  <TableHead>Horas</TableHead>
                  <TableHead>Fecha límite</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Cargando tareas...
                    </TableCell>
                  </TableRow>
                ) : filteredTasks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      No se encontraron tareas
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{task.title}</div>
                          {task.description && (
                            <div className="text-sm text-muted-foreground truncate max-w-xs">
                              {task.description}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          className={statusColors[task.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}
                        >
                          {statusLabels[task.status as keyof typeof statusLabels] || task.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          className={priorityColors[task.priority as keyof typeof priorityColors] || 'bg-gray-100 text-gray-800'}
                        >
                          {priorityLabels[task.priority as keyof typeof priorityLabels] || task.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {task.assignee ? (
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={task.assignee.avatar} alt={task.assignee.full_name} />
                              <AvatarFallback className="text-xs">
                                {getInitials(task.assignee.full_name)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{task.assignee.full_name}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">Sin asignar</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{task.actual_hours || 0}h / {task.estimated_hours || 0}h</div>
                          {task.estimated_hours && (
                            <div className="w-16 bg-gray-200 rounded-full h-1 mt-1">
                              <div 
                                className="bg-blue-600 h-1 rounded-full" 
                                style={{ 
                                  width: `${Math.min(100, ((task.actual_hours || 0) / task.estimated_hours) * 100)}%` 
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {formatDate(task.due_date)}
                          {task.due_date && new Date(task.due_date) < new Date() && task.status !== 'completed' && (
                            <Badge variant="destructive" className="ml-2 text-xs">
                              Vencida
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewTask(task.id)}>
                              <Eye className="h-4 w-4 mr-2" />
                              Ver detalles
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditTask(task.id)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem 
                                  className="text-red-600"
                                  onSelect={(e) => e.preventDefault()}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Eliminar
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="flex items-center gap-2">
                                    <AlertTriangle className="h-5 w-5 text-red-500" />
                                    ¿Eliminar tarea?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    ¿Estás seguro de que quieres eliminar la tarea "<strong>{task.title}</strong>"? 
                                    Esta acción no se puede deshacer.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteTask(task.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                    disabled={deletingTask === task.id}
                                  >
                                    {deletingTask === task.id ? 'Eliminando...' : 'Eliminar'}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
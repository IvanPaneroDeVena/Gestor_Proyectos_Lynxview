'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Calendar, 
  Clock, 
  User,
  AlertTriangle,
  Loader2,
  CheckCircle,
  Play,
  Pause,
  RotateCcw,
  X
} from 'lucide-react'
import { apiClient } from '@/lib/api/client'
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'

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

export default function TaskDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = parseInt(params.id as string)
  const taskId = parseInt(params.taskId as string)
  
  const [task, setTask] = useState<any>(null)
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)

  // Cargar detalles de la tarea
  const loadTask = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('📋 Cargando tarea:', taskId)
      const taskData = await apiClient.getTask(taskId)
      console.log('✅ Tarea cargada:', taskData)
      setTask(taskData)
      
      // Cargar también el proyecto
      const projectData = await apiClient.getProject(projectId)
      setProject(projectData)
      
    } catch (error) {
      console.error('❌ Error cargando tarea:', error)
      setError(`No se pudo cargar la tarea: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (taskId && projectId) {
      loadTask()
    }
  }, [taskId, projectId])

  // Función para eliminar tarea
  const handleDeleteTask = async () => {
    try {
      setDeleting(true)
      
      console.log('🗑️ Eliminando tarea:', taskId)
      await apiClient.deleteTask(taskId)
      
      console.log('✅ Tarea eliminada, redirigiendo...')
      router.push(`/proyectos/${projectId}/tareas`)
      
    } catch (error) {
      console.error('❌ Error eliminando tarea:', error)
      setError(`Error al eliminar la tarea: ${error.message}`)
    } finally {
      setDeleting(false)
    }
  }

  // Función para cambiar estado de la tarea
  const handleStatusChange = async (newStatus: string) => {
    try {
      setUpdatingStatus(true)
      
      const updateData: any = { status: newStatus }
      
      // Si se marca como completada, agregar la fecha de finalización
      if (newStatus === 'completed') {
        updateData.completed_at = new Date().toISOString()
      }
      
      console.log('🔄 Actualizando estado de tarea:', taskId, updateData)
      const updatedTask = await apiClient.updateTask(taskId, updateData)
      
      console.log('✅ Estado actualizado:', updatedTask)
      setTask(updatedTask)
      
    } catch (error) {
      console.error('❌ Error actualizando estado:', error)
      setError(`Error al actualizar el estado: ${error.message}`)
    } finally {
      setUpdatingStatus(false)
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
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

  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'
  }

  const calculateProgress = () => {
    if (!task?.estimated_hours) return 0
    return Math.min(100, ((task.actual_hours || 0) / task.estimated_hours) * 100)
  }

  const isOverdue = () => {
    return task?.due_date && 
           new Date(task.due_date) < new Date() && 
           task.status !== 'completed'
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />
      case 'in_progress': return <Play className="h-4 w-4" />
      case 'completed': return <CheckCircle className="h-4 w-4" />
      case 'cancelled': return <X className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
          <span className="ml-2 text-lg">Cargando tarea...</span>
        </div>
      </div>
    )
  }

  if (error || !task) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center mb-6">
          <Link href={`/proyectos/${projectId}/tareas`}>
            <Button variant="outline" size="sm" className="mr-4">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Error</h1>
        </div>
        
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="text-red-800">
              {error || 'Tarea no encontrada'}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link href={`/proyectos/${projectId}/tareas`}>
            <Button variant="outline" size="sm" className="mr-4">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{task.title}</h1>
            <p className="text-muted-foreground">
              {project?.name} • Tarea #{task.id}
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          {/* Menú de cambio de estado */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" disabled={updatingStatus}>
                {updatingStatus ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  getStatusIcon(task.status)
                )}
                {updatingStatus ? 'Actualizando...' : 'Cambiar Estado'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {task.status !== 'pending' && (
                <DropdownMenuItem onClick={() => handleStatusChange('pending')}>
                  <Clock className="h-4 w-4 mr-2" />
                  Marcar como Pendiente
                </DropdownMenuItem>
              )}
              {task.status !== 'in_progress' && (
                <DropdownMenuItem onClick={() => handleStatusChange('in_progress')}>
                  <Play className="h-4 w-4 mr-2" />
                  Iniciar Trabajo
                </DropdownMenuItem>
              )}
              {task.status !== 'completed' && (
                <DropdownMenuItem onClick={() => handleStatusChange('completed')}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Marcar como Completada
                </DropdownMenuItem>
              )}
              {task.status !== 'cancelled' && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleStatusChange('cancelled')}>
                    <X className="h-4 w-4 mr-2" />
                    Cancelar Tarea
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href={`/proyectos/${projectId}/tareas/${taskId}/editar`}>
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          </Link>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="text-red-600 hover:text-red-700">
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar
              </Button>
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
                  onClick={handleDeleteTask}
                  className="bg-red-600 hover:bg-red-700"
                  disabled={deleting}
                >
                  {deleting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Eliminando...
                    </>
                  ) : (
                    'Eliminar'
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Información Principal */}
        <div className="md:col-span-2 space-y-6">
          {/* Detalles de la tarea */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Detalles de la Tarea</CardTitle>
                <div className="flex gap-2">
                  <Badge 
                    className={statusColors[task.status as keyof typeof statusColors]}
                  >
                    {statusLabels[task.status as keyof typeof statusLabels]}
                  </Badge>
                  <Badge 
                    className={priorityColors[task.priority as keyof typeof priorityColors]}
                  >
                    {priorityLabels[task.priority as keyof typeof priorityLabels]}
                  </Badge>
                  {isOverdue() && (
                    <Badge variant="destructive">
                      Vencida
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {task.description && (
                <div>
                  <h4 className="font-medium mb-2">Descripción</h4>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {task.description}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Asignado a</div>
                    {task.assignee ? (
                      <div className="flex items-center gap-2 mt-1">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={task.assignee.avatar} alt={task.assignee.full_name} />
                          <AvatarFallback className="text-xs">
                            {getInitials(task.assignee.full_name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{task.assignee.full_name}</span>
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground">Sin asignar</div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Creado por</div>
                    {task.created_by ? (
                      <div className="text-sm text-muted-foreground mt-1">
                        {task.created_by.full_name}
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground">-</div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Progreso de Horas */}
          {task.estimated_hours && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Progreso de Horas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Horas trabajadas: {task.actual_hours || 0}h</span>
                    <span>Horas estimadas: {task.estimated_hours}h</span>
                  </div>
                  <Progress value={calculateProgress()} className="h-2" />
                  <div className="text-sm text-muted-foreground">
                    {calculateProgress().toFixed(1)}% completado
                    {calculateProgress() > 100 && (
                      <span className="text-orange-600 ml-2">
                        (Sobrepasando estimación)
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Información de Fechas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Fechas Importantes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm font-medium mb-1">Fecha de inicio</div>
                <div className="text-sm text-muted-foreground">
                  {formatDate(task.start_date)}
                </div>
              </div>
              
              <div>
                <div className="text-sm font-medium mb-1">Fecha límite</div>
                <div className="text-sm text-muted-foreground">
                  {formatDate(task.due_date)}
                  {isOverdue() && (
                    <Badge variant="destructive" className="ml-2 text-xs">
                      Vencida
                    </Badge>
                  )}
                </div>
              </div>
              
              {task.completed_at && (
                <div>
                  <div className="text-sm font-medium mb-1">Fecha de finalización</div>
                  <div className="text-sm text-muted-foreground">
                    {formatDateTime(task.completed_at)}
                  </div>
                </div>
              )}
              
              <Separator />
              
              <div>
                <div className="text-sm font-medium mb-1">Fecha de creación</div>
                <div className="text-sm text-muted-foreground">
                  {formatDateTime(task.created_at)}
                </div>
              </div>
              
              {task.updated_at && (
                <div>
                  <div className="text-sm font-medium mb-1">Última actualización</div>
                  <div className="text-sm text-muted-foreground">
                    {formatDateTime(task.updated_at)}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Historial de Estados */}
          <Card>
            <CardHeader>
              <CardTitle>Información del Proyecto</CardTitle>
            </CardHeader>
            <CardContent>
              {project && (
                <div className="space-y-3">
                  <div>
                    <div className="font-medium text-sm">{project.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {project.client_name}
                    </div>
                  </div>
                  <Badge className={statusColors[project.status as keyof typeof statusColors]}>
                    {statusLabels[project.status as keyof typeof statusLabels] || project.status}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
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
  DollarSign, 
  Clock, 
  User, 
  Users,
  AlertTriangle,
  Loader2
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

export default function ProjectDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = parseInt(params.id as string)
  
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  // Cargar detalles del proyecto
  const loadProject = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('📋 Cargando detalles del proyecto:', projectId)
      const projectData = await apiClient.getProject(projectId)
      console.log('✅ Proyecto cargado:', projectData)
      
      setProject(projectData)
      
    } catch (error) {
      console.error('❌ Error cargando proyecto:', error)
      setError(`No se pudo cargar el proyecto: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (projectId) {
      loadProject()
    }
  }, [projectId])

  // Función para eliminar proyecto
  const handleDeleteProject = async () => {
    try {
      setDeleting(true)
      
      console.log('🗑️ Eliminando proyecto:', projectId)
      await apiClient.deleteProject(projectId)
      
      console.log('✅ Proyecto eliminado, redirigiendo...')
      router.push('/proyectos')
      
    } catch (error) {
      console.error('❌ Error eliminando proyecto:', error)
      setError(`Error al eliminar el proyecto: ${error.message}`)
    } finally {
      setDeleting(false)
    }
  }

  // Calcular progreso basado en fechas
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

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
          <span className="ml-2 text-lg">Cargando proyecto...</span>
        </div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center mb-6">
          <Link href="/proyectos">
            <Button variant="outline" size="sm" className="mr-4">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Error</h1>
        </div>
        
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="text-red-800">
              {error || 'Proyecto no encontrado'}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const progress = calculateProgress(project.start_date, project.end_date)

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
            <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
            <p className="text-muted-foreground">
              Detalles del proyecto
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Link href={`/proyectos/${project.id}/editar`}>
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
                  onClick={handleDeleteProject}
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
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Información General</CardTitle>
                <Badge 
                  className={statusColors[project.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}
                >
                  {statusLabels[project.status as keyof typeof statusLabels] || project.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {project.description && (
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-2">Descripción</h4>
                  <p className="text-sm">{project.description}</p>
                </div>
              )}
              
              <Separator />
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Cliente</div>
                    <div className="text-sm text-muted-foreground">
                      {project.client_name || 'No especificado'}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Presupuesto</div>
                    <div className="text-sm text-muted-foreground">
                      {project.budget ? formatCurrency(project.budget) : 'No especificado'}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Tarifa por hora</div>
                    <div className="text-sm text-muted-foreground">
                      {project.hourly_rate ? `${formatCurrency(project.hourly_rate)}/h` : 'No especificado'}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Fecha de creación</div>
                    <div className="text-sm text-muted-foreground">
                      {formatDateTime(project.created_at)}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Progreso del Proyecto */}
          <Card>
            <CardHeader>
              <CardTitle>Progreso del Proyecto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Progreso estimado</span>
                <span className="text-sm text-muted-foreground">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <div className="text-sm font-medium">Fecha de inicio</div>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(project.start_date)}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium">Fecha de finalización</div>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(project.end_date)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Equipo del Proyecto */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Equipo del Proyecto
              </CardTitle>
            </CardHeader>
            <CardContent>
              {project.members && project.members.length > 0 ? (
                <div className="space-y-3">
                  {project.members.map((member: any) => (
                    <div key={member.id} className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>
                          {member.name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="text-sm font-medium">{member.name}</div>
                        <div className="text-xs text-muted-foreground">{member.role}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground text-center py-4">
                  No hay miembros asignados
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tecnologías */}
          <Card>
            <CardHeader>
              <CardTitle>Tecnologías</CardTitle>
            </CardHeader>
            <CardContent>
              {project.technologies && project.technologies.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech: any) => (
                    <Badge key={tech.id} variant="secondary">
                      {tech.name}
                    </Badge>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground text-center py-4">
                  No hay tecnologías especificadas
                </div>
              )}
            </CardContent>
          </Card>

          {/* Estadísticas */}
          <Card>
            <CardHeader>
              <CardTitle>Estadísticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Tareas totales</span>
                <span className="text-sm font-medium">
                  {project.tasks?.length || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Tiempo registrado</span>
                <span className="text-sm font-medium">
                  {project.time_entries?.length || 0} entradas
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Facturas</span>
                <span className="text-sm font-medium">
                  {project.invoices?.length || 0}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Loader2, ArrowLeft, Save, Calendar, User } from 'lucide-react'
import { apiClient } from '@/lib/api/client'

interface TaskCreateData {
  title: string
  description: string
  status: string
  priority: string
  project_id: number
  assignee_id?: number
  estimated_hours?: number
  start_date: string
  due_date: string
}

const statusLabels = {
  pending: 'Pendiente',
  in_progress: 'En Progreso',
  completed: 'Completada',
  cancelled: 'Cancelada'
}

const priorityLabels = {
  low: 'Baja',
  medium: 'Media',
  high: 'Alta',
  urgent: 'Urgente'
}

const statusColors = {
  pending: 'bg-gray-100 text-gray-800',
  in_progress: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
}

const priorityColors = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800'
}

export default function NewTaskPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = parseInt(params.id as string)
  
  const [project, setProject] = useState<any>(null)
  const [teamMembers, setTeamMembers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Estado del formulario
  const [formData, setFormData] = useState<TaskCreateData>({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    project_id: projectId,
    assignee_id: undefined,
    estimated_hours: undefined,
    start_date: '',
    due_date: ''
  })

  // Cargar datos necesarios
  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('📋 Cargando datos para nueva tarea...')
      
      // Cargar proyecto
      const projectData = await apiClient.getProject(projectId)
      console.log('✅ Proyecto cargado:', projectData)
      setProject(projectData)
      
      // Cargar miembros del equipo
      const usersData = await apiClient.getUsers({ is_active: true })
      console.log('✅ Usuarios cargados:', usersData)
      
      // Manejar diferentes formatos de respuesta
      let usersArray = []
      if (Array.isArray(usersData)) {
        usersArray = usersData
      } else if (usersData && Array.isArray(usersData.data)) {
        usersArray = usersData.data
      } else {
        usersArray = []
      }
      
      setTeamMembers(usersArray)
      
    } catch (error) {
      console.error('❌ Error cargando datos:', error)
      setError(`No se pudieron cargar los datos: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (projectId) {
      loadData()
    }
  }, [projectId])

  // Manejar cambios en inputs
  const handleInputChange = (field: keyof TaskCreateData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Enviar formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setSaving(true)
      setError(null)

      // Validaciones básicas
      if (!formData.title) {
        throw new Error('El título es obligatorio')
      }

      // Preparar datos para enviar
      const taskData = {
        ...formData,
        // Convertir fechas al formato correcto para la API
        start_date: formData.start_date ? `${formData.start_date}T09:00:00` : undefined,
        due_date: formData.due_date ? `${formData.due_date}T18:00:00` : undefined,
        // Asegurar que los campos opcionales sean undefined si están vacíos
        assignee_id: formData.assignee_id || undefined,
        estimated_hours: formData.estimated_hours || undefined,
        // Agregar created_by_id (esto debería venir del usuario actual en una app real)
        created_by_id: 1 // Temporal - debería ser el ID del usuario autenticado
      }

      console.log('📝 Creando nueva tarea:', taskData)
      const newTask = await apiClient.createTask(taskData)
      
      console.log('✅ Tarea creada:', newTask)
      
      // Redirigir a la lista de tareas del proyecto
      router.push(`/proyectos/${projectId}/tareas`)
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      console.error('Error creating task:', err)
    } finally {
      setSaving(false)
    }
  }

  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'
  }

  const selectedAssignee = formData.assignee_id ? teamMembers.find(member => member.id === formData.assignee_id) : null

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
          <span className="ml-2 text-lg">Cargando...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Link href={`/proyectos/${projectId}/tareas`}>
          <Button variant="outline" size="sm" className="mr-4">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nueva Tarea</h1>
          {project && (
            <p className="text-muted-foreground">
              Proyecto: {project.name}
            </p>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Error message */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="text-red-800">
                Error: {error}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 md:grid-cols-3">
          {/* Información de la tarea */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Información de la Tarea</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Título */}
              <div>
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  placeholder="Ej: Implementar sistema de autenticación"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  required
                />
              </div>

              {/* Descripción */}
              <div>
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  placeholder="Describe los detalles de la tarea..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                />
              </div>

              {/* Estado y Prioridad */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="status">Estado</Label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(statusLabels).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="priority">Prioridad</Label>
                  <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(priorityLabels).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Asignado a */}
              <div>
                <Label htmlFor="assignee_id">Asignado a</Label>
                <Select 
                  value={formData.assignee_id?.toString() || 'unassigned'} 
                  onValueChange={(value) => handleInputChange('assignee_id', value === 'unassigned' ? undefined : parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar miembro del equipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">Sin asignar</SelectItem>
                    {teamMembers.map((member) => (
                      <SelectItem key={member.id} value={member.id.toString()}>
                        {member.full_name} • {member.role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Horas estimadas */}
              <div>
                <Label htmlFor="estimated_hours">Horas Estimadas</Label>
                <Input
                  id="estimated_hours"
                  type="number"
                  min="0"
                  step="0.5"
                  placeholder="Ej: 8"
                  value={formData.estimated_hours || ''}
                  onChange={(e) => handleInputChange('estimated_hours', e.target.value ? parseFloat(e.target.value) : undefined)}
                />
              </div>

              {/* Fechas */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start_date">Fecha de Inicio</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => handleInputChange('start_date', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="due_date">Fecha Límite</Label>
                  <Input
                    id="due_date"
                    type="date"
                    value={formData.due_date}
                    onChange={(e) => handleInputChange('due_date', e.target.value)}
                    min={formData.start_date}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vista previa */}
          <Card>
            <CardHeader>
              <CardTitle>Vista Previa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Título y estado */}
              <div>
                <h3 className="font-medium text-lg mb-2">
                  {formData.title || 'Título de la tarea'}
                </h3>
                <div className="flex gap-2 mb-3">
                  <Badge className={statusColors[formData.status as keyof typeof statusColors]}>
                    {statusLabels[formData.status as keyof typeof statusLabels]}
                  </Badge>
                  <Badge className={priorityColors[formData.priority as keyof typeof priorityColors]}>
                    {priorityLabels[formData.priority as keyof typeof priorityLabels]}
                  </Badge>
                </div>
              </div>

              {/* Descripción */}
              {formData.description && (
                <div>
                  <Label className="text-xs">Descripción</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {formData.description}
                  </p>
                </div>
              )}

              {/* Asignado a */}
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <Label className="text-xs">Asignado a</Label>
                  {selectedAssignee ? (
                    <div className="flex items-center gap-2 mt-1">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={selectedAssignee.avatar} alt={selectedAssignee.full_name} />
                        <AvatarFallback className="text-xs">
                          {getInitials(selectedAssignee.full_name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{selectedAssignee.full_name}</span>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground mt-1">Sin asignar</div>
                  )}
                </div>
              </div>

              {/* Horas estimadas */}
              {formData.estimated_hours && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <Label className="text-xs">Horas estimadas</Label>
                    <div className="text-sm mt-1">{formData.estimated_hours}h</div>
                  </div>
                </div>
              )}

              {/* Fechas */}
              {(formData.start_date || formData.due_date) && (
                <div>
                  <Label className="text-xs">Fechas</Label>
                  <div className="text-sm mt-1">
                    {formData.start_date && (
                      <div>Inicio: {new Date(formData.start_date).toLocaleDateString('es-ES')}</div>
                    )}
                    {formData.due_date && (
                      <div>Límite: {new Date(formData.due_date).toLocaleDateString('es-ES')}</div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Botones de acción */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-end gap-4">
              <Link href={`/proyectos/${projectId}/tareas`}>
                <Button type="button" variant="outline" disabled={saving}>
                  Cancelar
                </Button>
              </Link>
              <Button type="submit" disabled={saving} className="bg-teal-600 hover:bg-teal-700">
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Crear Tarea
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
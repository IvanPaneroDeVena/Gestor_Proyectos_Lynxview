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
import { Separator } from '@/components/ui/separator'
import { Loader2, ArrowLeft, Save, Calendar, User, Clock, CheckCircle } from 'lucide-react'
import { apiClient } from '@/lib/api/client'
import { Switch } from '@/components/ui/switch'

interface TaskEditData {
  title: string
  description: string
  status: string
  priority: string
  assignee_id?: number
  estimated_hours?: number
  actual_hours?: number
  start_date: string
  due_date: string
  completed_at?: string
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

export default function EditTaskPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = parseInt(params.id as string)
  const taskId = parseInt(params.taskId as string)
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [teamMembers, setTeamMembers] = useState<any[]>([])
  const [project, setProject] = useState<any>(null)
  
  // Estado del formulario
  const [formData, setFormData] = useState<TaskEditData>({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    assignee_id: undefined,
    estimated_hours: undefined,
    actual_hours: undefined,
    start_date: '',
    due_date: '',
    completed_at: undefined
  })

  // Estado para auto-completar
  const [autoComplete, setAutoComplete] = useState(false)

  // Cargar datos de la tarea
  const loadTask = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('📋 Cargando tarea para editar:', taskId)
      
      // Cargar tarea
      const task = await apiClient.getTask(taskId)
      console.log('✅ Tarea cargada:', task)
      
      // Cargar proyecto
      const projectData = await apiClient.getProject(projectId)
      setProject(projectData)
      
      // Cargar miembros del equipo
      const usersData = await apiClient.getUsers({ is_active: true })
      let usersArray = []
      if (Array.isArray(usersData)) {
        usersArray = usersData
      } else if (usersData && Array.isArray(usersData.data)) {
        usersArray = usersData.data
      }
      setTeamMembers(usersArray)
      
      // Convertir fechas al formato de input
      const formatDateForInput = (dateString: string) => {
        if (!dateString) return ''
        return dateString.split('T')[0]
      }
      
      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'pending',
        priority: task.priority || 'medium',
        assignee_id: task.assignee_id || undefined,
        estimated_hours: task.estimated_hours || undefined,
        actual_hours: task.actual_hours || undefined,
        start_date: formatDateForInput(task.start_date),
        due_date: formatDateForInput(task.due_date),
        completed_at: task.completed_at
      })
      
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

  // Manejar cambios en inputs
  const handleInputChange = (field: keyof TaskEditData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Manejar cambio de estado con auto-completar
  const handleStatusChange = (newStatus: string) => {
    const updates: any = { status: newStatus }
    
    // Si se marca como completada y auto-completar está activado
    if (newStatus === 'completed' && autoComplete) {
      updates.completed_at = new Date().toISOString()
      // Si no hay horas reales registradas, usar las estimadas
      if (!formData.actual_hours && formData.estimated_hours) {
        updates.actual_hours = formData.estimated_hours
      }
    }
    
    // Si se desmarca como completada, limpiar completed_at
    if (newStatus !== 'completed') {
      updates.completed_at = undefined
    }
    
    setFormData(prev => ({ ...prev, ...updates }))
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
        actual_hours: formData.actual_hours || undefined,
        completed_at: formData.completed_at || undefined
      }

      console.log('💾 Actualizando tarea:', taskId, taskData)
      const updatedTask = await apiClient.updateTask(taskId, taskData)
      
      console.log('✅ Tarea actualizada:', updatedTask)
      
      // Redirigir a los detalles de la tarea
      router.push(`/proyectos/${projectId}/tareas/${taskId}`)
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      console.error('Error updating task:', err)
    } finally {
      setSaving(false)
    }
  }

  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'
  }

  const selectedAssignee = formData.assignee_id ? teamMembers.find(member => member.id === formData.assignee_id) : null

  const calculateProgress = () => {
    if (!formData.estimated_hours) return 0
    return Math.min(100, ((formData.actual_hours || 0) / formData.estimated_hours) * 100)
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

  if (error && !formData.title) {
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
            <div className="text-red-800">{error}</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Link href={`/proyectos/${projectId}/tareas/${taskId}`}>
          <Button variant="outline" size="sm" className="mr-4">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Editar Tarea</h1>
          <p className="text-muted-foreground">
            {project?.name} • Modificar "{formData.title}"
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Mensaje de error */}
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
                  <Select value={formData.status} onValueChange={handleStatusChange}>
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

              {/* Auto-completar cuando se marca como completada */}
              <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
                <Switch
                  id="auto_complete"
                  checked={autoComplete}
                  onCheckedChange={setAutoComplete}
                />
                <div className="flex-1">
                  <Label htmlFor="auto_complete" className="font-medium">
                    Auto-completar al marcar como terminada
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Automáticamente establecer fecha de finalización y horas reales
                  </p>
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

              {/* Horas */}
              <div className="grid grid-cols-2 gap-4">
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
                <div>
                  <Label htmlFor="actual_hours">Horas Reales</Label>
                  <Input
                    id="actual_hours"
                    type="number"
                    min="0"
                    step="0.1"
                    placeholder="Ej: 6.5"
                    value={formData.actual_hours || ''}
                    onChange={(e) => handleInputChange('actual_hours', e.target.value ? parseFloat(e.target.value) : undefined)}
                  />
                </div>
              </div>

              {/* Progreso de horas */}
              {formData.estimated_hours && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progreso: {formData.actual_hours || 0}h / {formData.estimated_hours}h</span>
                    <span>{calculateProgress().toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all" 
                      style={{ width: `${Math.min(100, calculateProgress())}%` }}
                    />
                  </div>
                  {calculateProgress() > 100 && (
                    <p className="text-sm text-orange-600 mt-1">
                      ⚠️ Sobrepasando la estimación inicial
                    </p>
                  )}
                </div>
              )}

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

              {/* Fecha de finalización (solo si está completada) */}
              {formData.status === 'completed' && (
                <div>
                  <Label htmlFor="completed_at">Fecha de Finalización</Label>
                  <Input
                    id="completed_at"
                    type="datetime-local"
                    value={formData.completed_at ? new Date(formData.completed_at).toISOString().slice(0, 16) : ''}
                    onChange={(e) => handleInputChange('completed_at', e.target.value ? new Date(e.target.value).toISOString() : '')}
                  />
                </div>
              )}
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
                  {formData.status === 'completed' && (
                    <Badge variant="outline" className="text-green-600">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Finalizada
                    </Badge>
                  )}
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

              <Separator />

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

              {/* Horas */}
              {(formData.estimated_hours || formData.actual_hours) && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <Label className="text-xs">Horas</Label>
                    <div className="text-sm mt-1">
                      {formData.actual_hours || 0}h / {formData.estimated_hours || 0}h
                    </div>
                  </div>
                </div>
              )}

              {/* Fechas */}
              {(formData.start_date || formData.due_date) && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <Label className="text-xs">Fechas</Label>
                    <div className="text-sm mt-1">
                      {formData.start_date && (
                        <div>Inicio: {new Date(formData.start_date).toLocaleDateString('es-ES')}</div>
                      )}
                      {formData.due_date && (
                        <div>Límite: {new Date(formData.due_date).toLocaleDateString('es-ES')}</div>
                      )}
                      {formData.completed_at && (
                        <div className="text-green-600">
                          Finalizada: {new Date(formData.completed_at).toLocaleDateString('es-ES')}
                        </div>
                      )}
                    </div>
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
              <Link href={`/proyectos/${projectId}/tareas/${taskId}`}>
                <Button type="button" variant="outline" disabled={saving}>
                  Cancelar
                </Button>
              </Link>
              <Button type="submit" disabled={saving} className="bg-teal-600 hover:bg-teal-700">
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Guardar Cambios
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
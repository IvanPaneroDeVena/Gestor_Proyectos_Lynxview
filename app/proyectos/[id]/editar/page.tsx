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
import { Loader2, ArrowLeft, Save } from 'lucide-react'
import { apiClient } from '@/lib/api/client'

interface ProjectEditData {
  name: string
  description: string
  client_name: string
  status: string
  budget?: number
  hourly_rate?: number
  start_date: string
  end_date: string
}

export default function EditProjectPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = parseInt(params.id as string)
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Estado del formulario
  const [formData, setFormData] = useState<ProjectEditData>({
    name: '',
    description: '',
    client_name: '',
    status: 'planning',
    budget: undefined,
    hourly_rate: undefined,
    start_date: '',
    end_date: '',
  })

  // Cargar datos del proyecto
  const loadProject = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('📋 Cargando proyecto para editar:', projectId)
      const project = await apiClient.getProject(projectId)
      console.log('✅ Proyecto cargado:', project)
      
      // Convertir fechas al formato de input date
      const formatDateForInput = (dateString: string) => {
        if (!dateString) return ''
        return dateString.split('T')[0]
      }
      
      setFormData({
        name: project.name || '',
        description: project.description || '',
        client_name: project.client_name || '',
        status: project.status || 'planning',
        budget: project.budget || undefined,
        hourly_rate: project.hourly_rate || undefined,
        start_date: formatDateForInput(project.start_date),
        end_date: formatDateForInput(project.end_date),
      })
      
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

  // Manejar cambios en inputs
  const handleInputChange = (field: keyof ProjectEditData, value: string | number) => {
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

      // Preparar datos para enviar
      const updateData = {
        ...formData,
        // Convertir fechas al formato correcto para la API
        start_date: formData.start_date ? `${formData.start_date}T09:00:00` : undefined,
        end_date: formData.end_date ? `${formData.end_date}T18:00:00` : undefined,
        // Eliminar campos vacíos
        budget: formData.budget || undefined,
        hourly_rate: formData.hourly_rate || undefined,
      }

      console.log('💾 Actualizando proyecto:', projectId, updateData)
      const updatedProject = await apiClient.updateProject(projectId, updateData)
      
      console.log('✅ Proyecto actualizado:', updatedProject)
      
      // Redirigir a la vista de detalles
      router.push(`/proyectos/${projectId}`)
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      console.error('Error updating project:', err)
    } finally {
      setSaving(false)
    }
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

  if (error && !formData.name) {
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
            <div className="text-red-800">{error}</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Link href={`/proyectos/${projectId}`}>
          <Button variant="outline" size="sm" className="mr-4">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Editar Proyecto</h1>
          <p className="text-muted-foreground">
            Modifica la información del proyecto
          </p>
        </div>
      </div>

      {/* Formulario */}
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

        <div className="grid gap-6 md:grid-cols-2">
          {/* Información Básica */}
          <Card>
            <CardHeader>
              <CardTitle>Información Básica</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Nombre del proyecto */}
              <div>
                <Label htmlFor="name">Nombre del Proyecto *</Label>
                <Input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Ej: E-commerce Platform"
                />
              </div>

              {/* Descripción */}
              <div>
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe el proyecto en detalle..."
                  rows={4}
                />
              </div>

              {/* Cliente */}
              <div>
                <Label htmlFor="client_name">Cliente</Label>
                <Input
                  id="client_name"
                  type="text"
                  value={formData.client_name}
                  onChange={(e) => handleInputChange('client_name', e.target.value)}
                  placeholder="Ej: TechStore Solutions"
                />
              </div>

              {/* Estado */}
              <div>
                <Label htmlFor="status">Estado</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleInputChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planning">Planificación</SelectItem>
                    <SelectItem value="active">Activo</SelectItem>
                    <SelectItem value="on_hold">En Pausa</SelectItem>
                    <SelectItem value="completed">Completado</SelectItem>
                    <SelectItem value="cancelled">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Información Financiera y Fechas */}
          <Card>
            <CardHeader>
              <CardTitle>Detalles del Proyecto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Presupuesto */}
              <div>
                <Label htmlFor="budget">Presupuesto (€)</Label>
                <Input
                  id="budget"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.budget || ''}
                  onChange={(e) => handleInputChange('budget', e.target.value ? parseFloat(e.target.value) : undefined)}
                  placeholder="15000.00"
                />
              </div>

              {/* Tarifa por hora */}
              <div>
                <Label htmlFor="hourly_rate">Tarifa por Hora (€)</Label>
                <Input
                  id="hourly_rate"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.hourly_rate || ''}
                  onChange={(e) => handleInputChange('hourly_rate', e.target.value ? parseFloat(e.target.value) : undefined)}
                  placeholder="75.00"
                />
              </div>

              {/* Fechas */}
              <div className="grid grid-cols-1 gap-4">
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
                  <Label htmlFor="end_date">Fecha de Finalización</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => handleInputChange('end_date', e.target.value)}
                    min={formData.start_date} // No permitir fecha anterior al inicio
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Botones de acción */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-end space-x-4">
              <Link href={`/proyectos/${projectId}`}>
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
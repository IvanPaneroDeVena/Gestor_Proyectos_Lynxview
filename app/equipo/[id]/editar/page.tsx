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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Loader2, ArrowLeft, Save, X, Plus } from 'lucide-react'
import { apiClient } from '@/lib/api/client'
import { TechnologySelector } from '@/components/technology-selector'
import { Switch } from '@/components/ui/switch'

interface UserEditData {
  email: string
  username: string
  full_name: string
  role: string
  seniority: string
  department: string
  hourly_rate?: number
  skills: string[]
  is_active: boolean
}

const roleLabels = {
  frontend: 'Desarrollador/a Frontend',
  backend: 'Desarrollador/a Backend',
  fullstack: 'Desarrollador/a Full Stack',
  uxui: 'Diseñador/a UX/UI',
  devops: 'DevOps',
  qa: 'QA Tester',
  pm: 'Project Manager'
}

export default function EditMemberPage() {
  const params = useParams()
  const router = useRouter()
  const memberId = parseInt(params.id as string)
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Estado del formulario
  const [formData, setFormData] = useState<UserEditData>({
    email: '',
    username: '',
    full_name: '',
    role: '',
    seniority: '',
    department: '',
    hourly_rate: undefined,
    skills: [],
    is_active: true
  })

  // Estados adicionales para la UI
  const [techInput, setTechInput] = useState('')

  // Cargar datos del miembro
  const loadMember = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('👤 Cargando miembro para editar:', memberId)
      const member = await apiClient.getUser(memberId)
      console.log('✅ Miembro cargado:', member)
      
      // Parsear skills de JSON a array
      const parseSkills = (skillsJson: string) => {
        try {
          return skillsJson ? JSON.parse(skillsJson) : []
        } catch {
          return []
        }
      }
      
      setFormData({
        email: member.email || '',
        username: member.username || '',
        full_name: member.full_name || '',
        role: member.role || '',
        seniority: member.seniority || '',
        department: member.department || '',
        hourly_rate: member.hourly_rate || undefined,
        skills: parseSkills(member.skills),
        is_active: member.is_active ?? true
      })
      
    } catch (error) {
      console.error('❌ Error cargando miembro:', error)
      setError(`No se pudo cargar el miembro: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (memberId) {
      loadMember()
    }
  }, [memberId])

  // Manejar cambios en inputs
  const handleInputChange = (field: keyof UserEditData, value: string | number | boolean | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Manejar tecnologías
  const handleTechnologiesChange = (technologies: string[]) => {
    setFormData(prev => ({ ...prev, skills: technologies }))
  }

  const handleAddTechnology = () => {
    if (techInput.trim() && !formData.skills.includes(techInput.trim())) {
      const newSkills = [...formData.skills, techInput.trim()]
      setFormData(prev => ({ ...prev, skills: newSkills }))
      setTechInput('')
    }
  }

  const handleRemoveTechnology = (tech: string) => {
    const newSkills = formData.skills.filter(t => t !== tech)
    setFormData(prev => ({ ...prev, skills: newSkills }))
  }

  // Enviar formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setSaving(true)
      setError(null)

      // Validaciones básicas
      if (!formData.email || !formData.full_name) {
        throw new Error('Por favor completa los campos obligatorios')
      }

      // Preparar datos para enviar
      const userData = {
        ...formData,
        // Convertir skills array a JSON string para la BD
        skills: JSON.stringify(formData.skills),
        // Asegurar que hourly_rate sea number o undefined
        hourly_rate: formData.hourly_rate || undefined
      }

      console.log('💾 Actualizando miembro:', memberId, userData)
      const updatedMember = await apiClient.updateUser(memberId, userData)
      
      console.log('✅ Miembro actualizado:', updatedMember)
      
      // Redirigir al perfil
      router.push(`/equipo/${memberId}`)
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      console.error('Error updating member:', err)
    } finally {
      setSaving(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase() || 'NM'
  }

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          <span className="ml-2 text-lg">Cargando miembro...</span>
        </div>
      </div>
    )
  }

  if (error && !formData.full_name) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center mb-6">
          <Link href="/equipo">
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
        <Link href={`/equipo/${memberId}`}>
          <Button variant="outline" size="sm" className="mr-4">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Editar Miembro</h1>
          <p className="text-muted-foreground">
            Modifica la información de {formData.full_name}
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
          {/* Información Personal */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Información Personal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Nombre Completo *</Label>
                <Input
                  id="full_name"
                  placeholder="Ej: María García López"
                  value={formData.full_name}
                  onChange={(e) => handleInputChange('full_name', e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Correo Electrónico *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Ej: maria.garcia@empresa.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Nombre de Usuario</Label>
                  <Input
                    id="username"
                    placeholder="Nombre de usuario"
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="role">Rol / Puesto</Label>
                  <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un rol" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(roleLabels).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="seniority">Seniority</Label>
                  <Select value={formData.seniority} onValueChange={(value) => handleInputChange('seniority', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona nivel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Junior">Junior</SelectItem>
                      <SelectItem value="Mid">Mid</SelectItem>
                      <SelectItem value="Senior">Senior</SelectItem>
                      <SelectItem value="Lead">Lead</SelectItem>
                      <SelectItem value="Principal">Principal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="department">Departamento</Label>
                  <Input
                    id="department"
                    placeholder="Ej: Desarrollo, Diseño, QA..."
                    value={formData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hourly_rate">Tarifa por Hora (€)</Label>
                  <Input
                    id="hourly_rate"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Ej: 75.00"
                    value={formData.hourly_rate || ''}
                    onChange={(e) => handleInputChange('hourly_rate', e.target.value ? parseFloat(e.target.value) : undefined)}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => handleInputChange('is_active', checked)}
                />
                <Label htmlFor="is_active">Miembro activo</Label>
              </div>
            </CardContent>
          </Card>

          {/* Vista Previa */}
          <Card>
            <CardHeader>
              <CardTitle>Vista Previa</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={`/avatars/${memberId}.jpg`} alt={formData.full_name || "Miembro"} />
                <AvatarFallback className="text-lg">
                  {getInitials(formData.full_name)}
                </AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-medium">{formData.full_name || "Nombre del miembro"}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {roleLabels[formData.role as keyof typeof roleLabels] || "Rol / Puesto"}
              </p>
              {formData.seniority && (
                <p className="text-xs text-muted-foreground">
                  {formData.seniority}
                </p>
              )}
              <div className="mt-4 flex flex-wrap justify-center gap-1">
                {formData.skills.length > 0 ? (
                  formData.skills.slice(0, 6).map((tech) => (
                    <Badge key={tech} variant="outline" className="text-xs bg-blue-50">
                      {tech}
                    </Badge>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground">No hay tecnologías añadidas</p>
                )}
                {formData.skills.length > 6 && (
                  <Badge variant="outline" className="text-xs">
                    +{formData.skills.length - 6}
                  </Badge>
                )}
              </div>
              {formData.hourly_rate && (
                <div className="mt-4 text-sm">
                  <span className="font-medium">Tarifa:</span> €{formData.hourly_rate}/h
                </div>
              )}
              {!formData.is_active && (
                <Badge variant="destructive" className="mt-2">
                  Inactivo
                </Badge>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tecnologías */}
        <Card>
          <CardHeader>
            <CardTitle>Tecnologías y Habilidades</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Añadir tecnología manualmente */}
            <div className="flex gap-2">
              <Input
                placeholder="Añadir tecnología personalizada..."
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddTechnology()
                  }
                }}
              />
              <Button type="button" onClick={handleAddTechnology} variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Tecnologías seleccionadas */}
            {formData.skills.length > 0 && (
              <div>
                <Label className="mb-2 block">Tecnologías seleccionadas</Label>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((tech) => (
                    <Badge key={tech} variant="secondary" className="flex items-center gap-1 p-1 pr-2">
                      {tech}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 ml-1 rounded-full"
                        onClick={() => handleRemoveTechnology(tech)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <Separator />

            {/* Selector de tecnologías del catálogo */}
            <TechnologySelector
              selectedTechnologies={formData.skills}
              onTechnologiesChange={handleTechnologiesChange}
              label="Tecnologías del catálogo"
              placeholder="Buscar en el catálogo de tecnologías..."
            />
          </CardContent>
        </Card>

        {/* Botones de acción */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-end gap-4">
              <Link href={`/equipo/${memberId}`}>
                <Button type="button" variant="outline" disabled={saving}>
                  Cancelar
                </Button>
              </Link>
              <Button type="submit" disabled={saving} className="bg-purple-700 hover:bg-purple-800">
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
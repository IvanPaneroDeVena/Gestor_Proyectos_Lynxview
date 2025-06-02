'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus, X, Save, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { TechnologySelector } from '@/components/technology-selector'
import { apiClient } from '@/lib/api/client'

interface UserCreateData {
  email: string
  username: string
  full_name: string
  role: string
  seniority: string
  department: string
  hourly_rate?: number
  skills: string[] // Array que se convertirá a JSON
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

// Tecnologías sugeridas por rol (esto se mantiene como fallback)
const suggestedTechByRole = {
  frontend: ['React', 'Angular', 'Vue.js', 'TypeScript', 'JavaScript', 'HTML/CSS', 'Tailwind CSS', 'SCSS'],
  backend: ['Node.js', 'Python', 'Java', 'PHP', 'Ruby', 'Go', 'Express', 'Django', 'Spring Boot', 'Laravel'],
  fullstack: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'PostgreSQL', 'Docker', 'Git', 'REST APIs'],
  uxui: ['Figma', 'Sketch', 'Adobe XD', 'Photoshop', 'Illustrator', 'Prototyping', 'User Research'],
  devops: ['Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure', 'Jenkins', 'GitLab CI', 'Terraform', 'Ansible'],
  qa: ['Cypress', 'Jest', 'Selenium', 'Postman', 'JUnit', 'TestRail', 'Automation Testing'],
  pm: ['Jira', 'Trello', 'Asana', 'Scrum', 'Kanban', 'Agile', 'Project Planning', 'Risk Management']
}

export default function NuevoMiembroPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Estado del formulario
  const [formData, setFormData] = useState<UserCreateData>({
    email: '',
    username: '',
    full_name: '',
    role: '',
    seniority: '',
    department: '',
    hourly_rate: undefined,
    skills: []
  })

  // Estados adicionales para la UI
  const [techInput, setTechInput] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)

  // Manejar cambios en inputs
  const handleInputChange = (field: keyof UserCreateData, value: string | number | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Mostrar sugerencias cuando se selecciona un rol
    if (field === 'role' && typeof value === 'string') {
      setShowSuggestions(true)
    }

    // Generar username automáticamente del nombre
    if (field === 'full_name' && typeof value === 'string') {
      const username = value.toLowerCase()
        .replace(/\s+/g, '.')
        .replace(/[^a-z0-9.]/g, '')
      setFormData(prev => ({ ...prev, username }))
    }
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

  const handleAddSuggestedTechnology = (tech: string) => {
    if (!formData.skills.includes(tech)) {
      const newSkills = [...formData.skills, tech]
      setFormData(prev => ({ ...prev, skills: newSkills }))
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
      setLoading(true)
      setError(null)

      // Validaciones básicas
      if (!formData.email || !formData.full_name || !formData.role) {
        throw new Error('Por favor completa los campos obligatorios')
      }

      // Preparar datos para enviar
      const userData = {
        ...formData,
        // Convertir skills array a JSON string para la BD
        skills: JSON.stringify(formData.skills),
        // Contraseña temporal (debería enviarse por email en producción)
        password: 'temporal123',
        // Campos adicionales requeridos por el modelo
        is_active: true,
        is_superuser: false
      }

      console.log('👤 Creando nuevo miembro:', userData)
      const newMember = await apiClient.createUser(userData)
      
      console.log('✅ Miembro creado:', newMember)
      
      // Redirigir a la lista del equipo
      router.push('/equipo')
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      console.error('Error creating member:', err)
    } finally {
      setLoading(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase() || 'NM'
  }

  const getSuggestedTechnologies = () => {
    if (!formData.role) return []
    return suggestedTechByRole[formData.role as keyof typeof suggestedTechByRole] || []
  }

  return (
    <div className="container mx-auto py-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/equipo">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Volver</span>
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nuevo Miembro</h1>
          <p className="text-muted-foreground">Añade un nuevo miembro al equipo</p>
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
              <CardDescription>Introduce los datos básicos del nuevo miembro</CardDescription>
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
                    placeholder="Se genera automáticamente"
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Se genera automáticamente del nombre, pero puedes modificarlo
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="role">Rol / Puesto *</Label>
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
            </CardContent>
          </Card>

          {/* Vista Previa */}
          <Card>
            <CardHeader>
              <CardTitle>Vista Previa</CardTitle>
              <CardDescription>Así se verá el perfil del miembro</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage alt={formData.full_name || "Nuevo miembro"} />
                <AvatarFallback>{getInitials(formData.full_name)}</AvatarFallback>
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
            </CardContent>
          </Card>
        </div>

        {/* Tecnologías */}
        <Card>
          <CardHeader>
            <CardTitle>Tecnologías y Habilidades</CardTitle>
            <CardDescription>
              Gestiona las tecnologías que domina este miembro
            </CardDescription>
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

            {/* Sugerencias basadas en el rol */}
            {showSuggestions && formData.role && (
              <div>
                <Label className="mb-2 block">
                  Tecnologías sugeridas para {roleLabels[formData.role as keyof typeof roleLabels]}
                </Label>
                <div className="flex flex-wrap gap-2">
                  {getSuggestedTechnologies()
                    .filter(tech => !formData.skills.includes(tech))
                    .map((tech) => (
                      <Badge
                        key={tech}
                        variant="outline"
                        className="cursor-pointer hover:bg-blue-50"
                        onClick={() => handleAddSuggestedTechnology(tech)}
                      >
                        {tech}
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
              <Link href="/equipo">
                <Button type="button" variant="outline" disabled={loading}>
                  Cancelar
                </Button>
              </Link>
              <Button type="submit" disabled={loading} className="bg-purple-700 hover:bg-purple-800">
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Guardar Miembro
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
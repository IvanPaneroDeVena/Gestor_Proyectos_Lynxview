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
  Mail, 
  Phone, 
  Calendar, 
  DollarSign, 
  Clock, 
  Building,
  User,
  AlertTriangle,
  Loader2,
  Star,
  Award
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

const roleLabels = {
  frontend: 'Frontend Developer',
  backend: 'Backend Developer',
  fullstack: 'Full Stack Developer',
  uxui: 'UX/UI Designer',
  devops: 'DevOps',
  qa: 'QA Tester',
  pm: 'Project Manager'
}

const roleColors = {
  frontend: 'bg-blue-100 text-blue-800',
  backend: 'bg-green-100 text-green-800',
  fullstack: 'bg-purple-100 text-purple-800',
  uxui: 'bg-pink-100 text-pink-800',
  devops: 'bg-orange-100 text-orange-800',
  qa: 'bg-yellow-100 text-yellow-800',
  pm: 'bg-indigo-100 text-indigo-800'
}

const seniorityColors = {
  'Junior': 'bg-gray-100 text-gray-800',
  'Mid': 'bg-blue-100 text-blue-800',
  'Senior': 'bg-green-100 text-green-800',
  'Lead': 'bg-purple-100 text-purple-800',
  'Principal': 'bg-red-100 text-red-800'
}

export default function MemberProfilePage() {
  const params = useParams()
  const router = useRouter()
  const memberId = parseInt(params.id as string)
  
  const [member, setMember] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  // Cargar detalles del miembro
  const loadMember = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('👤 Cargando perfil del miembro:', memberId)
      const memberData = await apiClient.getUser(memberId)
      console.log('✅ Miembro cargado:', memberData)
      
      setMember(memberData)
      
    } catch (error) {
      console.error('❌ Error cargando miembro:', error)
      setError(`No se pudo cargar el perfil: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (memberId) {
      loadMember()
    }
  }, [memberId])

  // Función para eliminar miembro
  const handleDeleteMember = async () => {
    try {
      setDeleting(true)
      
      console.log('🗑️ Eliminando miembro:', memberId)
      await apiClient.deleteUser(memberId)
      
      console.log('✅ Miembro eliminado, redirigiendo...')
      router.push('/equipo')
      
    } catch (error) {
      console.error('❌ Error eliminando miembro:', error)
      setError(`Error al eliminar el miembro: ${error.message}`)
    } finally {
      setDeleting(false)
    }
  }

  const parseSkills = (skillsJson: string) => {
    try {
      return skillsJson ? JSON.parse(skillsJson) : []
    } catch {
      return []
    }
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

  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'
  }

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          <span className="ml-2 text-lg">Cargando perfil...</span>
        </div>
      </div>
    )
  }

  if (error || !member) {
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
            <div className="text-red-800">
              {error || 'Miembro no encontrado'}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const skills = parseSkills(member.skills)

  return (
    <div className="container mx-auto py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link href="/equipo">
            <Button variant="outline" size="sm" className="mr-4">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{member.full_name}</h1>
            <p className="text-muted-foreground">
              Perfil del miembro del equipo
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Link href={`/equipo/${member.id}/editar`}>
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
                  ¿Eliminar miembro?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  ¿Estás seguro de que quieres eliminar a "<strong>{member.full_name}</strong>" del equipo? 
                  Esta acción no se puede deshacer y se eliminarán todos los datos asociados.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteMember}
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
          {/* Perfil Principal */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={`/avatars/${member.id}.jpg`} alt={member.full_name} />
                  <AvatarFallback className="text-lg">
                    {getInitials(member.full_name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold">{member.full_name}</h2>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge 
                      className={roleColors[member.role as keyof typeof roleColors] || 'bg-gray-100 text-gray-800'}
                    >
                      {roleLabels[member.role as keyof typeof roleLabels] || member.role}
                    </Badge>
                    {member.seniority && (
                      <Badge 
                        variant="outline"
                        className={seniorityColors[member.seniority as keyof typeof seniorityColors] || 'bg-gray-100 text-gray-800'}
                      >
                        <Award className="h-3 w-3 mr-1" />
                        {member.seniority}
                      </Badge>
                    )}
                    {!member.is_active && (
                      <Badge variant="destructive">Inactivo</Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Email</div>
                    <div className="text-sm text-muted-foreground">{member.email}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Usuario</div>
                    <div className="text-sm text-muted-foreground">{member.username}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Departamento</div>
                    <div className="text-sm text-muted-foreground">
                      {member.department || 'No especificado'}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Tarifa por hora</div>
                    <div className="text-sm text-muted-foreground">
                      {member.hourly_rate ? `${formatCurrency(member.hourly_rate)}/h` : 'No especificado'}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Habilidades y Tecnologías */}
          <Card>
            <CardHeader>
              <CardTitle>Habilidades y Tecnologías</CardTitle>
            </CardHeader>
            <CardContent>
              {skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill: string) => (
                    <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      {skill}
                    </Badge>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground text-center py-8">
                  No hay habilidades especificadas
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Estadísticas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Información de Actividad
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm">Estado</span>
                <Badge variant={member.is_active ? "default" : "destructive"}>
                  {member.is_active ? 'Activo' : 'Inactivo'}
                </Badge>
              </div>
              
              <Separator />
              
              <div>
                <div className="text-sm font-medium mb-1">Fecha de registro</div>
                <div className="text-sm text-muted-foreground">
                  {formatDate(member.created_at)}
                </div>
              </div>
              
              {member.last_login && (
                <div>
                  <div className="text-sm font-medium mb-1">Último acceso</div>
                  <div className="text-sm text-muted-foreground">
                    {formatDateTime(member.last_login)}
                  </div>
                </div>
              )}
              
              {member.updated_at && (
                <div>
                  <div className="text-sm font-medium mb-1">Última actualización</div>
                  <div className="text-sm text-muted-foreground">
                    {formatDateTime(member.updated_at)}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Proyectos Asignados */}
          <Card>
            <CardHeader>
              <CardTitle>Proyectos Asignados</CardTitle>
            </CardHeader>
            <CardContent>
              {member.projects && member.projects.length > 0 ? (
                <div className="space-y-3">
                  {member.projects.map((project: any) => (
                    <div key={project.id} className="border rounded-lg p-3">
                      <div className="font-medium text-sm">{project.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {project.status} • {project.client_name}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground text-center py-4">
                  No hay proyectos asignados
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tareas Recientes */}
          <Card>
            <CardHeader>
              <CardTitle>Actividad Reciente</CardTitle>
            </CardHeader>
            <CardContent>
              {member.tasks_assigned && member.tasks_assigned.length > 0 ? (
                <div className="space-y-2">
                  {member.tasks_assigned.slice(0, 5).map((task: any) => (
                    <div key={task.id} className="text-sm">
                      <div className="font-medium">{task.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {task.status} • {task.priority}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground text-center py-4">
                  No hay actividad reciente
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
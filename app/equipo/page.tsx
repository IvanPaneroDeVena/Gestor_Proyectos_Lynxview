'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Search, MoreHorizontal, Eye, Edit, Trash2, AlertTriangle } from 'lucide-react'
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
import { useRouter } from 'next/navigation'

// Datos de respaldo
const fallbackMembers = [
  {
    id: 1,
    full_name: 'Ana Martínez',
    email: 'ana.martinez@company.com',
    role: 'frontend',
    seniority: 'Senior',
    department: 'Desarrollo',
    hourly_rate: 75,
    skills: '["React", "TypeScript", "Tailwind CSS"]',
    is_active: true,
    created_at: '2024-01-15T10:00:00Z'
  },
  {
    id: 2,
    full_name: 'Carlos Ruiz',
    email: 'carlos.ruiz@company.com',
    role: 'backend',
    seniority: 'Mid',
    department: 'Desarrollo',
    hourly_rate: 65,
    skills: '["Node.js", "Python", "MongoDB"]',
    is_active: true,
    created_at: '2024-01-10T09:00:00Z'
  },
  {
    id: 3,
    full_name: 'Elena Gómez',
    email: 'elena.gomez@company.com',
    role: 'uxui',
    seniority: 'Senior',
    department: 'Diseño',
    hourly_rate: 70,
    skills: '["Figma", "Sketch", "Adobe XD"]',
    is_active: true,
    created_at: '2024-01-05T11:00:00Z'
  }
]

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

export default function EquipoPage() {
  const router = useRouter()
  const [members, setMembers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('todos')
  const [deletingMember, setDeletingMember] = useState<number | null>(null)

  // Cargar miembros del equipo
  const loadMembers = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('👥 Cargando miembros del equipo...')
      const membersData = await apiClient.getUsers()
      console.log('✅ Respuesta completa de la API:', membersData)
      console.log('🔍 Tipo de respuesta:', typeof membersData)
      console.log('📊 Es array?:', Array.isArray(membersData))
      
      let membersArray = []
      
      // Manejar diferentes formatos de respuesta
      if (Array.isArray(membersData)) {
        membersArray = membersData
      } else if (membersData && Array.isArray(membersData.data)) {
        // Si viene en formato { data: [...] }
        membersArray = membersData.data
      } else if (membersData && Array.isArray(membersData.users)) {
        // Si viene en formato { users: [...] }
        membersArray = membersData.users
      } else if (membersData && Array.isArray(membersData.items)) {
        // Si viene en formato { items: [...] }
        membersArray = membersData.items
      } else if (membersData && typeof membersData === 'object') {
        // Si es un objeto, intentar extraer propiedades que sean arrays
        const possibleArrays = Object.values(membersData).filter(value => Array.isArray(value))
        if (possibleArrays.length > 0) {
          membersArray = possibleArrays[0] as any[]
        } else {
          console.warn('⚠️ Respuesta es objeto pero no contiene arrays:', Object.keys(membersData))
          throw new Error('La respuesta no contiene un array de usuarios válido')
        }
      } else {
        console.warn('⚠️ Formato de respuesta no reconocido:', membersData)
        throw new Error('La respuesta de la API no está en un formato reconocido')
      }
      
      console.log('📋 Array de miembros extraído:', membersArray)
      console.log('👤 Cantidad de miembros:', membersArray.length)
      
      if (membersArray.length > 0) {
        console.log('👤 Primer miembro como ejemplo:', membersArray[0])
      }
      
      setMembers(membersArray)
      
    } catch (error) {
      console.error('❌ Error cargando miembros:', error)
      setError(`No se pudieron cargar los miembros: ${error.message}`)
      
      // Usar datos de respaldo solo si no conseguimos datos reales
      console.log('📦 Usando datos de respaldo')
      setMembers(fallbackMembers)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMembers()
  }, [])

  // Función para eliminar miembro
  const handleDeleteMember = async (memberId: number) => {
    try {
      setDeletingMember(memberId)
      
      console.log('🗑️ Eliminando miembro:', memberId)
      await apiClient.deleteUser(memberId)
      
      // Actualizar la lista local
      setMembers(prevMembers => 
        prevMembers.filter(member => member.id !== memberId)
      )
      
      console.log('✅ Miembro eliminado correctamente')
      
    } catch (error) {
      console.error('❌ Error eliminando miembro:', error)
      setError(`Error al eliminar el miembro: ${error.message}`)
    } finally {
      setDeletingMember(null)
    }
  }

  // Navegación
  const handleViewDetails = (memberId: number) => {
    router.push(`/equipo/${memberId}`)
  }

  const handleEditMember = (memberId: number) => {
    router.push(`/equipo/${memberId}/editar`)
  }

  // Filtrar miembros
  const filteredMembers = Array.isArray(members) ? members.filter(member => {
    const matchesSearch = member.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.department?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === 'todos' || member.role === roleFilter
    return matchesSearch && matchesRole && member.is_active
  }) : []

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

  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'
  }

  return (
    <div className="container mx-auto py-6">
      {/* Header */}
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Equipo</h1>
        <p className="text-muted-foreground">
          Gestiona los miembros del equipo y sus asignaciones a proyectos.
        </p>
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
                onClick={loadMembers}
                className="ml-auto"
              >
                Reintentar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filtros y acciones */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 items-center gap-2">
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Buscar miembros..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los roles</SelectItem>
                  <SelectItem value="frontend">Frontend</SelectItem>
                  <SelectItem value="backend">Backend</SelectItem>
                  <SelectItem value="fullstack">Full Stack</SelectItem>
                  <SelectItem value="uxui">UX/UI Designer</SelectItem>
                  <SelectItem value="devops">DevOps</SelectItem>
                  <SelectItem value="qa">QA Tester</SelectItem>
                  <SelectItem value="pm">Project Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Link href="/equipo/nuevo">
              <Button className="bg-purple-700 hover:bg-purple-800 text-white font-medium shadow-md">
                <Plus className="mr-2 h-4 w-4" />
                Añadir Miembro
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de miembros */}
      <Card>
        <CardHeader>
          <CardTitle>
            Miembros del Equipo ({filteredMembers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Miembro</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Departamento</TableHead>
                  <TableHead>Tecnologías</TableHead>
                  <TableHead>Tarifa/hora</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Cargando miembros...
                    </TableCell>
                  </TableRow>
                ) : filteredMembers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      No se encontraron miembros
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={`/avatars/${member.id}.jpg`} alt={member.full_name} />
                            <AvatarFallback>{getInitials(member.full_name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{member.full_name}</div>
                            <div className="text-sm text-muted-foreground">{member.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          className={roleColors[member.role as keyof typeof roleColors] || 'bg-gray-100 text-gray-800'}
                        >
                          {roleLabels[member.role as keyof typeof roleLabels] || member.role}
                        </Badge>
                        {member.seniority && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {member.seniority}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {member.department || '-'}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {parseSkills(member.skills).slice(0, 3).map((skill: string) => (
                            <Badge key={skill} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {parseSkills(member.skills).length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{parseSkills(member.skills).length - 3}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {member.hourly_rate ? `${formatCurrency(member.hourly_rate)}/h` : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewDetails(member.id)}>
                              <Eye className="h-4 w-4 mr-2" />
                              Ver perfil
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditMember(member.id)}>
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
                                    ¿Eliminar miembro?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    ¿Estás seguro de que quieres eliminar a "<strong>{member.full_name}</strong>" del equipo? 
                                    Esta acción no se puede deshacer.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteMember(member.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                    disabled={deletingMember === member.id}
                                  >
                                    {deletingMember === member.id ? 'Eliminando...' : 'Eliminar'}
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
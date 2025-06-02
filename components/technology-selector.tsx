'use client'

import { useState, useEffect } from 'react'
import { Plus, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { apiClient } from '@/lib/api/client'

interface Technology {
  id: number
  name: string
  category: string
  description?: string
}

interface TechnologySelectorProps {
  selectedTechnologies: string[]
  onTechnologiesChange: (technologies: string[]) => void
  label?: string
  placeholder?: string
  maxDisplay?: number
}

const categoryLabels = {
  frontend: 'Frontend',
  backend: 'Backend',
  database: 'Base de Datos',
  devops: 'DevOps',
  design: 'Diseño',
  mobile: 'Móvil',
  testing: 'Testing',
  other: 'Otros'
}

const categoryColors = {
  frontend: 'bg-blue-100 text-blue-800',
  backend: 'bg-green-100 text-green-800',
  database: 'bg-purple-100 text-purple-800',
  devops: 'bg-orange-100 text-orange-800',
  design: 'bg-pink-100 text-pink-800',
  mobile: 'bg-indigo-100 text-indigo-800',
  testing: 'bg-yellow-100 text-yellow-800',
  other: 'bg-gray-100 text-gray-800'
}

export function TechnologySelector({
  selectedTechnologies,
  onTechnologiesChange,
  label = "Tecnologías",
  placeholder = "Buscar tecnologías...",
  maxDisplay = 12
}: TechnologySelectorProps) {
  const [technologies, setTechnologies] = useState<Technology[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  
  // Estado para crear nueva tecnología
  const [newTech, setNewTech] = useState({
    name: '',
    category: '',
    description: ''
  })

  // Cargar tecnologías
  const loadTechnologies = async () => {
    try {
      setLoading(true)
      console.log('🔧 Cargando tecnologías...')
      
      const techData = await apiClient.get_technologies()
      console.log('✅ Tecnologías cargadas:', techData)
      
      if (Array.isArray(techData)) {
        setTechnologies(techData)
      } else {
        setTechnologies([])
      }
      
    } catch (error) {
      console.error('❌ Error cargando tecnologías:', error)
      setTechnologies([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTechnologies()
  }, [])

  // Crear nueva tecnología
  const handleCreateTechnology = async () => {
    if (!newTech.name || !newTech.category) return

    try {
      setCreating(true)
      
      console.log('🔧 Creando nueva tecnología:', newTech)
      const createdTech = await apiClient.create_technology(newTech)
      console.log('✅ Tecnología creada:', createdTech)
      
      // Actualizar lista local
      setTechnologies(prev => [...prev, createdTech])
      
      // Añadir automáticamente a seleccionadas
      onTechnologiesChange([...selectedTechnologies, createdTech.name])
      
      // Limpiar formulario y cerrar dialog
      setNewTech({ name: '', category: '', description: '' })
      setIsDialogOpen(false)
      
    } catch (error) {
      console.error('❌ Error creando tecnología:', error)
    } finally {
      setCreating(false)
    }
  }

  // Filtrar tecnologías
  const filteredTechnologies = technologies.filter(tech => {
    const matchesSearch = tech.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || tech.category === categoryFilter
    const notSelected = !selectedTechnologies.includes(tech.name)
    return matchesSearch && matchesCategory && notSelected
  })

  // Agrupar por categoría
  const groupedTechnologies = filteredTechnologies.reduce((acc, tech) => {
    if (!acc[tech.category]) acc[tech.category] = []
    acc[tech.category].push(tech)
    return acc
  }, {} as Record<string, Technology[]>)

  const handleAddTechnology = (techName: string) => {
    if (!selectedTechnologies.includes(techName)) {
      onTechnologiesChange([...selectedTechnologies, techName])
    }
  }

  const handleRemoveTechnology = (techName: string) => {
    onTechnologiesChange(selectedTechnologies.filter(name => name !== techName))
  }

  return (
    <div className="space-y-4">
      <Label>{label}</Label>
      
      {/* Tecnologías seleccionadas */}
      {selectedTechnologies.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTechnologies.map((techName) => {
            const tech = technologies.find(t => t.name === techName)
            return (
              <Badge 
                key={techName} 
                variant="secondary" 
                className="flex items-center gap-1 p-1 pr-2"
              >
                {techName}
                {tech && (
                  <Badge 
                    variant="outline" 
                    className={`text-xs ml-1 ${categoryColors[tech.category as keyof typeof categoryColors] || 'bg-gray-100'}`}
                  >
                    {categoryLabels[tech.category as keyof typeof categoryLabels] || tech.category}
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 ml-1 rounded-full"
                  onClick={() => handleRemoveTechnology(techName)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )
          })}
        </div>
      )}

      {/* Búsqueda y filtros */}
      <div className="flex gap-2">
        <Input
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {Object.entries(categoryLabels).map(([key, label]) => (
              <SelectItem key={key} value={key}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-2">Cargando tecnologías...</span>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Tecnologías disponibles */}
          {Object.keys(groupedTechnologies).length > 0 ? (
            Object.entries(groupedTechnologies).slice(0, 5).map(([category, techs]) => (
              <div key={category}>
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Badge className={categoryColors[category as keyof typeof categoryColors] || 'bg-gray-100'}>
                    {categoryLabels[category as keyof typeof categoryLabels] || category}
                  </Badge>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {techs.slice(0, maxDisplay).map((tech) => (
                    <Badge
                      key={tech.id}
                      variant="outline"
                      className="cursor-pointer hover:bg-blue-50"
                      onClick={() => handleAddTechnology(tech.name)}
                    >
                      {tech.name}
                    </Badge>
                  ))}
                </div>
              </div>
            ))
          ) : technologies.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p className="mb-4">No hay tecnologías disponibles</p>
              <p className="text-sm">Crea la primera tecnología para empezar</p>
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              <p>No se encontraron tecnologías con ese criterio</p>
            </div>
          )}

          <Separator />

          {/* Botón para crear nueva tecnología */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Crear Nueva Tecnología
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear Nueva Tecnología</DialogTitle>
                <DialogDescription>
                  Añade una nueva tecnología al catálogo disponible
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="tech-name">Nombre *</Label>
                  <Input
                    id="tech-name"
                    placeholder="Ej: React, Node.js, MongoDB..."
                    value={newTech.name}
                    onChange={(e) => setNewTech(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="tech-category">Categoría *</Label>
                  <Select 
                    value={newTech.category} 
                    onValueChange={(value) => setNewTech(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(categoryLabels).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="tech-description">Descripción</Label>
                  <Textarea
                    id="tech-description"
                    placeholder="Descripción opcional de la tecnología"
                    value={newTech.description}
                    onChange={(e) => setNewTech(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                  disabled={creating}
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleCreateTechnology}
                  disabled={!newTech.name || !newTech.category || creating}
                >
                  {creating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creando...
                    </>
                  ) : (
                    'Crear Tecnología'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  )
}
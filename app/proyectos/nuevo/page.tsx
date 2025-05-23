"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, CalendarIcon, Info, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

export default function NuevoProyectoPage() {
  const [startDate, setStartDate] = useState<Date | undefined>(new Date())
  const [endDate, setEndDate] = useState<Date | undefined>()
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [requiredTechnologies, setRequiredTechnologies] = useState<{
    frontend: string[]
    backend: string[]
    database: string[]
  }>({
    frontend: [],
    backend: [],
    database: [],
  })
  const [recommendedMembers, setRecommendedMembers] = useState<any[]>([])
  const [teamAllocation, setTeamAllocation] = useState<Record<string, number>>({})
  const [teamTab, setTeamTab] = useState("manual")

  // Datos de ejemplo para miembros del equipo
  const teamMembers = [
    {
      id: "1",
      name: "Ana Martínez",
      role: "Desarrolladora Frontend",
      avatar: "/placeholder.svg?height=32&width=32",
      technologies: ["React", "TypeScript", "Tailwind CSS", "Redux", "React Native"],
      availability: 70,
      currentProjects: 2,
    },
    {
      id: "2",
      name: "Carlos Ruiz",
      role: "Desarrollador Backend",
      avatar: "/placeholder.svg?height=32&width=32",
      technologies: ["Node.js", "Express", "MongoDB", "Python", "Django"],
      availability: 50,
      currentProjects: 3,
    },
    {
      id: "3",
      name: "Elena Gómez",
      role: "Diseñadora UX/UI",
      avatar: "/placeholder.svg?height=32&width=32",
      technologies: ["Figma", "Sketch", "Adobe XD", "HTML/CSS"],
      availability: 100,
      currentProjects: 1,
    },
    {
      id: "4",
      name: "Javier López",
      role: "DevOps",
      avatar: "/placeholder.svg?height=32&width=32",
      technologies: ["Docker", "Kubernetes", "AWS", "GCP", "CI/CD"],
      availability: 30,
      currentProjects: 4,
    },
    {
      id: "5",
      name: "Laura Sánchez",
      role: "QA Tester",
      avatar: "/placeholder.svg?height=32&width=32",
      technologies: ["Cypress", "Jest", "Selenium", "Postman"],
      availability: 80,
      currentProjects: 2,
    },
    {
      id: "6",
      name: "Miguel Torres",
      role: "Desarrollador Frontend",
      avatar: "/placeholder.svg?height=32&width=32",
      technologies: ["Angular", "TypeScript", "SCSS", "RxJS"],
      availability: 60,
      currentProjects: 2,
    },
    {
      id: "7",
      name: "Sofía Navarro",
      role: "Desarrolladora Backend",
      avatar: "/placeholder.svg?height=32&width=32",
      technologies: ["PHP", "Laravel", "MySQL", "Redis"],
      availability: 90,
      currentProjects: 1,
    },
  ]

  // Tecnologías disponibles
  const availableTechnologies = {
    frontend: ["React", "Angular", "Vue.js", "React Native", "TypeScript", "JavaScript", "Tailwind CSS", "SCSS"],
    backend: ["Node.js", "Python", "Java", "PHP", "Ruby", "Go", "Express", "Django", "Spring Boot", "Laravel"],
    database: ["MongoDB", "PostgreSQL", "MySQL", "Oracle", "SQLite", "Redis", "Firebase"],
  }

  // Filtrar miembros del equipo por término de búsqueda
  const filteredMembers = teamMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.technologies.some((tech) => tech.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  // Actualizar recomendaciones cuando cambian las tecnologías requeridas
  useEffect(() => {
    if (
      requiredTechnologies.frontend.length === 0 &&
      requiredTechnologies.backend.length === 0 &&
      requiredTechnologies.database.length === 0
    ) {
      setRecommendedMembers([])
      return
    }

    // Calcular puntuación para cada miembro basada en tecnologías y disponibilidad
    const scoredMembers = teamMembers.map((member) => {
      let score = 0
      const matchedTechnologies = []

      // Puntuar por tecnologías frontend
      for (const tech of requiredTechnologies.frontend) {
        if (member.technologies.includes(tech)) {
          score += 10
          matchedTechnologies.push(tech)
        }
      }

      // Puntuar por tecnologías backend
      for (const tech of requiredTechnologies.backend) {
        if (member.technologies.includes(tech)) {
          score += 10
          matchedTechnologies.push(tech)
        }
      }

      // Puntuar por tecnologías de base de datos
      for (const tech of requiredTechnologies.database) {
        if (member.technologies.includes(tech)) {
          score += 10
          matchedTechnologies.push(tech)
        }
      }

      // Puntuar por disponibilidad
      score += member.availability / 10

      // Penalizar por número de proyectos actuales
      score -= member.currentProjects * 5

      return {
        ...member,
        score,
        matchedTechnologies,
      }
    })

    // Ordenar por puntuación y filtrar los que tienen al menos una tecnología coincidente
    const recommended = scoredMembers
      .filter((member) => member.matchedTechnologies.length > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)

    setRecommendedMembers(recommended)
  }, [requiredTechnologies])

  const handleAddMember = (memberId: string) => {
    if (!selectedMembers.includes(memberId)) {
      setSelectedMembers([...selectedMembers, memberId])
      setTeamAllocation({ ...teamAllocation, [memberId]: 100 })
    }
  }

  const handleRemoveMember = (memberId: string) => {
    setSelectedMembers(selectedMembers.filter((id) => id !== memberId))
    const newAllocation = { ...teamAllocation }
    delete newAllocation[memberId]
    setTeamAllocation(newAllocation)
  }

  const handleAllocationChange = (memberId: string, value: number[]) => {
    setTeamAllocation({ ...teamAllocation, [memberId]: value[0] })
  }

  const handleAddTechnology = (category: "frontend" | "backend" | "database", tech: string) => {
    if (!requiredTechnologies[category].includes(tech)) {
      setRequiredTechnologies({
        ...requiredTechnologies,
        [category]: [...requiredTechnologies[category], tech],
      })
    }
  }

  const handleRemoveTechnology = (category: "frontend" | "backend" | "database", tech: string) => {
    setRequiredTechnologies({
      ...requiredTechnologies,
      [category]: requiredTechnologies[category].filter((t) => t !== tech),
    })
  }

  const handleAddRecommendedMember = (member: any) => {
    handleAddMember(member.id)
  }

  return (
    <div className="flex flex-col gap-8 p-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/proyectos">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Volver</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight gradient-text">Nuevo Proyecto</h1>
          <p className="text-muted-foreground">Crea un nuevo proyecto de software</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Información del Proyecto</CardTitle>
            <CardDescription>Introduce los detalles básicos del proyecto</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre del Proyecto</Label>
              <Input id="nombre" placeholder="Ej: Portal de Clientes v2.0" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea id="descripcion" placeholder="Describe el proyecto y sus objetivos principales" rows={4} />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="cliente">Cliente</Label>
                <Input id="cliente" placeholder="Nombre del cliente" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="presupuesto">Presupuesto</Label>
                <Input id="presupuesto" placeholder="Ej: €50,000" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Estado</Label>
              <Select defaultValue="planificacion">
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planificacion">Planificación</SelectItem>
                  <SelectItem value="progreso">En Progreso</SelectItem>
                  <SelectItem value="revision">En Revisión</SelectItem>
                  <SelectItem value="pausado">Pausado</SelectItem>
                  <SelectItem value="completado">Completado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Prioridad</Label>
              <Select defaultValue="media">
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una prioridad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="media">Media</SelectItem>
                  <SelectItem value="baja">Baja</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Fechas del Proyecto</CardTitle>
              <CardDescription>Establece las fechas de inicio y finalización</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Fecha de Inicio</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP", { locale: es }) : <span>Selecciona una fecha</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label>Fecha de Finalización</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "PPP", { locale: es }) : <span>Selecciona una fecha</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                        disabled={(date) => date < new Date() || (startDate ? date < startDate : false)}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="horas">Horas Estimadas</Label>
                <Input id="horas" type="number" placeholder="Ej: 1200" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tecnologías Requeridas</CardTitle>
              <CardDescription>Selecciona las tecnologías necesarias para el proyecto</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <Label className="mb-2 block">Frontend</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {requiredTechnologies.frontend.map((tech) => (
                      <Badge key={tech} variant="secondary" className="flex items-center gap-1 p-1 pr-2">
                        {tech}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 ml-1 rounded-full"
                          onClick={() => handleRemoveTechnology("frontend", tech)}
                        >
                          <span className="sr-only">Eliminar</span>×
                        </Button>
                      </Badge>
                    ))}
                  </div>
                  <Select onValueChange={(value) => handleAddTechnology("frontend", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona tecnologías" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTechnologies.frontend
                        .filter((tech) => !requiredTechnologies.frontend.includes(tech))
                        .map((tech) => (
                          <SelectItem key={tech} value={tech}>
                            {tech}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="mb-2 block">Backend</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {requiredTechnologies.backend.map((tech) => (
                      <Badge key={tech} variant="secondary" className="flex items-center gap-1 p-1 pr-2">
                        {tech}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 ml-1 rounded-full"
                          onClick={() => handleRemoveTechnology("backend", tech)}
                        >
                          <span className="sr-only">Eliminar</span>×
                        </Button>
                      </Badge>
                    ))}
                  </div>
                  <Select onValueChange={(value) => handleAddTechnology("backend", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona tecnologías" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTechnologies.backend
                        .filter((tech) => !requiredTechnologies.backend.includes(tech))
                        .map((tech) => (
                          <SelectItem key={tech} value={tech}>
                            {tech}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="mb-2 block">Base de Datos</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {requiredTechnologies.database.map((tech) => (
                      <Badge key={tech} variant="secondary" className="flex items-center gap-1 p-1 pr-2">
                        {tech}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 ml-1 rounded-full"
                          onClick={() => handleRemoveTechnology("database", tech)}
                        >
                          <span className="sr-only">Eliminar</span>×
                        </Button>
                      </Badge>
                    ))}
                  </div>
                  <Select onValueChange={(value) => handleAddTechnology("database", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona tecnologías" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTechnologies.database
                        .filter((tech) => !requiredTechnologies.database.includes(tech))
                        .map((tech) => (
                          <SelectItem key={tech} value={tech}>
                            {tech}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Equipo del Proyecto</CardTitle>
          <CardDescription>Asigna miembros al equipo del proyecto</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={teamTab} onValueChange={setTeamTab} className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="manual">Selección Manual</TabsTrigger>
              <TabsTrigger value="recomendado">Recomendaciones</TabsTrigger>
            </TabsList>

            <TabsContent value="manual" className="space-y-4">
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedMembers.map((memberId) => {
                  const member = teamMembers.find((m) => m.id === memberId)
                  if (!member) return null
                  return (
                    <Badge key={member.id} variant="secondary" className="flex items-center gap-1 p-1 pr-2">
                      <Avatar className="h-5 w-5 mr-1">
                        <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                        <AvatarFallback className="text-[8px]">
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      {member.name}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 ml-1 rounded-full"
                        onClick={() => handleRemoveMember(member.id)}
                      >
                        <span className="sr-only">Eliminar</span>×
                      </Button>
                    </Badge>
                  )
                })}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Buscar Miembros</Label>
                  <Input
                    placeholder="Buscar por nombre, rol o tecnología..."
                    className="max-w-xs"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="border rounded-md divide-y">
                  {filteredMembers.length > 0 ? (
                    filteredMembers.map((member) => (
                      <div key={member.id} className="p-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                            <AvatarFallback>
                              {member.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{member.name}</div>
                            <div className="text-xs text-muted-foreground">{member.role}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="flex items-center gap-1">
                                  <Progress value={member.availability} className="w-20 h-2" />
                                  <span className="text-xs">{member.availability}%</span>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Disponibilidad: {member.availability}%</p>
                                <p>Proyectos actuales: {member.currentProjects}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAddMember(member.id)}
                            disabled={selectedMembers.includes(member.id)}
                          >
                            {selectedMembers.includes(member.id) ? "Añadido" : "Añadir"}
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-muted-foreground">
                      No se encontraron miembros que coincidan con la búsqueda
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="recomendado" className="space-y-4">
              {requiredTechnologies.frontend.length === 0 &&
              requiredTechnologies.backend.length === 0 &&
              requiredTechnologies.database.length === 0 ? (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Selecciona tecnologías</AlertTitle>
                  <AlertDescription>
                    Selecciona las tecnologías requeridas para recibir recomendaciones de equipo.
                  </AlertDescription>
                </Alert>
              ) : recommendedMembers.length > 0 ? (
                <div className="space-y-4">
                  <Alert className="bg-blue-50 border-blue-200">
                    <Info className="h-4 w-4 text-blue-500" />
                    <AlertTitle>Recomendaciones basadas en tecnologías y disponibilidad</AlertTitle>
                    <AlertDescription>
                      Estos miembros son los más adecuados según las tecnologías requeridas y su disponibilidad actual.
                    </AlertDescription>
                  </Alert>

                  <div className="border rounded-md divide-y">
                    {recommendedMembers.map((member) => (
                      <div key={member.id} className="p-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                            <AvatarFallback>
                              {member.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{member.name}</div>
                            <div className="text-xs text-muted-foreground">{member.role}</div>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {member.matchedTechnologies.map((tech: string) => (
                                <Badge key={tech} variant="outline" className="text-xs px-1 py-0">
                                  {tech}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="flex items-center gap-1">
                                  <Progress value={member.availability} className="w-20 h-2" />
                                  <span className="text-xs">{member.availability}%</span>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Disponibilidad: {member.availability}%</p>
                                <p>Proyectos actuales: {member.currentProjects}</p>
                                <p>Puntuación: {Math.round(member.score)}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAddRecommendedMember(member)}
                            disabled={selectedMembers.includes(member.id)}
                          >
                            {selectedMembers.includes(member.id) ? "Añadido" : "Añadir"}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>No hay recomendaciones disponibles</AlertTitle>
                  <AlertDescription>
                    No se encontraron miembros que coincidan con las tecnologías requeridas.
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>
          </Tabs>

          {selectedMembers.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-4">Asignación de Disponibilidad</h3>
              <div className="space-y-4">
                {selectedMembers.map((memberId) => {
                  const member = teamMembers.find((m) => m.id === memberId)
                  if (!member) return null
                  return (
                    <div key={member.id} className="border rounded-md p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                            <AvatarFallback>
                              {member.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{member.name}</div>
                            <div className="text-xs text-muted-foreground">{member.role}</div>
                          </div>
                        </div>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <span>Disponibilidad actual: {member.availability}%</span>
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>Asignación al proyecto</Label>
                          <span className="font-medium">{teamAllocation[member.id] || 100}%</span>
                        </div>
                        <Slider
                          defaultValue={[teamAllocation[member.id] || 100]}
                          max={100}
                          step={10}
                          onValueChange={(value) => handleAllocationChange(member.id, value)}
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>25%</span>
                          <span>50%</span>
                          <span>75%</span>
                          <span>100%</span>
                        </div>
                      </div>

                      {teamAllocation[member.id] > member.availability && (
                        <Alert variant="destructive" className="mt-2">
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>Sobreasignación</AlertTitle>
                          <AlertDescription>
                            Este miembro está siendo asignado por encima de su disponibilidad actual.
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button variant="outline" asChild>
          <Link href="/proyectos">Cancelar</Link>
        </Button>
        <Button className="bg-brand-purple hover:bg-brand-purple/90">Crear Proyecto</Button>
      </div>
    </div>
  )
}

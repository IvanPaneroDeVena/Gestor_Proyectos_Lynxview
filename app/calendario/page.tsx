"use client"

import { useState, useEffect } from "react"
import { CalendarIcon, ChevronLeft, ChevronRight, Plus, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { TeamCalendar } from "@/components/team-calendar"
import { ProjectsCalendar } from "@/components/projects-calendar"
import { CalendarLegend } from "@/components/calendar-legend"
import { CalendarFilters } from "@/components/calendar-filters"
import { AddEventDialog } from "@/components/add-event-dialog"
import { format, addMonths, subMonths } from "date-fns"
import { es } from "date-fns/locale"

export default function CalendarioPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<"team" | "projects">("team")
  const [selectedTeamMembers, setSelectedTeamMembers] = useState<string[]>([])
  const [selectedProjects, setSelectedProjects] = useState<string[]>([])
  const [isAddEventOpen, setIsAddEventOpen] = useState(false)

  // Datos de ejemplo para miembros del equipo
  const teamMembers = [
    {
      id: "1",
      name: "Ana Martínez",
      role: "Desarrolladora Frontend",
      avatar: "/placeholder.svg?height=32&width=32",
      availability: 70,
    },
    {
      id: "2",
      name: "Carlos Ruiz",
      role: "Desarrollador Backend",
      avatar: "/placeholder.svg?height=32&width=32",
      availability: 50,
    },
    {
      id: "3",
      name: "Elena Gómez",
      role: "Diseñadora UX/UI",
      avatar: "/placeholder.svg?height=32&width=32",
      availability: 100,
    },
    {
      id: "4",
      name: "Javier López",
      role: "DevOps",
      avatar: "/placeholder.svg?height=32&width=32",
      availability: 30,
    },
    {
      id: "5",
      name: "Laura Sánchez",
      role: "QA Tester",
      avatar: "/placeholder.svg?height=32&width=32",
      availability: 80,
    },
  ]

  // Datos de ejemplo para proyectos
  const projects = [
    {
      id: "PRJ001",
      name: "AYR sistema de domótica",
      color: "#6D28D9",
    },
    {
      id: "PRJ002",
      name: "GSW Tienda de pinceles",
      color: "#2563EB",
    },
    {
      id: "PRJ003",
      name: "ADPOINT Pádel",
      color: "#10B981",
    },
    {
      id: "PRJ004",
      name: "Sistema de Notificaciones",
      color: "#F97316",
    },
  ]

  // Inicializar con todos los miembros y proyectos seleccionados
  useEffect(() => {
    setSelectedTeamMembers(teamMembers.map((member) => member.id))
    setSelectedProjects(projects.map((project) => project.id))
  }, [])

  const handlePreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1))
  }

  const handleTodayClick = () => {
    setCurrentDate(new Date())
  }

  const toggleTeamMember = (memberId: string) => {
    if (selectedTeamMembers.includes(memberId)) {
      setSelectedTeamMembers(selectedTeamMembers.filter((id) => id !== memberId))
    } else {
      setSelectedTeamMembers([...selectedTeamMembers, memberId])
    }
  }

  const toggleProject = (projectId: string) => {
    if (selectedProjects.includes(projectId)) {
      setSelectedProjects(selectedProjects.filter((id) => id !== projectId))
    } else {
      setSelectedProjects([...selectedProjects, projectId])
    }
  }

  return (
    <div className="flex flex-col gap-8 p-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight gradient-text">Calendario</h1>
        <p className="text-muted-foreground">Gestiona la disponibilidad del equipo y las asignaciones a proyectos.</p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-lg font-medium min-w-[200px] text-center">
            {format(currentDate, "MMMM yyyy", { locale: es })}
          </div>
          <Button variant="outline" size="icon" onClick={handleNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={handleTodayClick}>
            Hoy
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Select defaultValue="month">
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Vista" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Mes</SelectItem>
              <SelectItem value="week">Semana</SelectItem>
              <SelectItem value="day">Día</SelectItem>
            </SelectContent>
          </Select>
          <Button
            className="bg-purple-700 hover:bg-purple-800 text-white font-medium shadow-md"
            onClick={() => setIsAddEventOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" /> Añadir Evento
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Filtros</CardTitle>
              <CardDescription>Personaliza la vista del calendario</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="members" className="w-full">
                <TabsList className="w-full mb-4">
                  <TabsTrigger value="members" className="flex-1">
                    <Users className="h-4 w-4 mr-2" /> Equipo
                  </TabsTrigger>
                  <TabsTrigger value="projects" className="flex-1">
                    <CalendarIcon className="h-4 w-4 mr-2" /> Proyectos
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="members" className="space-y-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Miembros del equipo</span>
                    <Button variant="ghost" size="sm" className="h-8 text-xs">
                      Seleccionar todos
                    </Button>
                  </div>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                    {teamMembers.map((member) => (
                      <div
                        key={member.id}
                        className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors ${
                          selectedTeamMembers.includes(member.id) ? "bg-secondary/50" : "hover:bg-secondary/30"
                        }`}
                        onClick={() => toggleTeamMember(member.id)}
                      >
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                            <AvatarFallback>
                              {member.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{member.name}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {member.availability}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="projects" className="space-y-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Proyectos</span>
                    <Button variant="ghost" size="sm" className="h-8 text-xs">
                      Seleccionar todos
                    </Button>
                  </div>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                    {projects.map((project) => (
                      <div
                        key={project.id}
                        className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors ${
                          selectedProjects.includes(project.id) ? "bg-secondary/50" : "hover:bg-secondary/30"
                        }`}
                        onClick={() => toggleProject(project.id)}
                      >
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: project.color }}></div>
                          <span className="text-sm">{project.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <CalendarLegend />
          <CalendarFilters />
        </div>

        <div className="md:col-span-3">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>Calendario de Disponibilidad</CardTitle>
                <Tabs value={view} onValueChange={(v) => setView(v as "team" | "projects")} className="w-auto">
                  <TabsList className="grid w-[240px] grid-cols-2">
                    <TabsTrigger value="team">Vista por Equipo</TabsTrigger>
                    <TabsTrigger value="projects">Vista por Proyectos</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent>
              {view === "team" ? (
                <TeamCalendar
                  currentDate={currentDate}
                  teamMembers={teamMembers.filter((member) => selectedTeamMembers.includes(member.id))}
                  projects={projects.filter((project) => selectedProjects.includes(project.id))}
                />
              ) : (
                <ProjectsCalendar
                  currentDate={currentDate}
                  projects={projects.filter((project) => selectedProjects.includes(project.id))}
                  teamMembers={teamMembers.filter((member) => selectedTeamMembers.includes(member.id))}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <AddEventDialog
        open={isAddEventOpen}
        onOpenChange={setIsAddEventOpen}
        teamMembers={teamMembers}
        projects={projects}
      />
    </div>
  )
}

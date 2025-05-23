"use client"

import { useState } from "react"
import { MoreHorizontal, ArrowUpDown, Calendar, AlertCircle, Database, Code, Globe } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Datos de ejemplo para la tabla
const projectsData = [
  {
    id: "PRJ001",
    name: "AYR sistema de domótica",
    status: "En progreso",
    progress: 75,
    startDate: "01/01/2025",
    dueDate: "15/06/2025",
    priority: "Alta",
    technologies: {
      frontend: ["React", "TypeScript", "Tailwind CSS"],
      backend: ["Node.js", "Express"],
      database: ["MongoDB"],
      other: ["WebSockets", "Arduino"],
    },
    team: [
      { name: "Ana Martínez", role: "Desarrolladora Frontend (React)", avatar: "/placeholder.svg?height=32&width=32" },
      { name: "Carlos Ruiz", role: "Desarrollador Backend (Node.js)", avatar: "/placeholder.svg?height=32&width=32" },
      { name: "Elena Gómez", role: "Diseñadora UX/UI (Figma)", avatar: "/placeholder.svg?height=32&width=32" },
    ],
  },
  {
    id: "PRJ002",
    name: "GSW Tienda de pinceles",
    status: "En progreso",
    progress: 45,
    startDate: "15/02/2025",
    dueDate: "30/07/2025",
    priority: "Media",
    technologies: {
      frontend: ["Vue.js", "JavaScript", "SCSS"],
      backend: ["PHP", "Laravel"],
      database: ["MySQL"],
      other: ["AWS S3", "Stripe"],
    },
    team: [
      { name: "Carlos Ruiz", role: "Desarrollador Backend (Laravel)", avatar: "/placeholder.svg?height=32&width=32" },
      { name: "Javier López", role: "DevOps (AWS, Docker)", avatar: "/placeholder.svg?height=32&width=32" },
    ],
  },
  {
    id: "PRJ003",
    name: "ADPOINT Pádel",
    status: "En progreso",
    progress: 20,
    startDate: "01/03/2025",
    dueDate: "10/09/2025",
    priority: "Alta",
    technologies: {
      frontend: ["React Native", "TypeScript"],
      backend: ["Python", "Django"],
      database: ["PostgreSQL"],
      other: ["Firebase", "Google Maps API"],
    },
    team: [
      {
        name: "Ana Martínez",
        role: "Desarrolladora Frontend (React Native)",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      { name: "Elena Gómez", role: "Diseñadora UX/UI (Sketch)", avatar: "/placeholder.svg?height=32&width=32" },
      { name: "Javier López", role: "DevOps (GCP, Kubernetes)", avatar: "/placeholder.svg?height=32&width=32" },
    ],
  },
  {
    id: "PRJ004",
    name: "Sistema de Notificaciones",
    status: "Planificación",
    progress: 5,
    startDate: "15/05/2025",
    dueDate: "30/10/2025",
    priority: "Media",
    technologies: {
      frontend: ["Angular", "TypeScript"],
      backend: ["Java", "Spring Boot"],
      database: ["Oracle"],
      other: ["RabbitMQ", "WebSockets"],
    },
    team: [
      { name: "Carlos Ruiz", role: "Desarrollador Backend (Java)", avatar: "/placeholder.svg?height=32&width=32" },
    ],
  },
  {
    id: "PRJ005",
    name: "Migración Base de Datos",
    status: "Completado",
    progress: 100,
    startDate: "01/01/2025",
    dueDate: "01/04/2025",
    priority: "Alta",
    technologies: {
      frontend: ["N/A"],
      backend: ["Python", "ETL Scripts"],
      database: ["PostgreSQL", "MongoDB"],
      other: ["Apache Airflow", "Docker"],
    },
    team: [
      { name: "Javier López", role: "DevOps (Docker, Kubernetes)", avatar: "/placeholder.svg?height=32&width=32" },
      { name: "Carlos Ruiz", role: "Desarrollador Backend (Python)", avatar: "/placeholder.svg?height=32&width=32" },
    ],
  },
]

export function ProjectsTable() {
  const [sortColumn, setSortColumn] = useState("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const sortedProjects = [...projectsData].sort((a, b) => {
    const aValue = a[sortColumn as keyof typeof a]
    const bValue = b[sortColumn as keyof typeof b]

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue
    }

    return 0
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "En progreso":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100/80 border border-blue-200"
      case "Completado":
        return "bg-green-100 text-green-800 hover:bg-green-100/80 border border-green-200"
      case "Planificación":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100/80 border border-purple-200"
      case "Pausado":
        return "bg-amber-100 text-amber-800 hover:bg-amber-100/80 border border-amber-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100/80 border border-gray-200"
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "Alta":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "Media":
        return <AlertCircle className="h-4 w-4 text-amber-500" />
      case "Baja":
        return <AlertCircle className="h-4 w-4 text-green-500" />
      default:
        return null
    }
  }

  return (
    <div className="rounded-md border bg-white">
      <TooltipProvider>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("name")}
                  className="flex items-center gap-1 p-0 font-medium"
                >
                  Nombre
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Progreso</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("dueDate")}
                  className="flex items-center gap-1 p-0 font-medium"
                >
                  Fecha Límite
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("priority")}
                  className="flex items-center gap-1 p-0 font-medium"
                >
                  Prioridad
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Tecnologías</TableHead>
              <TableHead>Equipo</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedProjects.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="font-medium">{project.id}</TableCell>
                <TableCell>{project.name}</TableCell>
                <TableCell>
                  <Badge className={cn(getStatusColor(project.status))}>{project.status}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={project.progress} className="h-2 w-[60px]" />
                    <span className="text-xs">{project.progress}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    <span>{project.dueDate}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {getPriorityIcon(project.priority)}
                    <span>{project.priority}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge variant="outline" className="bg-blue-50">
                          <Globe className="h-3 w-3 mr-1" />
                          {project.technologies.frontend[0]}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="font-semibold">Frontend:</p>
                        <p>{project.technologies.frontend.join(", ")}</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge variant="outline" className="bg-green-50">
                          <Code className="h-3 w-3 mr-1" />
                          {project.technologies.backend[0]}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="font-semibold">Backend:</p>
                        <p>{project.technologies.backend.join(", ")}</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge variant="outline" className="bg-purple-50">
                          <Database className="h-3 w-3 mr-1" />
                          {project.technologies.database[0]}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="font-semibold">Base de datos:</p>
                        <p>{project.technologies.database.join(", ")}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex -space-x-2">
                    {project.team.slice(0, 3).map((member, index) => (
                      <Tooltip key={index}>
                        <TooltipTrigger asChild>
                          <Avatar className="h-6 w-6 border-2 border-background">
                            <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                            <AvatarFallback className="text-[10px]">
                              {member.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="font-semibold">{member.name}</p>
                          <p>{member.role}</p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                    {project.team.length > 3 && (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-muted text-[10px] font-medium">
                        +{project.team.length - 3}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Abrir menú</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Ver detalles</DropdownMenuItem>
                      <DropdownMenuItem>Editar proyecto</DropdownMenuItem>
                      <DropdownMenuItem>Gestionar equipo</DropdownMenuItem>
                      <DropdownMenuItem>Archivar proyecto</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TooltipProvider>
    </div>
  )
}

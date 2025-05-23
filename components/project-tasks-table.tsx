"use client"

import { useState } from "react"
import {
  MoreHorizontal,
  ArrowUpDown,
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  Code,
  Database,
  Globe,
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Datos de ejemplo para la tabla de tareas
const tasksData = [
  {
    id: "TSK001",
    title: "Diseño de interfaz de control",
    status: "Completada",
    assignee: {
      name: "Elena Gómez",
      avatar: "/placeholder.svg?height=32&width=32",
      role: "Diseñadora UX/UI (Figma)",
    },
    dueDate: "10/05/2025",
    priority: "Alta",
    technology: "Frontend",
  },
  {
    id: "TSK002",
    title: "Implementación de reconocimiento facial",
    status: "En progreso",
    assignee: {
      name: "Carlos Ruiz",
      avatar: "/placeholder.svg?height=32&width=32",
      role: "Desarrollador Backend (Node.js)",
    },
    dueDate: "20/05/2025",
    priority: "Alta",
    technology: "Backend",
  },
  {
    id: "TSK003",
    title: "Desarrollo de API para control remoto",
    status: "En progreso",
    assignee: {
      name: "Carlos Ruiz",
      avatar: "/placeholder.svg?height=32&width=32",
      role: "Desarrollador Backend (Node.js)",
    },
    dueDate: "25/05/2025",
    priority: "Media",
    technology: "Backend",
  },
  {
    id: "TSK004",
    title: "Pruebas de seguridad",
    status: "Pendiente",
    assignee: {
      name: "Laura Sánchez",
      avatar: "/placeholder.svg?height=32&width=32",
      role: "QA Tester (Cypress)",
    },
    dueDate: "01/06/2025",
    priority: "Media",
    technology: "Testing",
  },
  {
    id: "TSK005",
    title: "Optimización de rendimiento",
    status: "Pendiente",
    assignee: {
      name: "Javier López",
      avatar: "/placeholder.svg?height=32&width=32",
      role: "DevOps (Docker, Kubernetes)",
    },
    dueDate: "05/06/2025",
    priority: "Baja",
    technology: "DevOps",
  },
]

interface ProjectTasksTableProps {
  projectId: string
}

export function ProjectTasksTable({ projectId }: ProjectTasksTableProps) {
  const [sortColumn, setSortColumn] = useState("dueDate")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const sortedTasks = [...tasksData].sort((a, b) => {
    const aValue = a[sortColumn as keyof typeof a]
    const bValue = b[sortColumn as keyof typeof b]

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    }

    return 0
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completada":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "En progreso":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "Pendiente":
        return <Circle className="h-4 w-4 text-gray-400" />
      default:
        return null
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

  const getTechnologyIcon = (technology: string) => {
    switch (technology) {
      case "Frontend":
        return <Globe className="h-4 w-4 text-blue-500" />
      case "Backend":
        return <Code className="h-4 w-4 text-green-500" />
      case "Database":
        return <Database className="h-4 w-4 text-purple-500" />
      case "Testing":
        return <CheckCircle2 className="h-4 w-4 text-orange-500" />
      case "DevOps":
        return <Code className="h-4 w-4 text-indigo-500" />
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
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("title")}
                  className="flex items-center gap-1 p-0 font-medium"
                >
                  Tarea
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Asignado a</TableHead>
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
              <TableHead>Tecnología</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell className="font-medium">{task.id}</TableCell>
                <TableCell>{task.title}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(task.status)}
                    <span>{task.status}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={task.assignee.avatar || "/placeholder.svg"} alt={task.assignee.name} />
                          <AvatarFallback className="text-[10px]">
                            {task.assignee.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span>{task.assignee.name}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{task.assignee.role}</p>
                    </TooltipContent>
                  </Tooltip>
                </TableCell>
                <TableCell>{task.dueDate}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getPriorityIcon(task.priority)}
                    <span>{task.priority}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="flex items-center gap-1">
                    {getTechnologyIcon(task.technology)}
                    <span>{task.technology}</span>
                  </Badge>
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
                      <DropdownMenuItem>Editar tarea</DropdownMenuItem>
                      <DropdownMenuItem>Cambiar estado</DropdownMenuItem>
                      <DropdownMenuItem>Reasignar</DropdownMenuItem>
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

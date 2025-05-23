"use client"

import { useState } from "react"
import { MoreHorizontal, ArrowUpDown, Mail, Phone, Code2, Cpu } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Datos de ejemplo para la tabla
const teamData = [
  {
    id: "EMP001",
    name: "Ana Martínez",
    role: "Desarrolladora Frontend",
    email: "ana.martinez@ejemplo.com",
    phone: "+34 600 123 456",
    projects: 4,
    status: "Activo",
    avatar: "/placeholder.svg?height=40&width=40",
    technologies: ["React", "TypeScript", "React Native", "Tailwind CSS", "Redux"],
  },
  {
    id: "EMP002",
    name: "Carlos Ruiz",
    role: "Desarrollador Backend",
    email: "carlos.ruiz@ejemplo.com",
    phone: "+34 600 234 567",
    projects: 3,
    status: "Activo",
    avatar: "/placeholder.svg?height=40&width=40",
    technologies: ["Node.js", "Python", "Java", "MongoDB", "PostgreSQL", "Express", "Django"],
  },
  {
    id: "EMP003",
    name: "Elena Gómez",
    role: "Diseñadora UX/UI",
    email: "elena.gomez@ejemplo.com",
    phone: "+34 600 345 678",
    projects: 5,
    status: "Activo",
    avatar: "/placeholder.svg?height=40&width=40",
    technologies: ["Figma", "Sketch", "Adobe XD", "HTML/CSS", "Prototyping"],
  },
  {
    id: "EMP004",
    name: "Javier López",
    role: "DevOps",
    email: "javier.lopez@ejemplo.com",
    phone: "+34 600 456 789",
    projects: 2,
    status: "Activo",
    avatar: "/placeholder.svg?height=40&width=40",
    technologies: ["Docker", "Kubernetes", "AWS", "GCP", "CI/CD", "Terraform", "Ansible"],
  },
  {
    id: "EMP005",
    name: "Laura Sánchez",
    role: "Desarrolladora Backend",
    email: "laura.sanchez@ejemplo.com",
    phone: "+34 600 567 890",
    projects: 1,
    status: "Vacaciones",
    avatar: "/placeholder.svg?height=40&width=40",
    technologies: ["PHP", "Laravel", "MySQL", "Redis", "GraphQL"],
  },
  {
    id: "EMP006",
    name: "Miguel Torres",
    role: "Desarrollador Frontend",
    email: "miguel.torres@ejemplo.com",
    phone: "+34 600 678 901",
    projects: 3,
    status: "Activo",
    avatar: "/placeholder.svg?height=40&width=40",
    technologies: ["Angular", "TypeScript", "SCSS", "RxJS", "NgRx"],
  },
  {
    id: "EMP007",
    name: "Sofía Navarro",
    role: "QA Tester",
    email: "sofia.navarro@ejemplo.com",
    phone: "+34 600 789 012",
    projects: 4,
    status: "Activo",
    avatar: "/placeholder.svg?height=40&width=40",
    technologies: ["Selenium", "Cypress", "Jest", "Postman", "TestRail", "JIRA"],
  },
]

export function TeamTable() {
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

  const sortedTeam = [...teamData].sort((a, b) => {
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
      case "Activo":
        return "bg-green-100 text-green-800 hover:bg-green-100/80 border border-green-200"
      case "Vacaciones":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100/80 border border-blue-200"
      case "Baja":
        return "bg-red-100 text-red-800 hover:bg-red-100/80 border border-red-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100/80 border border-gray-200"
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
                  onClick={() => handleSort("name")}
                  className="flex items-center gap-1 p-0 font-medium"
                >
                  Nombre
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("role")}
                  className="flex items-center gap-1 p-0 font-medium"
                >
                  Rol
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Contacto</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("projects")}
                  className="flex items-center gap-1 p-0 font-medium"
                >
                  Proyectos
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Tecnologías</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTeam.map((member) => (
              <TableRow key={member.id}>
                <TableCell className="font-medium">{member.id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                      <AvatarFallback>
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span>{member.name}</span>
                  </div>
                </TableCell>
                <TableCell>{member.role}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1 text-xs">
                      <Mail className="h-3 w-3 text-muted-foreground" />
                      <span>{member.email}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      <span>{member.phone}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="flex items-center gap-1">
                  <Code2 className="h-4 w-4 text-muted-foreground" />
                  <span>{member.projects}</span>
                </TableCell>
                <TableCell>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline" className="bg-blue-50 flex items-center">
                          <Cpu className="h-3 w-3 mr-1" />
                          {member.technologies.length}
                        </Badge>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="font-semibold">Tecnologías:</p>
                      <p>{member.technologies.join(", ")}</p>
                    </TooltipContent>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Badge className={cn(getStatusColor(member.status))}>{member.status}</Badge>
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
                      <DropdownMenuItem>Ver perfil</DropdownMenuItem>
                      <DropdownMenuItem>Editar información</DropdownMenuItem>
                      <DropdownMenuItem>Ver proyectos asignados</DropdownMenuItem>
                      <DropdownMenuItem>Cambiar estado</DropdownMenuItem>
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

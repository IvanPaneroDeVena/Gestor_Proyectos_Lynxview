"use client"

import { useState } from "react"
import { ArrowUpDown, MoreHorizontal, FileText, BarChart3, Download } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface HorasEquipoTableProps {
  month: string
  year: string
}

export function HorasEquipoTable({ month, year }: HorasEquipoTableProps) {
  const [sortColumn, setSortColumn] = useState("nombre")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  // Datos de ejemplo para las horas por miembro del equipo
  const horasEquipoData = [
    {
      id: "EMP001",
      nombre: "Ana Martínez",
      rol: "Desarrolladora Frontend",
      avatar: "/placeholder.svg?height=40&width=40",
      horasAsignadas: 160,
      horasRegistradas: 155,
      utilizacion: 97,
      proyectos: [
        { nombre: "AYR sistema de domótica", horas: 45, id: "PRJ001" },
        { nombre: "ADPOINT Pádel", horas: 50, id: "PRJ003" },
        { nombre: "Formación interna", horas: 10, id: "INT001" },
        { nombre: "Reuniones", horas: 15, id: "INT002" },
        { nombre: "Soporte", horas: 35, id: "SUP001" },
      ],
      tareas: {
        completadas: 22,
        total: 25,
      },
    },
    {
      id: "EMP002",
      nombre: "Carlos Ruiz",
      rol: "Desarrollador Backend",
      avatar: "/placeholder.svg?height=40&width=40",
      horasAsignadas: 160,
      horasRegistradas: 145,
      utilizacion: 91,
      proyectos: [
        { nombre: "AYR sistema de domótica", horas: 35, id: "PRJ001" },
        { nombre: "GSW Tienda de pinceles", horas: 40, id: "PRJ002" },
        { nombre: "Sistema de Notificaciones", horas: 40, id: "PRJ004" },
        { nombre: "Migración Base de Datos", horas: 30, id: "PRJ005" },
      ],
      tareas: {
        completadas: 18,
        total: 20,
      },
    },
    {
      id: "EMP003",
      nombre: "Elena Gómez",
      rol: "Diseñadora UX/UI",
      avatar: "/placeholder.svg?height=40&width=40",
      horasAsignadas: 160,
      horasRegistradas: 150,
      utilizacion: 94,
      proyectos: [
        { nombre: "AYR sistema de domótica", horas: 40, id: "PRJ001" },
        { nombre: "ADPOINT Pádel", horas: 60, id: "PRJ003" },
        { nombre: "Formación interna", horas: 15, id: "INT001" },
        { nombre: "Reuniones", horas: 35, id: "INT002" },
      ],
      tareas: {
        completadas: 15,
        total: 18,
      },
    },
    {
      id: "EMP004",
      nombre: "Javier López",
      rol: "DevOps",
      avatar: "/placeholder.svg?height=40&width=40",
      horasAsignadas: 160,
      horasRegistradas: 165,
      utilizacion: 103,
      proyectos: [
        { nombre: "GSW Tienda de pinceles", horas: 45, id: "PRJ002" },
        { nombre: "ADPOINT Pádel", horas: 40, id: "PRJ003" },
        { nombre: "Migración Base de Datos", horas: 30, id: "PRJ005" },
        { nombre: "Soporte", horas: 50, id: "SUP001" },
      ],
      tareas: {
        completadas: 28,
        total: 30,
      },
    },
    {
      id: "EMP005",
      nombre: "Laura Sánchez",
      rol: "QA Tester",
      avatar: "/placeholder.svg?height=40&width=40",
      horasAsignadas: 160,
      horasRegistradas: 140,
      utilizacion: 88,
      proyectos: [
        { nombre: "AYR sistema de domótica", horas: 30, id: "PRJ001" },
        { nombre: "GSW Tienda de pinceles", horas: 25, id: "PRJ002" },
        { nombre: "ADPOINT Pádel", horas: 35, id: "PRJ003" },
        { nombre: "Sistema de Notificaciones", horas: 20, id: "PRJ004" },
        { nombre: "Migración Base de Datos", horas: 30, id: "PRJ005" },
      ],
      tareas: {
        completadas: 42,
        total: 45,
      },
    },
  ]

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const sortedData = [...horasEquipoData].sort((a, b) => {
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

  const getUtilizacionColor = (utilizacion: number) => {
    if (utilizacion > 100) return "text-red-600"
    if (utilizacion > 90) return "text-green-600"
    if (utilizacion > 80) return "text-amber-600"
    return "text-blue-600"
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
                  onClick={() => handleSort("nombre")}
                  className="flex items-center gap-1 p-0 font-medium"
                >
                  Miembro
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("horasAsignadas")}
                  className="flex items-center gap-1 p-0 font-medium"
                >
                  Horas Asignadas
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("horasRegistradas")}
                  className="flex items-center gap-1 p-0 font-medium"
                >
                  Horas Registradas
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("utilizacion")}
                  className="flex items-center gap-1 p-0 font-medium"
                >
                  Utilización
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Proyectos</TableHead>
              <TableHead>Tareas</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((miembro) => (
              <TableRow key={miembro.id}>
                <TableCell className="font-medium">{miembro.id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={miembro.avatar || "/placeholder.svg"} alt={miembro.nombre} />
                      <AvatarFallback>
                        {miembro.nombre
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span>{miembro.nombre}</span>
                  </div>
                </TableCell>
                <TableCell>{miembro.rol}</TableCell>
                <TableCell>{miembro.horasAsignadas}</TableCell>
                <TableCell>{miembro.horasRegistradas}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-medium ${getUtilizacionColor(miembro.utilizacion)}`}>
                        {miembro.utilizacion}%
                      </span>
                    </div>
                    <Progress
                      value={miembro.utilizacion}
                      className="h-2"
                      indicatorClassName={
                        miembro.utilizacion > 100
                          ? "bg-red-500"
                          : miembro.utilizacion > 90
                            ? "bg-green-500"
                            : miembro.utilizacion > 80
                              ? "bg-amber-500"
                              : "bg-blue-500"
                      }
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge variant="outline" className="text-xs">
                          {miembro.proyectos.length} proyectos
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent className="w-60">
                        <div className="space-y-2">
                          <p className="font-semibold">Distribución de horas:</p>
                          {miembro.proyectos.map((proyecto, index) => (
                            <div key={index} className="flex justify-between items-center">
                              <span className="text-xs">{proyecto.nombre}</span>
                              <span className="text-xs font-medium">{proyecto.horas} horas</span>
                            </div>
                          ))}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-xs">
                    {miembro.tareas.completadas}/{miembro.tareas.total} completadas
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
                      <DropdownMenuItem className="flex items-center">
                        <FileText className="h-4 w-4 mr-2" /> Ver detalles
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center">
                        <BarChart3 className="h-4 w-4 mr-2" /> Ver gráficos
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center">
                        <Download className="h-4 w-4 mr-2" /> Exportar datos
                      </DropdownMenuItem>
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

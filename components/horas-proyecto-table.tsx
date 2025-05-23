"use client"

import { useState } from "react"
import { ArrowUpDown, MoreHorizontal, FileText, BarChart3, Download } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface HorasProyectoTableProps {
  month: string
  year: string
}

export function HorasProyectoTable({ month, year }: HorasProyectoTableProps) {
  const [sortColumn, setSortColumn] = useState("proyecto")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  // Datos de ejemplo para las horas por proyecto
  const horasProyectoData = [
    {
      id: "PRJ001",
      proyecto: "AYR sistema de domótica",
      cliente: "Empresa AYR",
      horasEstimadas: 150,
      horasRegistradas: 120,
      horasPendientes: 30,
      progreso: 80,
      miembros: [
        { nombre: "Ana Martínez", horas: 45, avatar: "/placeholder.svg?height=32&width=32" },
        { nombre: "Carlos Ruiz", horas: 35, avatar: "/placeholder.svg?height=32&width=32" },
        { nombre: "Elena Gómez", horas: 40, avatar: "/placeholder.svg?height=32&width=32" },
      ],
      tareas: {
        completadas: 18,
        total: 25,
      },
    },
    {
      id: "PRJ002",
      proyecto: "GSW Tienda de pinceles",
      cliente: "GSW Artesanía",
      horasEstimadas: 100,
      horasRegistradas: 85,
      horasPendientes: 15,
      progreso: 85,
      miembros: [
        { nombre: "Carlos Ruiz", horas: 40, avatar: "/placeholder.svg?height=32&width=32" },
        { nombre: "Javier López", horas: 45, avatar: "/placeholder.svg?height=32&width=32" },
      ],
      tareas: {
        completadas: 12,
        total: 15,
      },
    },
    {
      id: "PRJ003",
      proyecto: "ADPOINT Pádel",
      cliente: "Club Deportivo ADPOINT",
      horasEstimadas: 200,
      horasRegistradas: 150,
      horasPendientes: 50,
      progreso: 75,
      miembros: [
        { nombre: "Ana Martínez", horas: 50, avatar: "/placeholder.svg?height=32&width=32" },
        { nombre: "Elena Gómez", horas: 60, avatar: "/placeholder.svg?height=32&width=32" },
        { nombre: "Javier López", horas: 40, avatar: "/placeholder.svg?height=32&width=32" },
      ],
      tareas: {
        completadas: 20,
        total: 30,
      },
    },
    {
      id: "PRJ004",
      proyecto: "Sistema de Notificaciones",
      cliente: "Tecnologías Avanzadas S.L.",
      horasEstimadas: 50,
      horasRegistradas: 40,
      horasPendientes: 10,
      progreso: 80,
      miembros: [{ nombre: "Carlos Ruiz", horas: 40, avatar: "/placeholder.svg?height=32&width=32" }],
      tareas: {
        completadas: 8,
        total: 10,
      },
    },
    {
      id: "PRJ005",
      proyecto: "Migración Base de Datos",
      cliente: "Banco Nacional",
      horasEstimadas: 80,
      horasRegistradas: 60,
      horasPendientes: 20,
      progreso: 75,
      miembros: [
        { nombre: "Javier López", horas: 30, avatar: "/placeholder.svg?height=32&width=32" },
        { nombre: "Carlos Ruiz", horas: 30, avatar: "/placeholder.svg?height=32&width=32" },
      ],
      tareas: {
        completadas: 12,
        total: 18,
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

  const sortedData = [...horasProyectoData].sort((a, b) => {
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
                  onClick={() => handleSort("proyecto")}
                  className="flex items-center gap-1 p-0 font-medium"
                >
                  Proyecto
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("horasEstimadas")}
                  className="flex items-center gap-1 p-0 font-medium"
                >
                  Horas Estimadas
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
              <TableHead>Progreso</TableHead>
              <TableHead>Equipo</TableHead>
              <TableHead>Tareas</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((proyecto) => (
              <TableRow key={proyecto.id}>
                <TableCell className="font-medium">{proyecto.id}</TableCell>
                <TableCell>{proyecto.proyecto}</TableCell>
                <TableCell>{proyecto.cliente}</TableCell>
                <TableCell>{proyecto.horasEstimadas}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">{proyecto.horasRegistradas}</span>
                    <span className="text-xs text-muted-foreground">({proyecto.horasPendientes} pendientes)</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs">{proyecto.progreso}%</span>
                    </div>
                    <Progress value={proyecto.progreso} className="h-2" />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex -space-x-2">
                    {proyecto.miembros.slice(0, 3).map((miembro, index) => (
                      <Tooltip key={index}>
                        <TooltipTrigger asChild>
                          <Avatar className="h-6 w-6 border-2 border-background">
                            <AvatarImage src={miembro.avatar || "/placeholder.svg"} alt={miembro.nombre} />
                            <AvatarFallback className="text-[10px]">
                              {miembro.nombre
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="font-semibold">{miembro.nombre}</p>
                          <p>{miembro.horas} horas</p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                    {proyecto.miembros.length > 3 && (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-muted text-[10px] font-medium">
                        +{proyecto.miembros.length - 3}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-xs">
                    {proyecto.tareas.completadas}/{proyecto.tareas.total} completadas
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
